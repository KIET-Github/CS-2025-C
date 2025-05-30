import { MessageRole } from "@prisma/client";
import { useState } from "react";

export type ClientMessage = {
  id: string;
  role: MessageRole;
  content: string;
  isStreaming?: boolean;
};

export default function useMessages(
  initialMessages: ClientMessage[],
  chatId: string
) {
  const [messages, setMessages] = useState<ClientMessage[]>(initialMessages);

  const sendMessage = async (input: string) => {
    const userMessage: ClientMessage = {
      id: crypto.randomUUID(),
      role: MessageRole.user,
      content: input,
    };
    const modelMessage: ClientMessage = {
      id: "streaming",
      role: MessageRole.model,
      content: "",
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, modelMessage]);

    const res = await fetch(`/api/chat/${chatId}/ask`, {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "streaming"
            ? { ...msg, content: msg.content + chunk }
            : msg
        )
      );
    }

    // Remove the isStreaming flag so UI can render it as a full response
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === "streaming"
          ? { ...msg, id: crypto.randomUUID(), isStreaming: false }
          : msg
      )
    );
  };

  return { messages, sendMessage };
}
