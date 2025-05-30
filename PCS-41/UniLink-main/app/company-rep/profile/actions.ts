"use server";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth/next";

export async function getUserProfile() {
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
        companyProfile: {
          include: {
            company: {
              select: {
                name: true,
                website: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.companyProfile) {
      return null;
    }

    const companyRepProfile = {
      name: user.name,
      image: user.image,
      email: user.email,
      companyName: user.companyProfile.company.name,
      website: user.companyProfile.company.website,
      verificationStatus: user.verificationStatus,
    };

    return companyRepProfile;
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return null;
  }
}
