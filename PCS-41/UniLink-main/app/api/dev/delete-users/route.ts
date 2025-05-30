import { prisma } from "@/lib/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Delete dependent records first due to cascading relationships
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.placementRecord.deleteMany({});
    await prisma.institutionProfile.deleteMany({});
    await prisma.companyProfile.deleteMany({});
    await prisma.governmentProfile.deleteMany({});
    await prisma.studentProfile.deleteMany({});

    // Now delete all users
    await prisma.user.deleteMany({});

    return NextResponse.json({ message: "All users deleted successfully." });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Failed to delete users." },
      { status: 500 }
    );
  }
}
