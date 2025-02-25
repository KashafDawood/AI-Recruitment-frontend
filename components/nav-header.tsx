import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/hooks/useUser";

export function Header() {
  const user = getCurrentUser();
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className="pl-1">
          <SidebarMenuButton size="lg" asChild>
            <Link href={`/${user?.role}`}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-800 dark:bg-white">
                <Image
                  src="/StaffeeLogo.svg"
                  alt="Logo"
                  width={20}
                  height={20}
                />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="text-2xl font-bold pl-2">Staffee</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
