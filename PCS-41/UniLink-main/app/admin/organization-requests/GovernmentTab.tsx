import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Government } from "@prisma/client";
import { Check, Landmark, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface GovernmentTabProps {
  active: boolean;
}

export const GovernmentTab = ({ active }: GovernmentTabProps) => {
  const [government, setGovernment] = useState<Government[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUnverifiedGovernments = async () => {
      if (!active) return;

      try {
        setIsFetching(true);
        const response = await fetch(
          "/api/governments?verificationStatus=NOT_VERIFIED"
        );
        const data = await response.json();
        if (!response.ok) {
          setMessage(data.message || "Failed to fetch government entities");
          return;
        }
        setGovernment(data);
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

    fetchUnverifiedGovernments();
  }, [active]);

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
    setMessage(null);
  }, [message, toast]);

  const addToProcessing = (id: string) => {
    setProcessingIds((prev) => [...prev, id]);
  };

  const handleApprove = async (id: string) => {
    try {
      addToProcessing(id);
      const response = await fetch(`/api/admin/verify/${id}/government`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verificationStatus: "VERIFIED" }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Failed to approve government entity");
        return;
      }

      // Remove the approved entity from the list
      setGovernment(government.filter((gov) => gov.id !== id));
      setMessage("Government entity approved successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Check Your Network Connectivity");
    }
  };

  const handleReject = async (id: string) => {
    try {
      addToProcessing(id);
      const response = await fetch(`/api/admin/verify/${id}/government`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verificationStatus: "REJECTED" }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Failed to reject government entity");
        return;
      }

      // Remove the rejected entity from the list
      setGovernment(government.filter((gov) => gov.id !== id));
      setMessage("Government entity rejected successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Check Your Network Connectivity");
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

  if (government.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">
            No pending government entity verification requests.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {government.map((gov) => {
        const isProcessing = processingIds.includes(gov.id);
        return (
          <Card key={gov.id} className="mb-4">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5" />
                  <CardTitle className="text-lg">{gov.name}</CardTitle>
                </div>
                <CardDescription className="mt-1 flex flex-col gap-2">
                  <div>{gov.level.toLowerCase()} Jurisdiction</div>
                  <div>
                    {gov.website && (
                      <a
                        href={
                          gov.website.startsWith("http")
                            ? gov.website
                            : `https://${gov.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary/80 hover:text-primary text-sm"
                      >
                        {gov.website}
                      </a>
                    )}
                  </div>
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-muted-foreground">
                {gov.verificationStatus === "NOT_VERIFIED"
                  ? "Pending "
                  : gov.verificationStatus}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2 mt-2">
                {isProcessing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="min-w-[146px]"
                  >
                    <FaSpinner className="h-4 w-4 mr-2 animate-spin" />{" "}
                    Processing...
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleReject(gov.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emerald-500 hover:bg-emerald-500/10"
                      onClick={() => handleApprove(gov.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
