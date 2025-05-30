"use client";

import SelectCompany from "@/components/select/company";
import SelectGovernment from "@/components/select/government";
import SelectInstitute from "@/components/select/institute";
import { useParams } from "next/navigation";
import React from "react";

const ProfileRolePage = () => {
  const params = useParams();
  const role = params.role as string;
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
    institutionAdmin: SelectInstitute,
    companyRepresentative: SelectCompany,
    student: SelectInstitute,
    government: SelectGovernment,
  };
  if (!roleComponents[parsedRole]) {
    return <div>Invalid role</div>;
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

export default ProfileRolePage;
