import Navbar from "@/components/home/navbar";
import { authOptions } from "@/lib/auth/auth-options";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";

interface RequestLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: RequestLayoutProps) {
  const session = await getServerSession(authOptions);
  return (
    <div className="relative z-0">
      <Navbar user={session?.user} />
      {children}
    </div>
  );
}
