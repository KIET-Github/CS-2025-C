import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileDetailsProps {
  companyRep: {
    name: string | null;
    image: string | null;
    email: string;
    companyName: string;
    website: string;
    verificationStatus: string;
  };
}

export default function ProfileDetails({ companyRep }: ProfileDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your account details and verification status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Account Type</p>
            <p>Company Representative</p>
          </div>
          <div>
            <p className="text-sm font-medium">Verification Status</p>
            <Badge
              variant={
                companyRep.verificationStatus === "APPROVED"
                  ? "default"
                  : "secondary"
              }
            >
              {companyRep.verificationStatus.replace(/_/g, " ")}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Details about your company</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {companyRep ? (
            <>
              <div>
                <p className="text-sm font-medium">Company Name</p>
                <p>{companyRep.companyName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Website</p>
                <a
                  href={companyRep.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {companyRep.website}
                </a>
              </div>
              <div>
                <p className="text-sm font-medium">Company Verification</p>
                <Badge
                  variant={
                    companyRep.verificationStatus === "VERIFIED"
                      ? "default"
                      : "secondary"
                  }
                >
                  {companyRep.verificationStatus.replace(/_/g, " ")}
                </Badge>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">
              No company information available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
