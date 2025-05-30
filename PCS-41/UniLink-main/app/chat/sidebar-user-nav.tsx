"use client";
import { ChevronUp, LogOut } from "lucide-react";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function SidebarUserNav({ user }: { user: User }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"outline"}
              className="bg-background h-10 rounded-sm w-full"
            >
              <Avatar className="h-6 w-6">
                {user.image && <AvatarImage src={user.image} />}
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="truncate">{user?.email}</span>
              <ChevronUp className="ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem asChild>
              <Button
                variant={"ghost"}
                className="w-full cursor-pointer gap-2 text-left"
                onClick={() => {
                  signOut({
                    callbackUrl: "/",
                  });
                }}
              >
                <LogOut />
                Sign out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
