import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      select: {
        id: true,
        role: true,
        verificationStatus: true,
        feedback: true,
        institutionProfile: {
          include: {
            institution: true,
          },
        },
        companyProfile: {
          include: {
            company: true,
          },
        },
        studentProfile: {
          include: {
            institution: true,
          },
        },
        governmentProfile: {
          include: {
            government: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
