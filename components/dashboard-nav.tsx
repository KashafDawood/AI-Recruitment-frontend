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
import { useState, useEffect } from "react";
import { useUserStore, User } from "@/store/userStore";
import { logout } from "@/api/auth/logout";
import { useRouter } from "next/navigation";
import Spinner from "./ui/spinner";

export function DashboardNav() {
  const pathname = usePathname();
  const pageTitle = pathname.split("/").pop() || "Dashboard";
  const [userData, setUserData] = useState<User | null>(null);
  const getUser = useUserStore((state) => state.getUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    await clearUser();
    setTimeout(() => {
      router.push("/login");
    }, 500);
  };

  useEffect(() => {
    const data = getUser();
    setUserData(data);
  }, [getUser]);

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
                <AvatarImage
                  src={userData?.photo ?? undefined}
                  alt={userData?.name}
                />
                <AvatarFallback className="rounded-lg">
                  {userData?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{userData?.name}</p>
                <p className="text-xs text-gray-500">{userData?.email}</p>
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
                    <AvatarImage
                      src={userData?.photo ?? undefined}
                      alt={userData?.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {userData?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userData?.name}
                    </span>
                    <span className="truncate text-xs">{userData?.email}</span>
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
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isLoggingOut && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner /> {/* Show a spinner or loading indicator */}
        </div>
      )}
    </div>
  );
}
