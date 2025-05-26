import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { Role, UserVerificationStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify that the requester is a SUPER_ADMIN
    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email },
    // });

    // if (!user || user.role !== "SUPER_ADMIN") {
    //   return NextResponse.json(
    //     { message: "Forbidden: Only SUPER_ADMIN can access this endpoint" },
    //     { status: 403 }
    //   );
    // }

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const roleFilter = searchParams.get("role") as Role;
    const statusFilter =
      (searchParams.get("status") as UserVerificationStatus) || "PENDING";

    // Get all pending verification requests
    const pendingUsers = await prisma.user.findMany({
      where: {
        verificationStatus: statusFilter,
        role: roleFilter,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verificationStatus: true,
        documents: {
          select: {
            id: true,
            type: true,
            fileUrl: true,
            createdAt: true,
          },
        },
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
        governmentProfile: {
          include: {
            government: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users: pendingUsers }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Error fetching verification requests", error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify that the requester is a SUPER_ADMIN
    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email },
    // });

    // if (!user || user.role !== "SUPER_ADMIN") {
    //   return NextResponse.json(
    //     { message: "Forbidden: Only SUPER_ADMIN can access this endpoint" },
    //     { status: 403 }
    //   );
    // }

    // Get the request body
    const body = await request.json();
    const { userId, status, feedback } = body;

    // Validate the request parameters
    if (!userId || !status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // Get the user's current information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        institutionProfile: true,
        companyProfile: true,
        governmentProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update the user's verification status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: status as UserVerificationStatus,
        feedback: feedback || null,
      },
    });

    if (status === "REJECTED") {
      await prisma.$transaction([
        prisma.institutionProfile.deleteMany({ where: { userId } }),
        prisma.companyProfile.deleteMany({ where: { userId } }),
        prisma.governmentProfile.deleteMany({ where: { userId } }),
        prisma.document.deleteMany({ where: { userId } }),
      ]);
    }

    return NextResponse.json(
      {
        message: `User verification status updated to ${status}`,
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Error updating verification status", error },
      { status: 500 }
    );
  }
}
