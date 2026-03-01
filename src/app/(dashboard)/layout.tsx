'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { LoginForm } from '@/components/auth/login-form';
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

function AuthSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030303]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Landing page is always public
  if (pathname === '/') {
    return <>{children}</>;
  }

  // Show spinner while auth state resolves
  if (loading) {
    return <AuthSkeleton />;
  }

  // Require auth for all dashboard routes
  if (!user) {
    return <LoginForm />;
  }

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
