"use server";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth/next";

export async function getInstitutionAdminProfile() {
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
        institutionProfile: {
          include: {
            institution: {
              select: {
                name: true,
                website: true,
                address: true,
                city: true,
                state: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.institutionProfile) {
      return null;
    }

    const institutionAdminProfile = {
      name: user.name,
      image: user.image,
      email: user.email,
      institutionName: user.institutionProfile.institution.name,
      website: user.institutionProfile.institution.website,
      address: user.institutionProfile.institution.address,
      city: user.institutionProfile.institution.city,
      state: user.institutionProfile.institution.state,
      verificationStatus: user.verificationStatus,
    };

    return institutionAdminProfile;
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return null;
  }
}
