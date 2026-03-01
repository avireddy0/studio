'use client';

import { Monitor, Home, Database, Terminal, Zap, Layers, Map as MapIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#hero", label: "01_VISION", icon: Home },
  { href: "#ingestion", label: "02_INGEST", icon: Database },
  { href: "#intel", label: "03_INTEL", icon: Terminal },
  { href: "#fusion", label: "04_FUSION", icon: Zap },
  { href: "#tactical-bim", label: "05_BIM", icon: Layers },
  { href: "#site-docs", label: "06_SITE", icon: MapIcon },
];

export function DashboardHeader({ title }: { title?: string }) {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const container = document.getElementById('main-scroll-container');
      if (container) {
        const progress = (container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100;
        setScrollProgress(progress);
      }
    };

    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6 bg-white border-black/5" />
    );
  }

  const isDarkSection = scrollProgress > 45; // Transitions to Obsidian roughly after Intel section
  
  const bgColor = isDarkSection ? 'bg-[#0A0A0F]/95' : 'bg-white/95';
  const textColor = isDarkSection ? 'text-white' : 'text-black';
  const borderColor = isDarkSection ? 'border-white/10' : 'border-black/5';

  return (
    <header className={cn(
        "sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6 backdrop-blur-md transition-all duration-500",
        borderColor,
        bgColor
    )}>
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 group">
            <Monitor className="size-5 text-primary" />
            <span className={cn(
                "text-xs font-bold tracking-[0.3em] uppercase transition-colors",
                textColor
            )}>Envision OS</span>
        </Link>
        
        <nav className={cn("hidden lg:flex items-center gap-6 border-l pl-8", borderColor)}>
            {navItems.map((item) => (
                <a 
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-2 group transition-all opacity-60 hover:opacity-100",
                        textColor
                    )}
                >
                    <item.icon className="size-3 text-primary" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest">{item.label}</span>
                </a>
            ))}
        </nav>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full animate-status bg-primary" />
                <span className={cn(
                    "text-[10px] font-mono font-bold uppercase tracking-widest",
                    isDarkSection ? "text-primary" : "text-black"
                )}>
                    Node: Active
                </span>
            </div>
            <div className={cn(
                "flex items-center gap-3 font-mono text-[10px] font-bold tracking-[0.3em] px-4 py-1.5 border transition-all",
                isDarkSection ? "text-primary bg-primary/5 border-primary/20" : "text-black bg-black/5 border-black/10"
            )}>
                {title || '00:00:00'}
            </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] bg-primary/20 w-full overflow-hidden">
        <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
}
