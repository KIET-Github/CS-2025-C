import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { UserVerificationStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateVerificationSchema = z.object({
  userId: z.string(),
  status: z.enum(["APPROVED", "REJECTED"]),
  feedback: z.string().optional(),
});

// GET: Fetch students based on verification status
export async function GET(request: NextRequest) {
  try {
    // 1. Get the current session to identify the admin
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 2. Check if the user is an institution admin
    const adminUser = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        // role: "INSTITUTION_ADMIN",
      },
      include: {
        institutionProfile: true,
      },
    });

    if (!adminUser || !adminUser.institutionProfile) {
      return NextResponse.json(
        {
          message:
            "Access denied. Only institution admins can access this resource.",
        },
        { status: 403 }
      );
    }

    const institutionId = adminUser.institutionProfile.institutionId;

    // 3. Get query status parameter
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        {
          message:
            "Invalid status parameter. Use PENDING, APPROVED, or REJECTED.",
        },
        { status: 400 }
      );
    }

    // 4. Fetch students based on query status
    const students = await prisma.user.findMany({
      where: {
        studentProfile: {
          institutionId: institutionId,
        },
        verificationStatus: status as UserVerificationStatus,
      },
      select: {
        id: true,
        name: true,
        email: true,
        verificationStatus: true,
        feedback: true,
        studentProfile: {
          select: {
            enrollmentNo: true,
            graduationYear: true,
          },
        },
        documents: {
          select: {
            id: true,
            type: true,
            fileUrl: true,
            createdAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log("students is ", students);

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Failed to fetch verification requests" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Verify user is an institution admin
    const admin = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        role: "INSTITUTION_ADMIN",
      },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "You don't have permission to perform this action." },
        { status: 403 }
      );
    }

    // Get admin's institution
    const adminProfile = await prisma.institutionProfile.findUnique({
      where: {
        userId: admin.id,
      },
      include: {
        institution: true,
      },
    });

    if (!adminProfile) {
      return NextResponse.json(
        { message: "Admin profile not found." },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = updateVerificationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid request data.",
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { userId, status, feedback } = validationResult.data;

    // Find the student to verify
    const student = await prisma.user.findFirst({
      where: {
        id: userId,
        role: "STUDENT",
        verificationStatus: "PENDING",
      },
      include: {
        studentProfile: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found or already verified." },
        { status: 404 }
      );
    }

    // Check if student belongs to admin's institution
    if (student.studentProfile?.institutionId !== adminProfile.institutionId) {
      return NextResponse.json(
        { message: "You can only verify students from your institution." },
        { status: 403 }
      );
    }

    // Update verification status
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        verificationStatus: status === "APPROVED" ? "APPROVED" : "REJECTED",
        feedback: status === "REJECTED" ? feedback : null,
      },
    });

    return NextResponse.json(
      {
        message: `Student verification ${status.toLowerCase()} successfully.`,
        user: {
          id: updatedUser.id,
          verificationStatus: updatedUser.verificationStatus,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating verification status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
