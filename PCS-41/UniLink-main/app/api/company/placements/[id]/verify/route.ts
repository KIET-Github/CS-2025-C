import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { VerificationStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the placement ID from the URL params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Placement ID is required" },
        { status: 400 }
      );
    }

    // Get current session to verify user is authenticated and authorized
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    // Check if user is a company representative
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
            "Unauthorized. Only company representatives can verify placements",
        },
        { status: 403 }
      );
    }

    // Parse the request body to get the verification status
    const { status } = await req.json();

    if (!status || !Object.values(VerificationStatus).includes(status)) {
      return NextResponse.json(
        { message: "Invalid verification status" },
        { status: 400 }
      );
    }

    // Verify the placement record exists and belongs to this company
    const placementRecord = await prisma.placementRecord.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!placementRecord) {
      return NextResponse.json(
        { message: "Placement record not found" },
        { status: 404 }
      );
    }

    // Check if the company rep belongs to the company associated with this placement
    if (placementRecord.companyId !== user.companyProfile.companyId) {
      return NextResponse.json(
        {
          message:
            "Unauthorized. You can only verify placements for your company",
        },
        { status: 403 }
      );
    }

    // Update the placement record status
    const updatedPlacement = await prisma.placementRecord.update({
      where: { id },
      data: { verificationStatus: status as VerificationStatus },
    });

    return NextResponse.json({
      message: `Placement ${
        status === "VERIFIED" ? "verified" : "rejected"
      } successfully`,
      placement: updatedPlacement,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Failed to process verification" },
      { status: 500 }
    );
  }
}
