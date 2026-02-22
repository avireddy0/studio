import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { EnvisionOSLogo } from "@/components/icons";
import { SidebarNav } from "@/components/sidebar-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <EnvisionOSLogo className="size-8 text-primary" />
            <span className="text-lg font-semibold">Envision OS</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          {/* Footer content can go here */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
