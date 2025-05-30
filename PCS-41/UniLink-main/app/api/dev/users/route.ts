import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the session to check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" });
    }

    // Fetch all institutions
    const users = await prisma.user.findMany({});

    return NextResponse.json(users);
  } catch (error) {
    console.log("Error fetching documents.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json({ message: "Internal server error" });
  }
}
