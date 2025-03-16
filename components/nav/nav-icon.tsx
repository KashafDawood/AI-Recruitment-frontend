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
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useState, useEffect } from "react";
import { useUserStore, User } from "@/store/userStore";
import { logout } from "@/api/auth/logout";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OptimizeImage from "../custom/optimizeImage";

export function ProfileIcon() {
  const [userData, setUserData] = useState<User | null>(null);
  const getUser = useUserStore((state) => state.getUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    await clearUser();
  };

  useEffect(() => {
    const data = getUser();
    setUserData(data);
  }, [getUser]);

  const userInitial = userData?.name?.charAt(0) || "U";
  const fallback = (
    <AvatarFallback className="rounded-lg">{userInitial}</AvatarFallback>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Avatar>
          <OptimizeImage
            src={userData?.photo}
            alt={userData?.name || "User"}
            width={100}
            height={100}
            fallback={fallback}
          />
        </Avatar>
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
              <OptimizeImage
                src={userData?.photo}
                alt={userData?.name || "User"}
                width={100}
                height={100}
                fallback={fallback}
              />
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{userData?.name}</span>
              <span className="truncate text-xs">{userData?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/${userData?.role}/profile`}>
            <DropdownMenuItem>
              <Settings2 />
              Profile
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
