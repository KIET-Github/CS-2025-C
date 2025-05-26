import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface Institution {
  id: string;
  name: string;
}

export const LoadingSelectSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, index) => (
      <Skeleton key={index} className="w-full h-10" />
    ))}
  </div>
);

const SelectInstitute = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<
    Institution[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const router = useRouter();
  const params = useParams();
  const role = params.role as string;

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/institutions");
        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to fetch institutions");
        }

        setInstitutions(data);
        setFilteredInstitutions(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setMessage("Internal Server Error. Check Your Network Connectivity.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  useEffect(() => {
    // Filter institutions based on search query
    if (searchQuery.trim() === "") {
      setFilteredInstitutions(institutions);
    } else {
      const filtered = institutions.filter((institution) =>
        institution.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInstitutions(filtered);
    }
  }, [searchQuery, institutions]);

  const handleInstitutionSelect = (institutionId: string) => {
    router.push(`/auth/profile/${role}/${institutionId}/upload-docs`);
  };

  const handleNewInstitutionRequest = () => {
    router.push("/request/institute");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
    setMessage(null);
  }, [message, toast]);

  return (
    <div className="w-full max-w-lg rounded-md p-4 mt-4 space-y-4 border bg-background">
      <h2 className="text-2xl">Search For Institution</h2>
      <Input
        placeholder="Search institutions..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full"
      />

      {isLoading ? (
        <div className="max-h-60 overflow-y-auto border border-secondary rounded-md p-2">
          <LoadingSelectSkeleton />
        </div>
      ) : filteredInstitutions.length > 0 ? (
        <div className="max-h-60 overflow-y-auto border border-secondary rounded-md">
          {filteredInstitutions.map((institution) => (
            <button
              key={institution.id}
              className="w-full text-left px-4 py-2 hover:bg-secondary/70 focus:outline-none focus:bg-secondary/70 transition"
              onClick={() => handleInstitutionSelect(institution.id)}
            >
              {institution.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-4">
          <p className="mb-4 text-muted-foreground">No institutions found</p>
        </div>
      )}

      {!isLoading && !message && filteredInstitutions.length === 0 && (
        <div className="pt-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={handleNewInstitutionRequest}
          >
            Request New Institute
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectInstitute;
