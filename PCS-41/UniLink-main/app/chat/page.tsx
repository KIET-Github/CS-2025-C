import { authOptions } from "@/lib/auth/auth-options";
import { generateID } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Chat from "./chat";

export async function generateMetadata() {
  return {
    title: `New Chat`,
    description: `Start a new Chat`,
  };
}

const ChatPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/sign-in");
  }

  const id = generateID();

  return (
    <Chat initialMessages={[]} chatId={id} newChat={true} user={session.user} />
  );
};

export default ChatPage;
