import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatDocumentType } from "@/lib/utils";
import { X } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { Label } from "../ui/label";

export enum CompanyRepresentativeDocumentsType {
  COMPANY_ID = "COMPANY_ID",
  BUSINESS_CARD = "BUSINESS_CARD",
}

export interface DocumentFile {
  file: File | null;
  preview: string | null;
  error: string | null;
}

export type CompanyRepresentativeDocumentsFiles = {
  [key in CompanyRepresentativeDocumentsType]?: DocumentFile;
};

const CompanyRepresentativeUploadDocs = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [message, setMessage] = useState<string>();
  const params = useParams();

  const fileInputRefs = useRef<
    Record<CompanyRepresentativeDocumentsType, HTMLInputElement | null>
  >({
    [CompanyRepresentativeDocumentsType.COMPANY_ID]: null,
    [CompanyRepresentativeDocumentsType.BUSINESS_CARD]: null,
  });

  const [documents, setDocuments] =
    useState<CompanyRepresentativeDocumentsFiles>({
      [CompanyRepresentativeDocumentsType.COMPANY_ID]: {
        file: null,
        preview: null,
        error: null,
      },
      [CompanyRepresentativeDocumentsType.BUSINESS_CARD]: {
        file: null,
        preview: null,
        error: null,
      },
    });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: CompanyRepresentativeDocumentsType
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setDocuments((prev) => ({
        ...prev,
        [type]: {
          file,
          preview: previewUrl,
          error: null,
        },
      }));
    }
  };

  const removeDocument = (type: CompanyRepresentativeDocumentsType) => {
    const currentPreview = documents[type]?.preview;
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }

    setDocuments((prev) => ({
      ...prev,
      [type]: {
        file: null,
        preview: null,
        error: null,
      },
    }));

    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type].value = "";
    }
  };

  const validateDocuments = (): boolean => {
    let isValid = true;

    Object.values(CompanyRepresentativeDocumentsType).forEach((type) => {
      if (!documents[type]?.file) {
        setDocuments((prev) => ({
          ...prev,
          [type]: {
            file: null,
            preview: null,
            error: `${formatDocumentType(type)} is required`,
          },
        }));
        isValid = false;
      } else {
        setDocuments((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            error: null,
          },
        }));
      }
    });

    return isValid;
  };

  const handleUploadSubmit = async () => {
    // Validate all documents
    if (!validateDocuments()) {
      setMessage("Please upload all required documents");
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData object to send files
      const formData = new FormData();

      // Add role to FormData
      formData.append("role", "COMPANY_REPRESENTATIVE");
      formData.append("companyId", params.id as string);

      // Add each document to FormData with its type
      Object.entries(documents).forEach(([type, doc]) => {
        if (doc.file) {
          // Use a unique field name for each file
          const fieldName = `file_${type}`;
          formData.append(fieldName, doc.file);
          // Add document type as a separate field
          formData.append(`${fieldName}_type`, type);
        }
      });

      // Send POST request to API endpoint
      const response = await fetch("/api/auth/upload-documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setMessage("Failed to upload documents");
      } else {
        setMessage("Documents uploaded successfully. Verification pending.");
      }

      // Log the user out
      signOut({ callbackUrl: "/" });

      // Reset form after successful upload
      Object.values(CompanyRepresentativeDocumentsType).forEach((type) => {
        removeDocument(type);
      });
    } catch (error) {
      console.error("Error uploading documents:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while uploading documents"
      );
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
  }, [message, toast]);

  return (
    <div className="w-full max-w-xl border rounded-md py-4 px-5 bg-background">
      <div className="mb-4">
        <h2 className="text-xl font-medium">Required Documents</h2>
        <span className="text-sm text-muted-foreground">
          Please upload the following documents to verify your company
          affiliation
        </span>
      </div>

      <div className="space-y-6">
        {Object.values(CompanyRepresentativeDocumentsType).map((type) => (
          <div key={type} className="space-y-2">
            <Label
              className={`text-sm transition-colors font-normal ${
                documents[type]?.error ? "text-destructive" : ""
              }`}
            >
              {formatDocumentType(type)}
            </Label>
            <div className="mt-1">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={(e) => handleFileChange(e, type)}
                className={`w-full cursor-pointer ${
                  documents[type]?.error ? "border-destructive" : ""
                }`}
                ref={(el) => {
                  fileInputRefs.current[type] = el;
                }}
              />
            </div>
            {documents[type]?.preview && (
              <div className="mt-2 relative">
                <div className="relative w-full h-40 border rounded-md overflow-hidden">
                  {documents[type]?.file?.type.startsWith("image/") ? (
                    <Image
                      src={documents[type]?.preview}
                      alt={`${type} Preview`}
                      width={320}
                      height={160}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <p className="text-sm text-muted-foreground">
                        PDF Document
                      </p>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeDocument(type as CompanyRepresentativeDocumentsType)
                    }
                    className="absolute top-2 right-2 p-1 bg-background rounded-full shadow-md hover:bg-accent transition-colors"
                  >
                    <X className="h-4 w-4 text-foreground" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button
          type="button"
          className="w-full"
          disabled={isUploading}
          onClick={handleUploadSubmit}
        >
          {isUploading ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Uploading...
            </>
          ) : (
            "Upload Documents"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CompanyRepresentativeUploadDocs;
