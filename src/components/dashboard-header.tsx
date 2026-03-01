
'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Activity, Wifi, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
  
  // THREE-ATMOSPHERE LOGIC
  let bgColor = 'bg-white/80';
  let textColor = 'text-black';
  let mutedColor = 'text-black/40';
  let borderColor = 'border-black/5';
  let iconColor = 'text-black/60';

  if (isDashboard) {
    bgColor = 'bg-[#12121A]/80';
    textColor = 'text-primary';
    mutedColor = 'text-muted-foreground';
    borderColor = 'border-white/10';
    iconColor = 'text-muted-foreground';
  } else if (isQuery) {
    bgColor = 'bg-primary'; // Envision Green
    textColor = 'text-white';
    mutedColor = 'text-white/70';
    borderColor = 'border-white/10';
    iconColor = 'text-white/80';
  }

  return (
    <header className={cn(
        "sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6 backdrop-blur-md transition-colors duration-300",
        borderColor,
        bgColor
    )}>
      <div className="flex items-center gap-6">
        <SidebarTrigger className={cn(
            "hover:text-primary transition-colors",
            isQuery ? "text-white/80 hover:text-white" : iconColor
        )} />
        <div className={cn("hidden md:flex items-center gap-6 border-l pl-6", borderColor)}>
            <div className="flex items-center gap-2">
                <div className={cn(
                    "size-1.5 rounded-full animate-status",
                    isQuery ? "bg-white" : "bg-primary"
                )} />
                <span className={cn(
                    "text-[10px] font-mono font-bold uppercase tracking-widest",
                    isQuery ? "text-white" : "text-primary"
                )}>
                    {isQuery ? 'AI_CORE_ACTIVE' : 'System Online'}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Wifi className={cn("size-3", isQuery ? "text-white/40" : isDashboard ? "text-primary" : "text-black/40")} />
                <span className={cn("text-[10px] font-mono uppercase tracking-widest", mutedColor)}>Data Sync Active</span>
            </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-3">
            <Activity className={cn("size-3", isQuery ? "text-white/20" : isDashboard ? "text-primary/40" : "text-black/10")} />
            <div className={cn("h-1.5 w-32 overflow-hidden", isDashboard ? "bg-secondary" : isQuery ? "bg-white/10" : "bg-black/5")}>
                <div className={cn(
                    "h-full animate-pulse w-3/4",
                    isQuery ? "bg-white" : "bg-primary"
                )} />
            </div>
        </div>
        <div className={cn(
            "flex items-center gap-3 font-mono text-[10px] font-bold tracking-[0.3em] px-4 py-1.5 border transition-all",
            isQuery 
                ? "text-white bg-white/10 border-white/20" 
                : isDashboard 
                    ? "text-primary bg-primary/5 border-primary/20" 
                    : "text-black bg-black/5 border-black/10"
        )}>
            <Monitor className="size-3" />
            {title || timestamp || '00:00:00'}
        </div>
      </div>
    </header>
  );
}
