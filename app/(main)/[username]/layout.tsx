"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardNav } from "@/components/nav/dashboard-nav";
import { useEffect, useState } from "react";
import { useUserWithLoading } from "@/hooks/useUser";
import { navItems as candidateNav } from "@/app/(dashboard)/candidate/nav";
import { navItems as employerNav } from "@/app/(dashboard)/employer/nav";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      {!user && (
        <div className="absolute top-4 left-4 z-50">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      )}
      <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
        <AppSidebar
          data={user?.role === "candidate" ? candidateNav : employerNav}
        />
        <div className="flex flex-col flex-1">
          {/* Navbar - Full Width */}
          <DashboardNav />
          <SidebarTrigger className="absolute top-0 " />

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </SidebarProvider>
    </>
  );
}
