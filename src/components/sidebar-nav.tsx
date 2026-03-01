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
  Settings,
  FileText,
  Map as MapIcon,
  Activity,
  Terminal,
  ChevronRight,
  Home
} from "lucide-react";

const navItems = [
  { href: "/#hero", label: "BRAND VISION", icon: Home },
  { href: "/#metrics", label: "METRICS", icon: Activity },
  { href: "/#intel", label: "INTEL CORE", icon: Terminal },
  { href: "/#ingestion", label: "INGESTION", icon: Database },
  { href: "/#fusion", label: "FUSION", icon: Zap },
  { href: "/#initialize", label: "INITIALIZE", icon: Settings },
  { href: "/site-intel", label: "SITE INTEL", icon: MapIcon },
  { href: "/documents", label: "DOCUMENTS", icon: FileText },
  { href: "/settings", label: "SETTINGS", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    // Handle initial hash
    setCurrentHash(window.location.hash.replace('#', ''));

    // Listen for hash changes
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace('#', ''));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <SidebarMenu className="gap-2">
      {navItems.map((item) => {
        const isAnchor = item.href.includes('#');
        const itemHash = isAnchor ? item.href.split('#')[1] : null;
        
        // Active state logic:
        // 1. For anchors: Must be on home page AND hash must match
        // 2. For standard links: Pathname must match exactly
        const isActive = isAnchor 
          ? pathname === '/' && currentHash === itemHash
          : pathname === item.href;

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.label}
              className={`
                  h-10 px-4 transition-all group
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