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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6 bg-[#0A0A0F] border-white/10">
        <div className="flex items-center gap-6">
          <SidebarTrigger className="text-muted-foreground" />
        </div>
      </header>
    );
  }

  // Navigation context
  const isQuery = pathname === '/query';
  const isHome = pathname === '/';
  
  // Header styles based on atmosphere
  // If on home, it's white. Otherwise, obsidian.
  const bgColor = isQuery ? 'bg-primary' : (isHome ? 'bg-white/90' : 'bg-[#0A0A0F]/90');
  const textColor = isQuery ? 'text-white' : (isHome ? 'text-black' : 'text-primary');
  const mutedColor = isQuery ? 'text-white/70' : 'text-muted-foreground';
  const borderColor = isHome ? 'border-black/5' : 'border-white/10';
  const iconColor = isHome ? 'text-black/40' : 'text-muted-foreground';

  return (
    <header className={cn(
        "sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6 backdrop-blur-md transition-all duration-300",
        borderColor,
        bgColor
    )}>
      <div className="flex items-center gap-6">
        <SidebarTrigger className={cn(
            "hover:text-primary transition-colors",
            isQuery ? "text-white/80 hover:text-white" : (isHome ? "text-black/60 hover:text-black" : iconColor)
        )} />
        <div className={cn("hidden md:flex items-center gap-6 border-l pl-6", borderColor)}>
            <div className="flex items-center gap-2">
                <div className={cn(
                    "size-1.5 rounded-full animate-status",
                    isQuery ? "bg-white" : (isHome ? "bg-primary" : "bg-primary")
                )} />
                <span className={cn(
                    "text-[10px] font-mono font-bold uppercase tracking-widest",
                    isQuery ? "text-white" : (isHome ? "text-black" : "text-primary")
                )}>
                    {isQuery ? 'AI_CORE_ACTIVE' : 'System Online'}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Wifi className={cn("size-3", isQuery ? "text-white/40" : (isHome ? "text-black/40" : "text-primary"))} />
                <span className={cn("text-[10px] font-mono uppercase tracking-widest", mutedColor)}>Data Sync Active</span>
            </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-3">
            <Activity className={cn("size-3", isQuery ? "text-white/20" : (isHome ? "text-black/20" : "text-primary/40"))} />
            <div className={cn("h-1.5 w-32 overflow-hidden", isQuery ? "bg-white/10" : "bg-secondary")}>
                <div className={cn(
                    "h-full animate-pulse w-3/4",
                    isQuery ? "bg-white" : (isHome ? "bg-black" : "bg-primary")
                )} />
            </div>
        </div>
        <div className={cn(
            "flex items-center gap-3 font-mono text-[10px] font-bold tracking-[0.3em] px-4 py-1.5 border transition-all",
            isQuery 
                ? "text-white bg-white/10 border-white/20" 
                : (isHome ? "text-black bg-black/5 border-black/10" : "text-primary bg-primary/5 border-primary/20")
        )}>
            <Monitor className="size-3" />
            {title || '00:00:00'}
        </div>
      </div>
    </header>
  );
}
