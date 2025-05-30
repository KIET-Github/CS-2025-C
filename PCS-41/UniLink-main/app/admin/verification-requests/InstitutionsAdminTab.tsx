"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Document,
  Institution,
  InstitutionProfile,
  User,
} from "@prisma/client";
import { CheckCircle, ExternalLink, FileText, XCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface InstitutionsAdminTabProps {
  active: boolean;
}

interface InstitutionProfileWithInstitution extends InstitutionProfile {
  institution: Institution;
}

interface UserWithInstitutionProfileAndDocuments extends User {
  institutionProfile: InstitutionProfileWithInstitution;
  documents: Document[];
}

const InstitutionsAdminTab: React.FC<InstitutionsAdminTabProps> = ({
  active,
}) => {
  const [pendingUsers, setPendingUsers] = useState<
    UserWithInstitutionProfileAndDocuments[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] =
    useState<UserWithInstitutionProfileAndDocuments | null>(null);
  const [feedback, setFeedback] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>();
  const { toast } = useToast();

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
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/admin/verification-requests?role=INSTITUTION_ADMIN&status=PENDING"
        );
        const data = await response.json();
        console.log("data is ", data);
        if (!response.ok) {
          setMessage(data.message || "Failed to fetch pending users");
        }
        setPendingUsers(data.users || []);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setMessage("Internal Server Error -- fetchPendingUsers");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, [active, toast]);

  const handleVerificationUpdate = async (
    userId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      setProcessingId(userId);
      const response = await fetch("/api/admin/verification-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          status,
          feedback: status === "REJECTED" ? feedback : undefined,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update verification status");
      }

      const updatedUsers = pendingUsers.filter((user) => user.id !== userId);
      setPendingUsers(updatedUsers);

      setSelectedUser(null);
      setFeedback("");
      setMessage(`The user has been successfully ${status.toLowerCase()}`);
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Internal Server Error -- handleVerificationUpdate");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                {/* Header with name, email and badges */}
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-[150px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-[120px]" />
                    <Skeleton className="h-5 w-[100px]" />
                  </div>
                </div>

                {/* Documents section */}
                <div className="space-y-4">
                  <Skeleton className="h-5 w-[140px]" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                {/* Footer with buttons and date */}
                <div className="flex flex-col space-y-4 md:items-end">
                  <div className="flex gap-2 w-full md:w-auto">
                    <Skeleton className="h-10 w-[120px]" />
                    <Skeleton className="h-10 w-[120px]" />
                  </div>
                  <Skeleton className="h-4 w-[180px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <CheckCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No pending verification requests at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {pendingUsers.map((user) => (
        <Card key={user.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="text-sm">
                    {user.institutionProfile?.institution.name || "N/A"}
                  </Badge>
                  <Badge variant="outline" className=" text-muted-foreground">
                    {user.role.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Submitted Documents</h4>
                {user.documents.length > 0 ? (
                  <div className="space-y-2">
                    {user.documents.map((doc) => (
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
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none"
                    onClick={() =>
                      handleVerificationUpdate(user.id, "APPROVED")
                    }
                    disabled={!!processingId}
                  >
                    {processingId === user.id ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> Approve
                      </span>
                    )}
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex-1 md:flex-none"
                        onClick={() => setSelectedUser(user)}
                      >
                        <XCircle className="h-4 w-4 mr-2" /> Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Verification Request</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="feedback">Feedback (Optional)</Label>
                          <Textarea
                            id="feedback"
                            placeholder="Provide feedback on why the verification is being rejected"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            selectedUser &&
                            handleVerificationUpdate(
                              selectedUser.id,
                              "REJECTED"
                            )
                          }
                          disabled={!!processingId}
                        >
                          {processingId === selectedUser?.id ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Processing...
                            </span>
                          ) : (
                            "Confirm Rejection"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-xs text-muted-foreground">
                  Submitted on{" "}
                  {new Date(
                    user.documents[0]?.createdAt || Date.now()
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InstitutionsAdminTab;
