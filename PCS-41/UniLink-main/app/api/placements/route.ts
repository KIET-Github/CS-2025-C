import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user has the right role (INSTITUTION_ADMIN)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== Role.INSTITUTION_ADMIN) {
      return NextResponse.json(
        {
          message:
            "Access denied. Only institution administrators can upload placement records.",
        },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { studentId, companyId } = body;

    // Validate required fields
    if (!studentId || !companyId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the student's profile ID
    const studentProfile = await prisma.studentProfile.findFirst({
      where: { userId: studentId },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { message: "Student profile not found" },
        { status: 404 }
      );
    }

    // Create the placement record
    const placementRecord = await prisma.placementRecord.create({
      data: {
        studentId: studentProfile.id,
        companyId,
        verificationStatus: "NOT_VERIFIED",
      },
    });

    console.log("placementRecord is ", placementRecord);

    return NextResponse.json(
      {
        message: "Placement record created successfully",
        data: placementRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Failed to create placement record" },
      { status: 500 }
    );
  }
}
