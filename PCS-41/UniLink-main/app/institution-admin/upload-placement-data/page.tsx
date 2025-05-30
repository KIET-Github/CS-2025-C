"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Company } from "@prisma/client";
import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserWithStudentProfileAndDocuments } from "../verification/verified-student-tab";

const UploadPlacementData = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [students, setStudents] = useState<
    UserWithStudentProfileAndDocuments[]
  >([]);
  const [filteredStudents, setFilteredStudents] = useState<
    UserWithStudentProfileAndDocuments[]
  >([]);
  const [isFetchingCompanies, setIsFetchingCompanies] = useState<boolean>(true);
  const [isFetchingStudents, setIsFetchingStudents] = useState<boolean>(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<UserWithStudentProfileAndDocuments | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (!message) return;
    toast({
      description: message,
    });
    setMessage(null);
  }, [message, toast]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsFetchingCompanies(true);
        const res = await fetch("/api/companies");
        const data = await res.json();
        setCompanies(data);
        setFilteredCompanies(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setCompanies([]);
        setFilteredCompanies([]);
      } finally {
        setIsFetchingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsFetchingStudents(true);
        const res = await fetch("/api/institution-admin/unplaced");
        const data = await res.json();
        console.log("data --fetchStudents is ", data);
        setStudents(data.students);
        setFilteredStudents(data.students);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setIsFetchingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  const handleCompanySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setFilteredCompanies(
      companies.filter((company) => company.name.toLowerCase().includes(value))
    );
    // Clear selected company when searching
    setSelectedCompany(null);
  };

  const handleStudentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setFilteredStudents(
      students.filter((student) => student.name?.toLowerCase().includes(value))
    );
    // Clear selected student when searching
    setSelectedStudent(null);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleStudentSelect = (student: UserWithStudentProfileAndDocuments) => {
    setSelectedStudent(student);
  };

  const handleSubmitPlacementData = async () => {
    if (!selectedCompany || !selectedStudent) {
      setMessage("Please select both a company and a student to proceed.");
      return;
    }

    try {
      setIsSubmitting(true);

      const placementData = {
        studentId: selectedStudent.id,
        companyId: selectedCompany.id,
      };

      const response = await fetch("/api/placements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(placementData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit placement data");
      }

      setMessage(
        "Placement record has been successfully created with NOT_VERIFIED status"
      );

      // Reset selections and form
      setSelectedCompany(null);
      setSelectedStudent(null);
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage(
        "Failed to submit placement data: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 w-full">
      <h2 className="text-2xl font-normal tracking-wide mb-4">
        Upload Placement Data
      </h2>

      {/* Company Search */}
      <div className="mb-4 border p-4 rounded-md">
        <Input
          id="company-search"
          onChange={handleCompanySearch}
          placeholder="Enter company name"
          className="mb-4"
        />

        {isFetchingCompanies ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded-md" />
            ))}
          </div>
        ) : filteredCompanies.length > 0 ? (
          <ul>
            {filteredCompanies.map((company) => (
              <li
                key={company.id}
                className={cn(
                  "py-2 px-3 border-b cursor-pointer hover:bg-muted",
                  selectedCompany?.id === company.id && "bg-muted"
                )}
                onClick={() => handleCompanySelect(company)}
              >
                {company.name}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-400">
            No company found.{" "}
            <Link href="/request/new" className="text-blue-500 underline">
              Request a new company
            </Link>
          </div>
        )}
      </div>

      {/* Student Search */}
      <div className="mb-4 border p-4 rounded-md">
        <Input
          id="student-search"
          onChange={handleStudentSearch}
          placeholder="Enter Student name"
          className="mb-4"
        />

        {isFetchingStudents ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded-md" />
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-sm text-gray-400">
            No such student found.{" "}
            <Link
              href="/institution-admin/verification"
              className="text-blue-500 underline"
            >
              Check Verification
            </Link>
          </div>
        ) : (
          <ul>
            {filteredStudents.map((student) => (
              <li
                key={student.id}
                className={cn(
                  "p-2 border-b cursor-pointer hover:bg-muted",
                  selectedStudent?.id === student.id && "bg-muted"
                )}
                onClick={() => handleStudentSelect(student)}
              >
                <div className="flex justify-between items-center">
                  <p className="tracking-wide">{student.name}</p>
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
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button
        type="submit"
        className="mt-4 w-full"
        onClick={handleSubmitPlacementData}
        disabled={isSubmitting || !selectedCompany || !selectedStudent}
      >
        {isSubmitting ? "Submitting..." : "Submit Placement Record"}
      </Button>
    </div>
  );
};

export default UploadPlacementData;
