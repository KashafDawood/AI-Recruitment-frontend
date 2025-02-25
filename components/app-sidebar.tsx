"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import { Header } from "./nav-header";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <Header />
      <SidebarMenu>
        {data.map((item) => (
          <SidebarMenuItem key={item.title} className="pl-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="flex items-center space-x-2">
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </Sidebar>
  );
}
