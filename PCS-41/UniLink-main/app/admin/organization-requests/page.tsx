"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Building, Landmark } from "lucide-react";
import React, { useState } from "react";
import { CompaniesTab } from "./CompaniesTab";
import { GovernmentTab } from "./GovernmentTab";
import { InstitutionsTab } from "./InstitutionsTab";

export type TabsOptions = "institutions" | "companies" | "government";

const AdminRequestPage = () => {
  const [activeTab, setActiveTab] = useState<TabsOptions>("institutions");

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Organization Requests</h1>
        <p className="text-muted-foreground">
          Review and approve new Organization requests.
        </p>
      </div>

      <Tabs
        defaultValue="institutions"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabsOptions)}
        className="w-full"
      >
        <TabsList className="w-full mb-6">
          <TabsTrigger value="institutions" className="flex-1">
            <Building className="h-4 w-4 mr-2" /> Institutions
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex-1">
            <Briefcase className="h-4 w-4 mr-2" /> Companies
          </TabsTrigger>
          <TabsTrigger value="government" className="flex-1">
            <Landmark className="h-4 w-4 mr-2" /> Government
          </TabsTrigger>
        </TabsList>

        <TabsContent value="institutions" className="mt-0">
          <InstitutionsTab active={activeTab === "institutions"} />
        </TabsContent>

        <TabsContent value="companies" className="mt-0">
          <CompaniesTab active={activeTab === "companies"} />
        </TabsContent>

        <TabsContent value="government" className="mt-0">
          <GovernmentTab active={activeTab === "government"} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRequestPage;
