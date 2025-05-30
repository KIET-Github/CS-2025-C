"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Document, User } from "@prisma/client";
import { CheckCircle, ExternalLink, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface VerifiedStudentTabProps {
  active: boolean;
}

interface StudentProfileType {
  enrollmentNo: string;
  graduationYear: number;
}

export interface UserWithStudentProfileAndDocuments extends User {
  studentProfile: StudentProfileType;
  documents: Document[];
}

const VerifiedStudentSkeleton = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              {/* Header section with name, email and badges */}
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[180px]" />
                  <Skeleton className="h-4 w-[220px]" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-[140px]" />
                  <Skeleton className="h-5 w-[120px]" />
                  <Skeleton className="h-5 w-[100px]" />
                </div>
              </div>

              {/* Documents section */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-[140px]" />
                <div className="space-y-2">
                  {[1, 2].map((doc) => (
                    <Skeleton key={doc} className="h-10 w-full" />
                  ))}
                </div>
              </div>

              {/* Footer section */}
              <div className="flex flex-col space-y-4 md:items-end">
                <Skeleton className="h-9 w-[100px] ml-auto" />
                <Skeleton className="h-4 w-[180px] ml-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const VerifiedStudentTab: React.FC<VerifiedStudentTabProps> = ({ active }) => {
  const [verifiedStudents, setVerifiedStudents] = useState<
    UserWithStudentProfileAndDocuments[]
  >([]);
  const [isFetching, setIsFetching] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>();
  const [studentToDeleteId, setStudentToDeleteId] = useState<string | null>(
    null
  );
  const { toast } = useToast();

  const addToProcessing = (id: string) => {
    setProcessingIds((prev) => [...prev, id]);
  };

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
    setMessage(null);
  }, [message, toast]);

  useEffect(() => {
    if (!active) {
      return;
    }
    const fetchVerifiedStudents = async () => {
      try {
        setIsFetching(true);
        const response = await fetch(
          "/api/institution-admin/verification?status=APPROVED"
        );
        const data = await response.json();
        if (!response.ok) {
          setMessage(data.message || "Failed to fetch verified students");
        }
        setVerifiedStudents(data.students || []);
      } catch (error) {
        console.error("Error fetching verified students:", error);
        setMessage("Internal Server Error. Check Network Connectivity");
      } finally {
        setIsFetching(false);
      }
    };

    fetchVerifiedStudents();
  }, [active, toast]);

  const handleDelete = async (id: string) => {
    try {
      addToProcessing(id);

      // API call would go here
      // const response = await fetch(`/api/institution-admin/students/${id}`, {
      //   method: "DELETE",
      // });
      // const data = await response.json();

      // if (!response.ok) {
      //   setMessage(data.message || "Failed to delete student");
      //   return;
      // }

      // Remove the deleted student from the list
      setVerifiedStudents(
        verifiedStudents.filter((student) => student.id !== id)
      );
      setMessage("Student successfully deleted");
    } catch (error) {
      console.error("Error deleting student:", error);
      setMessage("Internal Server Error -- handleDelete");
    } finally {
      setProcessingIds((prev) => prev.filter((i) => i !== id));
      setStudentToDeleteId(null);
    }
  };

  if (isFetching) {
    return <VerifiedStudentSkeleton />;
  }

  if (verifiedStudents.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <CheckCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No verified students at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {verifiedStudents.map((student) => {
        const isProcessing = processingIds.includes(student.id);
        return (
          <Card key={student.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {student.email}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Badge variant="outline" className="text-sm">
                      Enrollment:{" "}
                      {student.studentProfile?.enrollmentNo || "N/A"}
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground">
                      Graduation Year:{" "}
                      {student.studentProfile?.graduationYear || "N/A"}
                    </Badge>
                    <Badge variant="outline" className="text-emerald-500">
                      Verified
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Submitted Documents</h4>
                  {student.documents.length > 0 ? (
                    <div className="space-y-2">
                      {student.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center">
                          <Link
                            className={cn(
                              buttonVariants({ variant: "outline" }),
                              "w-full justify-start gap-2"
                            )}
                            href={doc.fileUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="truncate">{doc.type}</span>
                            <ExternalLink className="h-3 w-3 ml-auto" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No documents submitted
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-4 md:items-end md:justify-end">
                  <div className="flex gap-2 w-full md:w-auto">
                    <div className="flex justify-end gap-2 mt-2">
                      {isProcessing ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="min-w-[110px]"
                        >
                          <FaSpinner className="h-4 w-4 mr-2 animate-spin" />
                          Wait...
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setStudentToDeleteId(student.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Submitted on{" "}
                    {new Date(
                      student.documents[0]?.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <AlertDialog
        open={!!studentToDeleteId}
        onOpenChange={(open: boolean) => !open && setStudentToDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              student&apos;s verified status and may affect their access to
              institution services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                studentToDeleteId && handleDelete(studentToDeleteId)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VerifiedStudentTab;
