'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Activity, ShieldCheck, Globe, Wifi, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type DashboardHeaderProps = {
  title?: string;
};

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const [timestamp, setTimestamp] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isQuery = pathname === '/query';
  const bgColor = isQuery ? 'bg-black/20' : 'bg-[#12121A]/80';
  const textColor = isQuery ? 'text-white' : 'text-primary';
  const mutedColor = isQuery ? 'text-white/40' : 'text-muted-foreground';

  return (
    <header className={`sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 ${bgColor} px-6 backdrop-blur-md`}>
      <div className="flex items-center gap-6">
        <SidebarTrigger className={`${isQuery ? 'text-white' : 'text-muted-foreground'} hover:text-primary transition-colors`} />
        <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-6">
            <div className="flex items-center gap-2">
                <div className={`size-1.5 rounded-full ${isQuery ? 'bg-white' : 'bg-primary'} animate-status`} />
                <span className={`text-[10px] font-mono ${textColor} font-bold uppercase tracking-widest`}>
                    {isQuery ? 'AI_CORE_ACTIVE' : 'System Online'}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Wifi className={`size-3 ${isQuery ? 'text-white/60' : 'text-primary'}`} />
                <span className={`text-[10px] font-mono ${mutedColor} uppercase tracking-widest`}>Data Sync Active</span>
            </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-3">
            <Activity className={`size-3 ${isQuery ? 'text-white/20' : 'text-primary/40'}`} />
            <div className={`h-1.5 w-32 ${isQuery ? 'bg-white/10' : 'bg-secondary'} overflow-hidden`}>
                <div className={`h-full ${isQuery ? 'bg-white' : 'bg-primary'} animate-pulse w-3/4`} />
            </div>
        </div>
        <div className={`flex items-center gap-3 ${textColor} font-mono text-[10px] font-bold tracking-[0.3em] ${isQuery ? 'bg-white/10' : 'bg-primary/5'} px-4 py-1.5 border ${isQuery ? 'border-white/20' : 'border-primary/20'}`}>
            <Monitor className="size-3" />
            {title || timestamp || '00:00:00'}
        </div>
      </div>
    </header>
  );
}
