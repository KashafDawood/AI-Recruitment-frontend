"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardNav } from "@/components/nav/dashboard-nav";
import { useEffect, useState } from "react";
import { useUserWithLoading } from "@/hooks/useUser";
import { navItems as candidateNav } from "@/app/(dashboard)/candidate/nav";
import { navItems as employerNav } from "@/app/(dashboard)/employer/nav";
import { HeroHeader } from "@/components/home/header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserWithLoading();

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
    <>
      {!user ? (
        // Not logged in view - only back button and children
        <div className="flex flex-col min-h-screen">
          <div className="mb-20">
            <HeroHeader />
          </div>
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      ) : (
        // Logged in view - with sidebar and nav
        <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
          <AppSidebar
            data={user.role === "candidate" ? candidateNav : employerNav}
          />
          <div className="flex flex-col flex-1">
            {/* Navbar - Full Width */}
            <DashboardNav />
            <SidebarTrigger className="absolute top-0 " />

            {/* Page Content */}
            <main className="flex-1 overflow-auto p-4">{children}</main>
          </div>
        </SidebarProvider>
      )}
    </>
  );
}
