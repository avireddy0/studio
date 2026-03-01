
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Database,
  Zap,
  Settings,
  FileText,
  Map as MapIcon,
  Activity,
  Terminal
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "OVERVIEW", icon: LayoutDashboard },
  { href: "/site-intel", label: "SITE INTEL", icon: MapIcon },
  { href: "/ingestion", label: "DATA INGESTION", icon: Database },
  { href: "/context", label: "CONTEXT FUSION", icon: Zap },
  { href: "/visualizations", label: "TELEMETRY", icon: Activity },
  { href: "/query", label: "INTEL TERMINAL", icon: Terminal },
  { href: "/documents", label: "DOCUMENTS", icon: FileText },
  { href: "/settings", label: "SETTINGS", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="gap-2">
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
            className={`
                h-10 px-4 transition-all
                ${pathname === item.href 
                    ? "bg-primary/10 text-primary border-l-2 border-primary" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }
            `}
          >
            <Link href={item.href} className="flex items-center gap-4">
              <item.icon className="size-4 shrink-0" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
