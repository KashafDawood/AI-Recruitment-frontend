"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { navItems } from "./nav";
import { DashboardNav } from "@/components/nav/dashboard-nav";
import { useEffect, useState } from "react";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
      <AppSidebar data={navItems} />
      <div className="flex flex-col flex-1">
        {/* Navbar - Full Width */}
        <DashboardNav />
        <SidebarTrigger className="absolute top-0 " />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
