"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ThemeToggle from "./dark-mode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, Settings2 } from "lucide-react";
import { Breadcrumbs } from "./customBreadcrumb";

export function DashboardNav() {
  const pathname = usePathname();
  const pageTitle = pathname.split("/").pop() || "Dashboard";

  const user = {
    name: "Kashaf",
    email: "kashaf@example.com",
    avatar: "skdjflsdkf",
  };

  return (
    <div className="h-20 border-b flex flex-col justify-center dark:border-gray-600 px-8">
      <div className="flex justify-between items-center">
        {/* Title Section */}
        <div className="space-y-1">
          <h1 className="text-lg font-semibold capitalize">
            {pageTitle === "candidate" || pageTitle === "employer"
              ? `${pageTitle} Dashboard`
              : pageTitle}
          </h1>
          <Breadcrumbs />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle className="hidden md:flex" />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/avatar.jpg" alt="User Avatar" />
                <AvatarFallback>NB</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">Natashia Bunny</p>
                <p className="text-xs text-gray-500">natashiabunny@mail.com</p>
              </div>
              <ChevronDown size={15} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Settings2 />
                  Profile
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
