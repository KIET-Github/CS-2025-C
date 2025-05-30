import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";

export async function fetchChat(id: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const chat = await prisma.chat.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!chat) {
    return null;
  }

  if (chat.userId === session.user.id) {
    return chat;
  }
}
