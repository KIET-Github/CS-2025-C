import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const CreateOrganization = () => {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="flex flex-col gap-2 max-w-md w-full border rounded-md p-3">
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full font-normal"
          )}
          href={"/admin/create-organization/institute"}
        >
          Create New Institute
        </Link>
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full font-normal"
          )}
          href={"/admin/create-organization/company"}
        >
          Create New Company
        </Link>
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full font-normal"
          )}
          href={"/admin/create-organization/government"}
        >
          Create New Government
        </Link>
      </div>
    </div>
  );
};

export default CreateOrganization;
