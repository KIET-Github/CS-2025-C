"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const sidebarLinks = [
    { name: "Organization Requests", href: "/admin/organization-requests" },
    { name: "Verified Organizations ", href: "/admin/verified-organizations" },
    { name: "Verification Requests", href: "/admin/verification-requests" },
    { name: "Verified Requests", href: "/admin/verified-requests" },
    { name: "Create Organization", href: "/admin/create-organization" },
    { name: "Chat With AI", href: "/chat" },
  ];

  const pathname = usePathname();
  return (
    <div className="fixed inset-y-0 left-0 w-96 bg-background border-r pt-20 pr-8 pl-4">
      <div className="flex flex-col h-full space-y-2">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block px-4 py-2 transition border-l border-l-muted hover:bg-muted",
              pathname === link.href && "border-l-primary"
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
