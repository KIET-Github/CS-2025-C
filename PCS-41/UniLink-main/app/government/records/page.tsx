import React from "react";
import VerifiedPlacementsTable from "./verified-placements-table";

export default async function VerifiedPlacementsPage() {
  return (
    <div className="py-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Placement Records</h1>
        <div className="flex space-x-2">
          <div className=" text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Verified
          </div>
        </div>
      </div>

      <p className="text-muted-foreground">
        These are all verified placement records across institutions and
        companies.
      </p>

      <VerifiedPlacementsTable />
    </div>
  );
}
