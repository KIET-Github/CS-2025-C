"use client";

import { useParams } from "next/navigation";
import React from "react";

import CompanyRepresentativeUploadDocs from "@/components/upload-docs/company-rep";
import GovernmentUploadDocs from "@/components/upload-docs/gov-rep";
import InstitutionAdminUploadDocs from "@/components/upload-docs/institution-admin";
import StudentUploadDocs from "@/components/upload-docs/student";

const UploadDocs = () => {
  const params = useParams();
  const role = params.role as string;

  // Parse the role from kebab-case to camelCase
  const roleArray = role.split("-");
  const parsedRoleArray = roleArray.map((role, index) => {
    if (index === 0) {
      return role;
    }
    return role.charAt(0).toUpperCase() + role.substring(1);
  });
  const parsedRole = parsedRoleArray.join("");
  console.log("parsedRole is ", parsedRole);

  const roleComponents: Record<string, React.FC> = {
    institutionAdmin: InstitutionAdminUploadDocs,
    companyRepresentative: CompanyRepresentativeUploadDocs,
    student: StudentUploadDocs,
    government: GovernmentUploadDocs,
  };

  if (!roleComponents[parsedRole]) {
    return (
      <div className="min-h-screen flex flex-col bg-grid-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="p-8 bg-secondary/20 border border-border rounded-lg text-center shadow-md">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Invalid Role
            </h2>
            <p className="text-muted-foreground">
              The specified route is not recognized. Please check the URL and
              try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const FormComponent = roleComponents[parsedRole];

  return (
    <div className="min-h-screen flex flex-col bg-grid-white">
      <div className="flex-1 flex items-center justify-center">
        <FormComponent />
      </div>
    </div>
  );
};

export default UploadDocs;
