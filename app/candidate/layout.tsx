import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { navItems } from "./nav";
import { DashboardNav } from "@/components/dashboard-nav";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
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
