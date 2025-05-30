import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LoadingSelectSkeleton } from "./institute";

interface Government {
  id: string;
  name: string;
}

const SelectGovernment = () => {
  const [governments, setGovernments] = useState<Government[]>([]);
  const [filteredGovernments, setFilteredGovernments] = useState<Government[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const router = useRouter();
  const params = useParams();
  const role = params.role as string;

  useEffect(() => {
    const fetchGovernments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/governments");
        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to fetch governments");
        }

        setGovernments(data);
        setFilteredGovernments(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setMessage("Check Your Network Connectivity.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGovernments();
  }, []);

  useEffect(() => {
    // Filter governments based on search query
    if (searchQuery.trim() === "") {
      setFilteredGovernments(governments);
    } else {
      const filtered = governments.filter((government) =>
        government.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGovernments(filtered);
    }
  }, [searchQuery, governments]);

  const handleGovernmentSelect = (governmentId: string) => {
    router.push(`/auth/profile/${role}/${governmentId}/upload-docs`);
  };

  const handleNewGovernmentRequest = () => {
    router.push("/request/government");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
  }, [message, toast]);

  return (
    <div className="w-full max-w-lg rounded-md p-4 mt-4 space-y-4 border bg-background">
      <h2 className="text-2xl">Search For Government</h2>
      <Input
        placeholder="Search governments..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full"
      />

      {isLoading ? (
        <div className="max-h-60 overflow-y-auto border border-secondary rounded-md p-2">
          <LoadingSelectSkeleton />
        </div>
      ) : filteredGovernments.length > 0 ? (
        <div className="max-h-60 overflow-y-auto border border-secondary rounded-md">
          {filteredGovernments.map((government) => (
            <button
              key={government.id}
              className="w-full text-left px-4 py-2 hover:bg-secondary/70 focus:outline-none focus:bg-secondary/70 transition"
              onClick={() => handleGovernmentSelect(government.id)}
            >
              {government.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-4">
          <p className="mb-4 text-muted-foreground">No governments found</p>
        </div>
      )}

      {!isLoading && !message && filteredGovernments.length === 0 && (
        <div className="pt-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={handleNewGovernmentRequest}
          >
            Request New Government
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectGovernment;
