"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  MessageSquare,
  FileDown,
  BookText,
  LayoutGrid,
  Home,
} from "lucide-react";
import { EnvisionOSLogo } from "@/components/icons";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/query", label: "Query", icon: MessageSquare },
  { href: "/ingestion", label: "Ingestion", icon: FileDown },
  { href: "/context", label: "Context", icon: BookText },
  { href: "/visualizations", label: "Visualizations", icon: LayoutGrid },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
