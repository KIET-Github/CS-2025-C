import { authOptions } from "@/lib/auth/auth-options";
import { chatSystemPrompt } from "@/lib/prompt";
import { generateTitleFromUserMessage } from "@/lib/utils";
import { prisma } from "@/lib/utils/prisma";
import { GoogleGenAI } from "@google/genai";
import { MessageRole } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;
  console.log("id is ", id);
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { message } = await req.json();

    console.log("message is ", message);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required.");
    }

    let chat = await prisma.chat.findFirst({
      where: {
        id,
      },
    });

    if (!chat) {
      const title = await generateTitleFromUserMessage(message);

      chat = await prisma.chat.create({
        data: {
          id,
          title,
          userId: session.user.id,
          createdAt: new Date(),
        },
      });

      console.log("new Chat is ", chat);
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const newUserMessage = await prisma.message.create({
      data: {
        chatId: id,
        role: MessageRole.user,
        content: message,
      },
    });

    console.log("newUserMessage is ", newUserMessage);

    const lastMessages = await prisma.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    const history = lastMessages.map((msg) => ({
      role: msg.role === MessageRole.user ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    console.log("history.length is ", history.length);

    const aiChat = ai.chats.create({
      model: "gemini-2.0-flash",
      history,
    });

    console.log("After Chat.");
    const stream = await aiChat.sendMessageStream({
      config: {
        systemInstruction: chatSystemPrompt,
        temperature: 0.1,
      },
      message: message,
    });

    console.log("After stream.");
    let fullResponse = "";

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          fullResponse += chunk.text;
          console.log("chunk.text is ", chunk.text);
          controller.enqueue(encoder.encode(chunk.text));
        }
        controller.close();

        const newModelMessage = await prisma.message.create({
          data: {
            chatId: id,
            role: MessageRole.model,
            content: fullResponse,
          },
        });
        console.log("newModelMessage is ", newModelMessage);
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return Response.json({ message: "Error occurred" });
  }
}
