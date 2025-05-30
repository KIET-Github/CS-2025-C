import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { VerificationStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user from the session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify user is a company representative
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { companyProfile: true },
    });

    if (
      !user ||
      user.role !== "COMPANY_REPRESENTATIVE" ||
      !user.companyProfile
    ) {
      return NextResponse.json(
        {
          message:
            "Unauthorized. Only company representatives can access this resource",
        },
        { status: 403 }
      );
    }

    // Get the companyId from the user's profile
    const companyId = user.companyProfile.companyId;

    // Get status from query params (defaults to both statuses if not specified)
    const url = new URL(req.url);
    const status = url.searchParams.get("status") as VerificationStatus | null;

    // Build the where clause based on the status parameter
    const where = {
      companyId,
      ...(status ? { verificationStatus: status } : {}),
    };

    // Fetch the placement records along with student details
    const placementRecords = await prisma.placementRecord.findMany({
      where,
      include: {
        student: {
          include: {
            user: true,
            institution: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Transform the data to return just what's needed
    const students = placementRecords.map((record) => ({
      placementId: record.id,
      placementStatus: record.verificationStatus,
      studentId: record.student.id,
      userId: record.student.user.id,
      name: record.student.user.name,
      email: record.student.user.email,
      profileImage: record.student.user.image,
      enrollmentNo: record.student.enrollmentNo,
      graduationYear: record.student.graduationYear,
      gender: record.student.gender,
      department: record.student.department,
      institution: record.student.institution.name,
    }));

    return NextResponse.json(
      {
        students,
        count: students.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
