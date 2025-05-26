"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Building, Landmark } from "lucide-react";
import React, { useState } from "react";
import CompaniesRepTab from "./CompaniesRepTab";
import GovernmentRepTab from "./GovernmentRepTab";
import InstitutionsAdminTab from "./InstitutionsAdminTab";

export type TabsOptions =
  | "institutionsAdminTab"
  | "companiesRepTab"
  | "governmentRepTab";

const PendingVerificationsPage = () => {
  const [activeTab, setActiveTab] = useState<TabsOptions>(
    "institutionsAdminTab"
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Verification Requests</h1>
      </div>

      <Tabs
        defaultValue="institutions"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabsOptions)}
        className="w-full"
      >
        <TabsList className="w-full mb-6">
          <TabsTrigger value="institutionsAdminTab" className="flex-1">
            <Building className="h-4 w-4 mr-2" /> Institutions Admin
          </TabsTrigger>
          <TabsTrigger value="companiesRepTab" className="flex-1">
            <Briefcase className="h-4 w-4 mr-2" /> Companies Rep
          </TabsTrigger>
          <TabsTrigger value="governmentRepTab" className="flex-1">
            <Landmark className="h-4 w-4 mr-2" /> Government Rep
          </TabsTrigger>
        </TabsList>

        <TabsContent value="institutionsAdminTab" className="mt-0">
          <InstitutionsAdminTab active={activeTab === "institutionsAdminTab"} />
        </TabsContent>

        <TabsContent value="companiesRepTab" className="mt-0">
          <CompaniesRepTab active={activeTab === "companiesRepTab"} />
        </TabsContent>

        <TabsContent value="governmentRepTab" className="mt-0">
          <GovernmentRepTab active={activeTab === "governmentRepTab"} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PendingVerificationsPage;
