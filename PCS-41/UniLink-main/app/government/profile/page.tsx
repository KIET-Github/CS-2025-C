"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { getGovernmentRepresentativeProfile } from "../action";

type GovernmentRepresentativeProfile = {
  name: string | null;
  image: string | null;
  email: string;
  governmentName: string;
  governmentLevel: "FEDERAL" | "STATE" | "LOCAL";
  department: string;
  designation: string;
  website: string;
  verificationStatus: "NOT_APPLIED" | "PENDING" | "APPROVED" | "REJECTED";
  governmentVerificationStatus: "NOT_VERIFIED" | "VERIFIED" | "REJECTED";
};

export default function GovernmentProfilePage() {
  const [profile, setProfile] =
    useState<GovernmentRepresentativeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getGovernmentRepresentativeProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
      case "VERIFIED":
        return "bg-green-600 hover:bg-green-700";
      case "PENDING":
      case "NOT_VERIFIED":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "REJECTED":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-secondary";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
  };

  const formatGovernmentLevel = (level: string) => {
    return level.charAt(0) + level.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className=" max-w-4xl py-10 mx-auto">
        <Card className="bg-card border-border">
          <CardHeader>
            <Skeleton className="h-8 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-4 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className=" max-w-4xl py-10 mx-auto">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>
              Unable to load government representative profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You may not have a government profile or there was an error
              fetching your data.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10 bg-grid-white">
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                Government Representative Profile
              </CardTitle>
              <CardDescription>
                View and manage your government profile information
              </CardDescription>
            </div>
            <Badge
              className={getVerificationStatusColor(profile.verificationStatus)}
            >
              {formatStatus(profile.verificationStatus)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={profile.image || ""}
                  alt={profile.name || "Profile"}
                />
                <AvatarFallback className="text-3xl">
                  {profile.name?.charAt(0) || profile.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Badge variant="outline" className="mt-2">
                {profile.designation}
              </Badge>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Government</p>
                  <p className="font-medium flex items-center gap-2">
                    {profile.governmentName}
                    <Badge
                      className={getVerificationStatusColor(
                        profile.governmentVerificationStatus
                      )}
                    >
                      {formatStatus(profile.governmentVerificationStatus)}
                    </Badge>
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-medium">
                    {formatGovernmentLevel(profile.governmentLevel)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{profile.department}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a
                    href={
                      profile.website.startsWith("http")
                        ? profile.website
                        : `https://${profile.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {profile.website}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
