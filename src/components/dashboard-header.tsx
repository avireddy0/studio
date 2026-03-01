'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Activity, ShieldCheck, Globe, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

type DashboardHeaderProps = {
  title?: string;
};

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-[#12121A]/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors" />
        <div className="hidden md:flex items-center gap-6 border-l border-border pl-6">
            <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-primary animate-status" />
                <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">System Online</span>
            </div>
            <div className="flex items-center gap-2">
                <Wifi className="size-3 text-primary" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Data Sync Active</span>
            </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-3">
            <Activity className="size-3 text-primary/40" />
            <div className="h-1.5 w-32 bg-secondary overflow-hidden">
                <div className="h-full bg-primary animate-pulse w-3/4" />
            </div>
        </div>
        <div className="flex items-center gap-3 text-primary font-mono text-[10px] font-bold tracking-[0.3em] bg-primary/5 px-4 py-1.5 border border-primary/20">
            <Globe className="size-3" />
            {title || timestamp || '00:00:00'}
        </div>
      </div>
    </header>
  );
}
