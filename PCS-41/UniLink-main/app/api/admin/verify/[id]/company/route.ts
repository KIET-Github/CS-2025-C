import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for the request body
const verifySchema = z.object({
  verificationStatus: z.enum(["VERIFIED", "REJECTED"]),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the session to check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const awaitedParams = await params;

    // Check if user has appropriate role (SUPER_ADMIN)
    // const user = await prisma.user.findUnique({
    //   where: { id: session.user?.id as string },
    //   select: { id: true, role: true },
    // });

    // if (!user || user.role !== "SUPER_ADMIN") {
    //   return NextResponse.json(
    //     { message: "Forbidden: Requires SUPER_ADMIN privileges" },
    //     { status: 403 }
    //   );
    // }

    // Parse and validate the request body
    const body = await request.json();
    const { verificationStatus } = verifySchema.parse(body);

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: awaitedParams.id },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    if (verificationStatus === "VERIFIED") {
      // Update the company status to VERIFIED
      const updatedCompany = await prisma.company.update({
        where: { id: awaitedParams.id },
        data: { verificationStatus: "VERIFIED" },
      });

      return NextResponse.json(updatedCompany);
    } else if (verificationStatus === "REJECTED") {
      // Delete the company if rejected
      await prisma.company.delete({
        where: { id: awaitedParams.id },
      });

      return NextResponse.json(
        { message: "Company rejected and removed successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Error updating company verification status.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
