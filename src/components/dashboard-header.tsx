
'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Activity, Wifi, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type DashboardHeaderProps = {
  title?: string;
};

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const [timestamp, setTimestamp] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    setTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isQuery = pathname === '/query';
  const isDashboard = pathname === '/dashboard';
  
  const bgColor = isDashboard ? 'bg-[#12121A]/80' : 'bg-white/80';
  const textColor = isDashboard ? 'text-primary' : 'text-black';
  const mutedColor = isDashboard ? 'text-muted-foreground' : 'text-black/40';
  const borderColor = isDashboard ? 'border-white/10' : 'border-black/5';

  return (
    <header className={`sticky top-0 z-50 flex h-16 items-center justify-between border-b ${borderColor} ${bgColor} px-6 backdrop-blur-md`}>
      <div className="flex items-center gap-6">
        <SidebarTrigger className={`${isDashboard ? 'text-muted-foreground' : 'text-black/60'} hover:text-primary transition-colors`} />
        <div className={`hidden md:flex items-center gap-6 border-l ${borderColor} pl-6`}>
            <div className="flex items-center gap-2">
                <div className={`size-1.5 rounded-full ${isDashboard ? 'bg-primary' : 'bg-[#007C5A]'} animate-status`} />
                <span className={`text-[10px] font-mono ${isDashboard ? 'text-primary' : 'text-[#007C5A]'} font-bold uppercase tracking-widest`}>
                    {isQuery ? 'AI_CORE_ACTIVE' : 'System Online'}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Wifi className={`size-3 ${isDashboard ? 'text-primary' : 'text-black/40'}`} />
                <span className={`text-[10px] font-mono ${mutedColor} uppercase tracking-widest`}>Data Sync Active</span>
            </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-3">
            <Activity className={`size-3 ${isDashboard ? 'text-primary/40' : 'text-black/10'}`} />
            <div className={`h-1.5 w-32 ${isDashboard ? 'bg-secondary' : 'bg-black/5'} overflow-hidden`}>
                <div className={`h-full ${isDashboard ? 'bg-primary' : 'bg-[#007C5A]'} animate-pulse w-3/4`} />
            </div>
        </div>
        <div className={`flex items-center gap-3 ${isDashboard ? 'text-primary' : 'text-black'} font-mono text-[10px] font-bold tracking-[0.3em] ${isDashboard ? 'bg-primary/5' : 'bg-black/5'} px-4 py-1.5 border ${isDashboard ? 'border-primary/20' : 'border-black/10'}`}>
            <Monitor className="size-3" />
            {title || timestamp || '00:00:00'}
        </div>
      </div>
    </header>
  );
}
