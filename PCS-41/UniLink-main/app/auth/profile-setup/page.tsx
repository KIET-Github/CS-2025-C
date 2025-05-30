"use client";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const ProfileSetup = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  // const user = session?.user;

  if (status === "loading") {
    return <span className="mt-32 mx-auto">Loading...</span>;
  }

  // if (user?.verificationStatus === "PENDING") {
  //   router.push("/auth/verification-pending");
  //   return null;
  // }

  // if (user?.verificationStatus === "APPROVED") {
  //   router.push(dashboardRoutes[user.role]);
  //   return null;
  // }

  // if verification Status is rejected just show a modal with reason
  // if (user?.verificationStatus === 'REJECTED') {
  //   return (
  //     <div className="container mx-auto max-w-2xl p-4">
  //       <Alert variant="destructive">
  //         <AlertTitle>Verification Failed</AlertTitle>
  //         <AlertDescription>
  //           Your verification was rejected. Reason: {user.feedback}
  //           Please update your information and try again.
  //         </AlertDescription>
  //       </Alert>
  //     </div>
  //   );
  // }

  const handleRoleSelect = (role: Role) => {
    router.push(`/auth/profile/${role.toLowerCase().replace("_", "-")}`);
  };

  console.log("session is ", session);

  const roleInfo = {
    INSTITUTION_ADMIN: {
      title: "Institution Administrator",
      description:
        "Manage your institution's profile and verify student placements",
      documents: ["INSTITUTION_ID", "AUTHORIZATION_LETTER"],
    },
    COMPANY_REPRESENTATIVE: {
      title: "Company Representative",
      description: "Post job opportunities and manage placement records",
      documents: ["COMPANY_ID", "BUSINESS_CARD"],
    },
    STUDENT: {
      title: "Student",
      description: "Apply for placements and track your applications",
      documents: ["INSTITUTION_ID"],
    },
    GOVERNMENT: {
      title: "Government Official",
      description: "Access placement statistics and generate reports",
      documents: ["GOVERNMENT_ID", "DEPARTMENT_LETTER"],
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-grid-white items-center justify-center">
      <div className="max-w-lg w-full p-4 border rounded-md bg-background">
        <h2 className="text-2xl">Complete Your Profile</h2>
        <span className="text-muted-foreground">
          Select your role to begin the verification process
        </span>
        <div className="mt-2">
          {Object.entries(roleInfo).map(([role, info]) => (
            <div
              key={role}
              onClick={() => handleRoleSelect(role as Role)}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg  border border-transparent hover:bg-gray-500/20 cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-medium">{info.title}</span>
                <span className="text-sm text-gray-500 mt-2">
                  {info.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
