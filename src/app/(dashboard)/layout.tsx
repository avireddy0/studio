'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";
import { DashboardHeader } from "@/components/dashboard-header";
import { EnvisionOSLogo } from "@/components/icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border bg-card">
        <SidebarHeader className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <EnvisionOSLogo className="size-6 text-primary" />
            <span className="text-sm font-bold tracking-[0.3em] uppercase">Envision OS</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-6">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-border">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="size-1.5 rounded-full bg-primary animate-status" />
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Node: 8812-Active</span>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background flex flex-col">
        <DashboardHeader title={timestamp} />
        <div className="flex-1 overflow-auto tactical-grid scan-overlay">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}