import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { VerificationStatus } from "@prisma/client";
import { CheckCircle, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Student {
  placementId: string;
  placementStatus: VerificationStatus;
  studentId: string;
  userId: string;
  name: string | null;
  email: string;
  profileImage: string | null;
  enrollmentNo: string;
  graduationYear: number;
  gender: string;
  department: string;
  institution: string;
}

interface VerificationRequestTabProps {
  active: boolean;
}

const VerificationRequestTab = ({ active }: VerificationRequestTabProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isFetchingStudents, setIsFetchingStudents] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!active) return;

    const fetchStudents = async () => {
      try {
        setIsFetchingStudents(true);
        const response = await fetch("/api/company?status=NOT_VERIFIED");
        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to fetch students");
          return;
        }

        setStudents(data.students);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setMessage("Check Internet Connection.");
      } finally {
        setIsFetchingStudents(false);
      }
    };

    fetchStudents();
  }, [active]);

  const handleVerify = async (
    placementId: string,
    status: VerificationStatus
  ) => {
    try {
      const response = await fetch(
        `/api/company/placements/${placementId}/verify`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to verify student");
        return;
      }

      // Update local state to reflect the change
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.placementId !== placementId)
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Check Internet Connection.");
    }
  };

  useEffect(() => {
    if (!message) return;
    toast({
      description: message,
    });
    setMessage(null);
  }, [message, toast]);

  if (!active) return null;

  return (
    <div className="w-full py-2 px-4 border rounded-md">
      {isFetchingStudents ? (
        <div className="flex justify-center py-8">Loading student data...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No verification requests found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Enrollment No.</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center ">Graduation Year</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.placementId}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.institution}</TableCell>
                  <TableCell>{student.enrollmentNo}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.graduationYear}</TableCell>
                  <TableCell>
                    {student.placementStatus === "NOT_VERIFIED" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() =>
                            handleVerify(student.placementId, "VERIFIED")
                          }
                        >
                          <CheckCircle size={16} />
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-red-500 hover:text-red-600"
                          // onClick={() => handleVerify(student.placementId,"REJECTED")}
                        >
                          <XCircle size={16} />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default VerificationRequestTab;
