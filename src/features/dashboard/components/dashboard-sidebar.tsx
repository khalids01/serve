"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  Settings,
} from "lucide-react";
import { ProjectLogo } from "@/components/core/project-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    isActive: (pathname: string) => pathname === "/dashboard",
  },
  {
    title: "Applications",
    href: "/dashboard/applications",
    icon: FolderOpen,
    isActive: (pathname: string) =>
      pathname.startsWith("/dashboard/applications"),
  },
  {
    title: "Upload",
    href: "/dashboard/upload",
    icon: Upload,
    isActive: (pathname: string) => pathname.startsWith("/dashboard/upload"),
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    isActive: (pathname: string) => pathname.startsWith("/dashboard/settings"),
  },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <ProjectLogo href="/dashboard" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive(pathname)}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
