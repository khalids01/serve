"use client";

import {
  Archive,
  Cloud,
  Database,
  FolderOpen,
  Image,
  LayoutDashboard,
  Server,
  Settings,
  Upload,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    title: "Images",
    href: "/dashboard/images",
    icon: Image,
    isActive: (pathname: string) => pathname.startsWith("/dashboard/images"),
  },
  {
    title: "Upload",
    href: "/dashboard/upload",
    icon: Upload,
    isActive: (pathname: string) => pathname.startsWith("/dashboard/upload"),
  },
  {
    title: "Cache",
    href: "/dashboard/cache",
    icon: Database,
    isActive: (pathname: string) => pathname.startsWith("/dashboard/cache"),
  },
  {
    title: "Data Backup",
    href: "/dashboard/data-backup",
    icon: Archive,
    isActive: (pathname: string) =>
      pathname.startsWith("/dashboard/data-backup") ||
      pathname.startsWith("/dashboard/backups"),
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
    isActive: (pathname: string) => pathname.startsWith("/dashboard/profile"),
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    isActive: (pathname: string) => pathname.startsWith("/dashboard/settings"),
  },
] as const;

function DashboardSidebarLogo() {
  return (
    <Link
      href="/dashboard"
      className="flex min-w-0 items-center gap-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
    >
      <span className="relative flex size-9 shrink-0 items-center justify-center group-data-[collapsible=icon]:size-8">
        <Server className="size-7 text-primary group-data-[collapsible=icon]:size-6" />
        <Cloud className="absolute -right-0.5 -top-0.5 size-3.5 text-blue-500 group-data-[collapsible=icon]:hidden" />
      </span>
      <span className="truncate text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent group-data-[collapsible=icon]:hidden">
        Serve
      </span>
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex h-14 w-full shrink-0 flex-row items-center justify-start border-b border-sidebar-border p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <DashboardSidebarLogo />
      </SidebarHeader>
      <SidebarContent className="group-data-[collapsible=icon]:overflow-hidden">
        <SidebarGroup className="p-2 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
              {navItems.map((item) => (
                <SidebarMenuItem
                  key={item.href}
                  className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                >
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={item.isActive(pathname)}
                    tooltip={item.title}
                    className="h-11 gap-3 px-3 text-base [&>svg]:size-5 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:gap-0! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:[&>svg]:size-5"
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
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
