"use client";

import { siteConfig } from "@/config/site";
import { useSession } from "next-auth/react";
import { AvatarMenu } from "../home/avatar-menu";
import SignInButton from "../home/sign-in-button";
import { Skeleton } from "../ui/skeleton";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-loose font-semibold">
            {siteConfig.name}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {status === "loading" ? (
            <Skeleton className="h-8 w-8 rounded-md " />
          ) : session?.user ? (
            <AvatarMenu />
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </nav>
  );
}
