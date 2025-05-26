import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserVerificationStatus } from "@prisma/client";
import { Building, Globe, Mail, MapPin } from "lucide-react";
import { getInstitutionAdminProfile } from "./action";

export default async function InstitutionAdminProfilePage() {
  const profile = await getInstitutionAdminProfile();

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-muted-foreground">
          Profile not found or you don&apos;t have access.
        </p>
      </div>
    );
  }

  const getVerificationBadge = (status: UserVerificationStatus) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500">Verified</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500">Pending Verification</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500">Verification Rejected</Badge>;
      default:
        return <Badge className="bg-gray-400">Not Applied</Badge>;
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mx-auto">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={profile.image || ""}
                  alt={profile.name || "Admin"}
                />
                <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{profile.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Mail className="h-4 w-4" />
                {profile.email}
              </CardDescription>
              <div className="mt-2">
                {getVerificationBadge(profile.verificationStatus)}
              </div>
            </CardHeader>
          </Card>

          {/* Institution Details Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Institution Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Institution Name
                </h3>
                <p className="text-lg">{profile.institutionName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Website
                </h3>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {profile.website}
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Address
                </h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <p>
                    {profile.address}
                    <br />
                    {profile.city}, {profile.state}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
