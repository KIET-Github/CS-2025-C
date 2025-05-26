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

    // Prepare select options
    const select = {
      id: true,
      name: true,
      website: true,
      address: true,
      city: true,
      state: true,
      verificationStatus: true,
      createdAt: true,
      updatedAt: true,
    };

    // Fetch companies based on query
    const companies = await prisma.company.findMany({
      select,
      where: {
        verificationStatus,
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.log("Error fetching companies.");
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

const companySchema = z.object({
  name: z.string().min(2),
  website: z.string().url(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
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
    const data = companySchema.parse(body);

    // Check if company already exists
    const existingCompany = await prisma.company.findFirst({
      where: { name: data.name },
    });

    if (existingCompany) {
      // Handle existing company
      if (user.role === "SUPER_ADMIN") {
        // Super admin can update existing company
        const updatedCompany = await prisma.company.update({
          where: { id: existingCompany.id },
          data: {
            name: data.name,
            website: data.website,
            address: data.address,
            city: data.city,
            state: data.state,
            verificationStatus: "VERIFIED",
          },
        });
        return NextResponse.json(updatedCompany, { status: 200 });
      } else {
        // Other roles can't modify existing companies
        return NextResponse.json(
          { message: "Request already made for this company" },
          { status: 409 }
        );
      }
    }

    // Create new company with status based on user role
    const status = user.role === "SUPER_ADMIN" ? "VERIFIED" : "NOT_VERIFIED";

    const company = await prisma.company.create({
      data: {
        name: data.name,
        website: data.website,
        address: data.address,
        city: data.city,
        state: data.state,
        verificationStatus: status,
      },
    });

    return NextResponse.json(company, { status: 201 });
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
      { message: "Failed to create company" },
      { status: 500 }
    );
  }
}
