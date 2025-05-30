"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import VerificationRequestTab from "./verification-request-tab";
import VerifiedStudentTab from "./verified-student-tab";

const VerificationPage = () => {
  const [activeTab, setActiveTab] = useState("verification-requests");

  return (
    <div className="container p-6 space-y-6">
      <h1 className="text-2xl font-normal">Student Verification</h1>

      <Tabs defaultValue="verification-requests" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="verification-requests">
            Verification Requests
          </TabsTrigger>
          <TabsTrigger value="verified-students">Verified Students</TabsTrigger>
        </TabsList>
        <TabsContent value="verification-requests">
          <VerificationRequestTab
            active={activeTab === "verification-requests"}
          />
        </TabsContent>
        <TabsContent value="verified-students">
          <VerifiedStudentTab active={activeTab === "verified-students"} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationPage;
