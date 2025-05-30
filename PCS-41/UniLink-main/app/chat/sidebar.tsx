"use client";

import type { User } from "next-auth";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { fetcher } from "@/lib/utils";
import { Chat } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import useSWR from "swr";
import { ChatHistory } from "./chat-history";
import { SidebarUserNav } from "./sidebar-user-nav";

interface AppSidebarProps {
  user: User;
  initialChats: Chat[];
}

export function AppSidebar({ user, initialChats }: AppSidebarProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const { data: chats, mutate } = useSWR<Chat[]>(
    user ? "/api/chat" : null,
    fetcher,
    {
      fallbackData: initialChats,
    }
  );

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/chat"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-medium px-2 cursor-pointer">
                {siteConfig.name}
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push("/chat?new=true");
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{chats && <ChatHistory chats={chats} />}</SidebarContent>
      <SidebarFooter>
        <SidebarUserNav user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
