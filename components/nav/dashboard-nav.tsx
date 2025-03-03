"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "../custom/dark-mode";
import { Breadcrumbs } from "../custom/Breadcrumbs";
import { Profile } from "./nav-profile";

export function DashboardNav() {
  const pathname = usePathname();
  const pageTitle = pathname.split("/").pop() || "Dashboard";

  return (
    <div className="h-20 border-b flex flex-col justify-center dark:border-gray-600 px-16">
      <div className="flex justify-between items-center">
        {/* Title Section */}
        <div className="space-y-1">
          <h1 className="text-2xl font-aclonica font-semibold capitalize">
            {pageTitle === "candidate" || pageTitle === "employer"
              ? `${pageTitle} Dashboard`
              : pageTitle}
          </h1>
          <Breadcrumbs />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle className="hidden md:flex" />
          <Profile />
        </div>
      </div>
    </div>
  );
}
