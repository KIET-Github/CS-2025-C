import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Institution } from "@prisma/client";
import { Building, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface InstitutionsTabProps {
  active: boolean;
}

export const InstitutionsTab = ({ active }: InstitutionsTabProps) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const addToProcessing = (id: string) => {
    setProcessingIds((prev) => [...prev, id]);
  };

  useEffect(() => {
    const fetchUnverifiedInstitutions = async () => {
      if (!active) return;

      try {
        setIsFetching(true);
        const response = await fetch(
          "/api/institutions?verificationStatus=NOT_VERIFIED"
        );
        const data = await response.json();
        if (!response.ok) {
          setMessage(data.message || "Failed to fetch institutions");
          return;
        }
        setInstitutions(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setMessage("Internal Server Error");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUnverifiedInstitutions();
  }, [active]);

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
    setMessage(null);
  }, [message, toast]);

  const handleApprove = async (id: string) => {
    try {
      addToProcessing(id);
      const response = await fetch(`/api/admin/verify/${id}/institution`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verificationStatus: "VERIFIED" }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Failed to approve institution");
        return;
      }

      // Remove the approved institution from the list
      setInstitutions(institutions.filter((inst) => inst.id !== id));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Internal Server Error --handleApprove");
    }
  };

  const handleReject = async (id: string) => {
    try {
      addToProcessing(id);
      const response = await fetch(`/api/admin/verify/${id}/institution`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verificationStatus: "REJECTED" }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Failed to reject institution");
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Internal Server Error --handleReject");
    }
  };

  if (isFetching) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="mb-4 border rounded-md p-4 space-y-4">
              <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-6 w-32" />
              </div>
              <div>
                <div className="flex justify-end gap-2 mt-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-32" />
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (institutions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">
            No pending institution verification requests.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {institutions.map((institution) => {
        const isProcessing = processingIds.includes(institution.id);
        return (
          <div
            key={institution.id}
            className="mb-4 border rounded-md p-4 space-y-4"
          >
            <div className="flex flex-row items-start justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span className="text-lg">{institution.name}</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {institution.address}, {institution.city}, {institution.state}
                </span>
                {institution.website && (
                  <a
                    href={
                      institution.website.startsWith("http")
                        ? institution.website
                        : `https://${institution.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/80 hover:text-primary text-sm"
                  >
                    {institution.website}
                  </a>
                )}
              </div>
              <Badge variant="outline" className="text-muted-foreground">
                {institution.verificationStatus === "NOT_VERIFIED"
                  ? "Pending"
                  : institution.verificationStatus}
              </Badge>
            </div>
            <div>
              <div className="flex justify-end gap-2 mt-2">
                {isProcessing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="min-w-[146px]"
                  >
                    <FaSpinner className="h-4 w-4 mr-2 animate-spin" /> Wait...
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleReject(institution.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emerald-500 hover:bg-emerald-500/10"
                      onClick={() => handleApprove(institution.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
