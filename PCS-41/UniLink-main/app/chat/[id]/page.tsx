import { authOptions } from "@/lib/auth/auth-options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";
import Chat from "../chat";
import { fetchChat } from "./action";

const ChatPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  const { id } = await params;
  const chat = await fetchChat(id);

  if (!chat) {
    notFound();
  }

  console.log(
    "In /chat/:id server component chat.messages.length is ",
    chat.messages.length
  );

  return (
    <Chat
      initialMessages={chat.messages}
      user={session.user}
      chatId={id}
      newChat={false}
    />
  );
};

export default ChatPage;
