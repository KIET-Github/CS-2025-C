"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { fetchVerifiedPlacements, FormattedPlacementRecord } from "../action";

interface PlacementTableProps {
  initialData?: FormattedPlacementRecord[];
}

const VerifiedPlacementsTable = ({ initialData }: PlacementTableProps) => {
  const [placements, setPlacements] = useState<FormattedPlacementRecord[]>(
    initialData || []
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadPlacements = async () => {
      try {
        setIsLoading(true);

        const response = await fetchVerifiedPlacements();
        if (!response) {
          setPlacements([]);
          return;
        }

        setPlacements(response);
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error loading placements:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialData) {
      loadPlacements();
    }
  }, [initialData]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  }, [error, toast]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold">Verified Placement Records</h2>

      <div className="w-full py-2 px-4 border rounded-md">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse">Loading placement records...</div>
          </div>
        ) : placements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No verified placement records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Student</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Enrollment No.</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Graduation Year</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">
                    Verification Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placements.map((placement) => (
                  <TableRow key={placement.id}>
                    <TableCell className="font-medium">
                      {placement.studentName || "N/A"}
                      <div className="text-sm text-muted-foreground">
                        {placement.studentEmail}
                      </div>
                    </TableCell>
                    <TableCell>{placement.institutionName}</TableCell>
                    <TableCell>{placement.enrollmentNo}</TableCell>
                    <TableCell>{placement.department}</TableCell>
                    <TableCell>{placement.graduationYear}</TableCell>
                    <TableCell>
                      <a
                        href={placement.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {placement.companyName}
                      </a>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDate(placement.verificationDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifiedPlacementsTable;
