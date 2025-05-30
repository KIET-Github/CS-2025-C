import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { LogoutButton } from "./logout";

export interface ProfileHeaderProps {
  companyRep: {
    name: string | null;
    image: string | null;
    email: string;
    companyName: string;
    website: string;
    verificationStatus: string;
  };
}

export default function ProfileHeader({ companyRep }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={companyRep.image || ""}
                alt={companyRep.name || "User"}
              />
              <AvatarFallback className="text-xl">
                {companyRep.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{companyRep.name}</h1>
              <p className="text-muted-foreground">
                {companyRep.companyName} Representative
              </p>
              <p className="text-sm text-muted-foreground">
                {companyRep.email}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </CardContent>
    </Card>
  );
}
