import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { GovernmentLevel, VerificationStatus } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    // Get the session to check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get verification status from query parameters
    const url = new URL(request.url);
    const verificationStatus =
      (url.searchParams.get("verificationStatus") as VerificationStatus) ||
      "VERIFIED";

    // Prepare select options
    const select = {
      id: true,
      name: true,
      level: true,
      website: true,
      verificationStatus: true,
    };

    // Fetch governments based on query
    const governments = await prisma.government.findMany({
      select,
      where: {
        verificationStatus,
      },
    });

    return NextResponse.json(governments);
  } catch (error) {
    console.log("Error fetching governments.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

const governmentSchema = z.object({
  name: z.string().min(2),
  level: z.nativeEnum(GovernmentLevel),
  website: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user has appropriate role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const data = governmentSchema.parse(body);

    // Check if government already exists with the same name and level
    const existingGovernment = await prisma.government.findFirst({
      where: {
        name: data.name,
        level: data.level,
      },
    });

    if (existingGovernment) {
      // Handle existing government
      if (user.role === "SUPER_ADMIN") {
        // Super admin can update existing government
        const updatedGovernment = await prisma.government.update({
          where: { id: existingGovernment.id },
          data: {
            name: data.name,
            level: data.level,
            website: data.website,
            verificationStatus: "VERIFIED",
          },
        });
        return NextResponse.json(updatedGovernment, { status: 200 });
      } else {
        // Other roles can't modify existing governments
        return NextResponse.json(
          { message: "Request already made for this government" },
          { status: 409 }
        );
      }
    }

    // Create new government with status based on user role
    const status = user.role === "SUPER_ADMIN" ? "VERIFIED" : "NOT_VERIFIED";

    const government = await prisma.government.create({
      data: {
        name: data.name,
        level: data.level,
        website: data.website,
        verificationStatus: status,
      },
    });

    return NextResponse.json(government, { status: 201 });
  } catch (error) {
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
      { message: "Failed to create government" },
      { status: 500 }
    );
  }
}
