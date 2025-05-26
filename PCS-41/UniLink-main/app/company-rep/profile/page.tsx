import { authOptions } from "@/lib/auth/auth-options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { getUserProfile } from "./actions";
import ProfileDetails from "./details";
import ProfileHeader from "./header";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userData = await getUserProfile();

  if (!userData) {
    redirect("/");
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8 mx-auto">
      <ProfileHeader companyRep={userData} />
      <ProfileDetails companyRep={userData} />
    </div>
  );
}
