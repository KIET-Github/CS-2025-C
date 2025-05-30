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
import { Briefcase, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface Company {
  id: string;
  name: string;
  website: string;
  address: string;
  city: string;
  state: string;
  verificationStatus: string;
}

interface CompaniesTabProps {
  active: boolean;
}

export const CompaniesTab = ({ active }: CompaniesTabProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUnverifiedCompanies = async () => {
      if (!active) return;

      try {
        setIsFetching(true);
        const response = await fetch(
          "/api/companies?verificationStatus=NOT_VERIFIED"
        );
        const data = await response.json();
        if (!response.ok) {
          setMessage(data.message || "Failed to fetch companies");
          return;
        }
        setCompanies(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setMessage("Internal Server Error. Check Your Network Connectivity");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUnverifiedCompanies();
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
      const response = await fetch(`/api/admin/verify/${id}/company`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verificationStatus: "VERIFIED" }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Failed to approve company");
        return;
      }

      // Remove the approved company from the list
      setCompanies(companies.filter((company) => company.id !== id));
      setMessage("Company approved successfully");
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
      const response = await fetch(`/api/admin/verify/${id}/company`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verificationStatus: "REJECTED" }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Failed to reject company");
        return;
      }

      // Remove the rejected company from the list
      setCompanies(companies.filter((company) => company.id !== id));
      setMessage("Company rejected successfully");
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

  if (companies.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">
            No pending company verification requests.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => {
        const isProcessing = processingIds.includes(company.id);
        return (
          <Card key={company.id} className="mb-4">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                </div>
                <CardDescription className="mt-1">
                  {company.address}, {company.city}, {company.state}
                  <br />
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/80 hover:text-primary"
                  >
                    {company.website}
                  </a>
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-muted-foreground">
                {company.verificationStatus === "NOT_VERIFIED"
                  ? "Pending "
                  : company.verificationStatus}
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
                      onClick={() => handleReject(company.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emerald-500 hover:bg-emerald-500/10"
                      onClick={() => handleApprove(company.id)}
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
