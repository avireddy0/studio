
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Database,
  Zap,
  FileText,
  Map as MapIcon,
  Activity,
  Terminal,
  ChevronRight,
  Home,
  Layers
} from "lucide-react";

const navItems = [
  { href: "/#hero", label: "BRAND VISION", icon: Home },
  { href: "/#metrics", label: "METRICS", icon: Activity },
  { href: "/#intel", label: "INTEL CORE", icon: Terminal },
  { href: "/#tactical-bim", label: "TACTICAL BIM", icon: Layers },
  { href: "/#ingestion", label: "INGESTION", icon: Database },
  { href: "/#fusion", label: "FUSION", icon: Zap },
  { href: "/site-intel", label: "SITE INTEL", icon: MapIcon },
  { href: "/documents", label: "DOCUMENTS", icon: FileText },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace('#', ''));
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!mounted) return null;

  return (
    <SidebarMenu className="gap-2">
      {navItems.map((item) => {
        const isAnchor = item.href.includes('#');
        const itemHash = isAnchor ? item.href.split('#')[1] : null;
        
        const isActive = isAnchor 
          ? (pathname === '/' || pathname === '') && currentHash === itemHash
          : pathname === item.href;

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.label}
              className={`
                  h-10 px-4 transition-all group rounded-none
                  ${isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }
              `}
            >
              <Link href={item.href} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <item.icon className="size-4 shrink-0" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{item.label}</span>
                </div>
                {isAnchor && (
                  <ChevronRight className="size-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
