import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { VerificationStatus } from "@prisma/client";
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

    console.log("verificationStatus is ", verificationStatus);

    // Prepare select options
    const select = {
      id: true,
      name: true,
      address: true,
      city: true,
      state: true,
      website: true,
      verificationStatus: true,
      createdAt: true,
      updatedAt: true,
    };

    // Fetch institutions based on query
    const institutions = await prisma.institution.findMany({
      select,
      where: {
        verificationStatus,
      },
    });

    return NextResponse.json(institutions);
  } catch (error) {
    console.log("Error fetching institutions.");
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

const institutionSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
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
    const data = institutionSchema.parse(body);

    // Check if institution already exists
    const existingInstitution = await prisma.institution.findFirst({
      where: { name: data.name },
    });

    if (existingInstitution) {
      // Handle existing institution
      if (user.role === "SUPER_ADMIN") {
        // Super admin can update existing institution
        const updatedInstitution = await prisma.institution.update({
          where: { id: existingInstitution.id },
          data: {
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            website: data.website,
            verificationStatus: "VERIFIED",
          },
        });
        return NextResponse.json(updatedInstitution, { status: 200 });
      } else {
        // Other roles can't modify existing institutions
        return NextResponse.json(
          { message: "Request already made for this institution" },
          { status: 409 }
        );
      }
    }

    // Create new institution with status based on user role
    const status = user.role === "SUPER_ADMIN" ? "VERIFIED" : "NOT_VERIFIED";

    const institution = await prisma.institution.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        website: data.website,
        verificationStatus: status,
      },
    });

    return NextResponse.json(institution, { status: 201 });
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
      { message: "Failed to create institution" },
      { status: 500 }
    );
  }
}
