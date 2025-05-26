"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { dashboardRoutes } from "@/lib/constants";
import {
  Company,
  CompanyProfile,
  GovernmentProfile,
  Institution,
  InstitutionProfile,
  StudentProfile,
  User,
} from "@prisma/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface InstitutionProfileWithInstitution extends InstitutionProfile {
  institution: Institution;
}

interface CompanyProfileWithCompany extends CompanyProfile {
  company: Company;
}

interface StudentProfileWithInstitution extends StudentProfile {
  institution: Institution;
}

interface GovernmentProfileWithGovernment extends GovernmentProfile {
  government: GovernmentProfile;
}

interface UserWithProfile extends User {
  institutionProfile?: InstitutionProfileWithInstitution;
  companyProfile?: CompanyProfileWithCompany;
  studentProfile?: StudentProfileWithInstitution;
  governmentProfile?: GovernmentProfileWithGovernment;
}

const VerificationPending = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
    setMessage(null);
  }, [message, toast]);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();
        console.log("data is ", data);

        if (!response.ok) {
          setMessage(data.message || "Failed to fetch");
          return;
        }

        setUser(data);

        // Redirect if user is already verified
        if (user?.verificationStatus === "APPROVED") {
          router.push(dashboardRoutes[user?.role]);
          return;
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerificationStatus();
  }, [router, user?.role, user?.verificationStatus]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  const getOrganizationName = () => {
    if (!user) return "";

    if (user.institutionProfile)
      return user.institutionProfile.institution.name;
    if (user.companyProfile) return user.companyProfile.company.name;
    if (user.studentProfile) return user.studentProfile.institution.name;
    if (user.governmentProfile)
      return user.governmentProfile.government.department;

    return "";
  };

  const getRoleDisplay = () => {
    if (!user) return "";

    const roleMap: { [key: string]: string } = {
      INSTITUTION_ADMIN: "Institution Administrator",
      COMPANY_REPRESENTATIVE: "Company Representative",
      STUDENT: "Student",
      GOVERNMENT_REPRESENTATIVE: "Government Representative",
    };

    return roleMap[user.role] || user.role;
  };

  return (
    <div className="min-h-screen flex flex-col bg-grid-white">
      <div className="flex-1 flex justify-center items-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle>
              Verification Status: {user?.verificationStatus}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.verificationStatus === "PENDING" && (
              <div className="space-y-2">
                <p className="text-lg">
                  Your verification as{" "}
                  <span className="font-medium">{getRoleDisplay()}</span>
                  {getOrganizationName() && (
                    <>
                      {" "}
                      for{" "}
                      <span className="font-medium">
                        {getOrganizationName()}
                      </span>
                    </>
                  )}{" "}
                  is currently under review.
                </p>
                <p className="text-muted-foreground">
                  Our team is reviewing your submitted documents. This process
                  typically takes 1-2 business days.
                </p>
              </div>
            )}
            {user?.feedback && (
              <div className="flex justify-between gap-2 p-4 border rounded-lg">
                <div className="flex flex-col">
                  <p className="font-medium">Feedback from reviewers:</p>
                  <p className="mt-2">{user.feedback}</p>
                </div>
                <Link
                  className={buttonVariants({ variant: "outline" })}
                  href="/auth/profile-setup"
                >
                  Apply Again
                </Link>
              </div>
            )}
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                If you have any questions or need to update your information,
                please contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPending;
