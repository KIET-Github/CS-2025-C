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
import { Institution } from "@prisma/client";
import { Building, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface VerifiedInstitutionsTabProps {
  active: boolean;
}

const VerifiedInstitutionsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="mb-4">
          <CardContent className="p-4 space-y-4">
            {/* Institution header with name and badge */}
            <div className="flex flex-row items-start justify-between">
              <div className="flex flex-col gap-2">
                {/* Institution name and icon */}
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground/50" />
                  <Skeleton className="h-6 w-[200px]" />
                </div>

                {/* Address */}
                <Skeleton className="h-4 w-[350px]" />

                {/* Website */}
                <Skeleton className="h-4 w-[250px]" />
              </div>

              {/* Verified badge */}
              <Skeleton className="h-6 w-[80px]" />
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2">
              <Skeleton className="h-9 w-[100px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const VerifiedInstitutionsTab = ({ active }: VerifiedInstitutionsTabProps) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [institutionToDelete, setInstitutionToDelete] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const addToProcessing = (id: string) => {
    setProcessingIds((prev) => [...prev, id]);
  };

  useEffect(() => {
    const fetchVerifiedInstitutions = async () => {
      if (!active) return;

      try {
        setIsFetching(true);
        const response = await fetch(
          "/api/institutions?verificationStatus=VERIFIED"
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

    fetchVerifiedInstitutions();
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

      // Remove the deleted institution from the list
      setInstitutions(institutions.filter((inst) => inst.id !== id));
      setMessage("Institution successfully deleted");
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Internal Server Error --handleDelete");
    } finally {
      setProcessingIds((prev) => prev.filter((i) => i !== id));
      setInstitutionToDelete(null);
    }
  };

  if (isFetching) {
    return <VerifiedInstitutionsSkeleton />;
  }

  if (institutions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">
            No verified institutions found.
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
                    onClick={() => setInstitutionToDelete(institution.id)}
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
        open={!!institutionToDelete}
        onOpenChange={(open: boolean) => !open && setInstitutionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              institution and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                institutionToDelete && handleDelete(institutionToDelete)
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

export default VerifiedInstitutionsTab;
