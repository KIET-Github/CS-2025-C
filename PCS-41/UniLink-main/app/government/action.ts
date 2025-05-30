"use server";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { VerificationStatus } from "@prisma/client";
import { getServerSession } from "next-auth";

// Define a cleaner type for the returned placement data
export type FormattedPlacementRecord = {
  id: string;
  studentName: string | null;
  studentEmail: string;
  enrollmentNo: string;
  department: string;
  graduationYear: number;
  institutionName: string;
  companyName: string;
  companyWebsite: string;
  verificationDate: Date;
};

export async function fetchVerifiedPlacements() {
  try {
    const verifiedPlacements = await prisma.placementRecord.findMany({
      where: {
        verificationStatus: VerificationStatus.VERIFIED,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            institution: {
              select: {
                name: true,
              },
            },
          },
        },
        company: {
          select: {
            name: true,
            website: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Transform the data into a cleaner structure
    const formattedPlacements: FormattedPlacementRecord[] =
      verifiedPlacements.map((placement) => ({
        id: placement.id,
        studentName: placement.student.user.name,
        studentEmail: placement.student.user.email,
        enrollmentNo: placement.student.enrollmentNo,
        department: placement.student.department,
        graduationYear: placement.student.graduationYear,
        institutionName: placement.student.institution.name,
        companyName: placement.company.name,
        companyWebsite: placement.company.website,
        verificationDate: placement.updatedAt,
      }));

    return formattedPlacements;
  } catch (error) {
    console.error("Error fetching verified placements:", error);
    return null;
  }
}

export async function getGovernmentRepresentativeProfile() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        governmentProfile: {
          include: {
            government: {
              select: {
                name: true,
                level: true,
                website: true,
                verificationStatus: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.governmentProfile) {
      return null;
    }

    const governmentRepresentativeProfile = {
      name: user.name,
      image: user.image,
      email: user.email,
      governmentName: user.governmentProfile.government.name,
      governmentLevel: user.governmentProfile.government.level,
      department: user.governmentProfile.department,
      designation: user.governmentProfile.designation,
      website: user.governmentProfile.government.website,
      verificationStatus: user.verificationStatus,
      governmentVerificationStatus:
        user.governmentProfile.government.verificationStatus,
    };

    return governmentRepresentativeProfile;
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return null;
  }
}
