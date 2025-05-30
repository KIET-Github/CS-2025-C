import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in" },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { institutionProfile: true },
    });

    if (
      !currentUser ||
      currentUser.role !== "INSTITUTION_ADMIN" ||
      !currentUser.institutionProfile
    ) {
      return NextResponse.json(
        { error: "Forbidden: You must be an institution admin" },
        { status: 403 }
      );
    }

    const institutionId = currentUser.institutionProfile.institutionId;

    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        verificationStatus: "APPROVED",
        studentProfile: {
          institutionId: institutionId,
          placements: {
            none: {},
          },
        },
      },
      include: {
        studentProfile: true,
        documents: true,
      },
    });

    return NextResponse.json({ students });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { error: "Failed to fetch unplaced students" },
      { status: 500 }
    );
  }
}
