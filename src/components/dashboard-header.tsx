'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Activity, ShieldCheck, Globe } from "lucide-react";

type DashboardHeaderProps = {
  title: string;
};

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors" />
        <div className="hidden md:flex items-center gap-4 border-l border-border pl-6">
            <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-primary animate-status" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">System Online</span>
            </div>
            <div className="flex items-center gap-2">
                <ShieldCheck className="size-3 text-primary" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Secure Sync</span>
            </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-3">
            <Activity className="size-3 text-primary/40" />
            <div className="h-2 w-24 bg-secondary overflow-hidden">
                <div className="h-full bg-primary animate-pulse w-3/4" />
            </div>
        </div>
        <div className="flex items-center gap-3 text-primary font-mono text-xs font-bold tracking-widest bg-primary/5 px-4 py-1.5 border border-primary/20">
            <Globe className="size-3" />
            {title || '00:00:00'}
        </div>
      </div>
    </header>
  );
}