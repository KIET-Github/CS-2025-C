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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Government } from "@prisma/client";
import { Building, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface GovernmentTabProps {
  active: boolean;
}

const GovernmentTab = ({ active }: GovernmentTabProps) => {
  const [governments, setGovernments] = useState<Government[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [governmentToDelete, setGovernmentToDelete] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const addToProcessing = (id: string) => {
    setProcessingIds((prev) => [...prev, id]);
  };

  useEffect(() => {
    const fetchVerifiedGovernments = async () => {
      if (!active) return;

      try {
        setIsFetching(true);
        const response = await fetch(
          "/api/governments?verificationStatus=VERIFIED"
        );
        const data = await response.json();
        if (!response.ok) {
          setMessage(
            data.message || "Failed to fetch government organizations"
          );
          return;
        }
        setGovernments(data);
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

    fetchVerifiedGovernments();
  }, [active]);

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
    setMessage(null);
  }, [message, toast]);

  const handleDelete = async (id: string) => {
    try {
      addToProcessing(id);
      // Remove the deleted government organization from the list
      setGovernments(governments.filter((govt) => govt.id !== id));
      setMessage("Government organization successfully deleted");
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Internal Server Error --handleDelete");
    } finally {
      setProcessingIds((prev) => prev.filter((i) => i !== id));
      setGovernmentToDelete(null);
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
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (governments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">
            No verified government organizations found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {governments.map((government) => {
        const isProcessing = processingIds.includes(government.id);
        return (
          <div
            key={government.id}
            className="mb-4 border rounded-md p-4 space-y-4"
          >
            <div className="flex flex-row items-start justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span className="text-lg">{government.name}</span>
                </div>
                <div className="mt-1 flex flex-col gap-2">
                  <div>{government.level.toLowerCase()} Jurisdiction</div>
                  <div>
                    {government.website && (
                      <a
                        href={
                          government.website.startsWith("http")
                            ? government.website
                            : `https://${government.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary/80 hover:text-primary text-sm"
                      >
                        {government.website}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-emerald-500">
                Verified
              </Badge>
            </div>
            <div>
              <div className="flex justify-end gap-2 mt-2">
                {isProcessing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="min-w-[110px]"
                  >
                    <FaSpinner className="h-4 w-4 mr-2 animate-spin" /> Wait...
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setGovernmentToDelete(government.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!governmentToDelete}
        onOpenChange={(open: boolean) => !open && setGovernmentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              government organization and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                governmentToDelete && handleDelete(governmentToDelete)
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

export default GovernmentTab;
