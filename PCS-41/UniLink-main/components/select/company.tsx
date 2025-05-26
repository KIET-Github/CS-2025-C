import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LoadingSelectSkeleton } from "./institute";

interface Company {
  id: string;
  name: string;
}

const SelectCompany = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const router = useRouter();
  const params = useParams();
  const role = params.role as string;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/companies");
        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to fetch companies");
        }

        setCompanies(data);
        setFilteredCompanies(data);
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

    fetchCompanies();
  }, []);

  useEffect(() => {
    // Filter companies based on search query
    if (searchQuery.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

  const handleCompanySelect = (companyId: string) => {
    router.push(`/auth/profile/${role}/${companyId}/upload-docs`);
  };

  const handleNewCompanyRequest = () => {
    router.push("/request/company");
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
    <div className="w-full max-w-lg rounded-md p-4 mt-4 space-y-6 border bg-background">
      <h2 className="text-2xl">Search For Company</h2>
      <Input
        placeholder="Search companies..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full"
      />

      {isLoading ? (
        <div className="max-h-60 overflow-y-auto border border-secondary rounded-md p-2">
          <LoadingSelectSkeleton />
        </div>
      ) : filteredCompanies.length > 0 ? (
        <div className="max-h-60 overflow-y-auto border border-secondary rounded-md">
          {filteredCompanies.map((company) => (
            <button
              key={company.id}
              className="w-full text-left px-4 py-2 hover:bg-secondary/70 focus:outline-none focus:bg-secondary/70 transition"
              onClick={() => handleCompanySelect(company.id)}
            >
              {company.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-4">
          <p className="mb-4 text-muted-foreground">No companies found</p>
        </div>
      )}

      {!isLoading && !message && filteredCompanies.length === 0 && (
        <div className="pt-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={handleNewCompanyRequest}
          >
            Request New Company
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectCompany;
