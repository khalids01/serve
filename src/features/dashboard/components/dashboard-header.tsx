"use client";

import Link from "next/link";
import { BookOpen, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/core/theme-toggle";
import { UserNav } from "@/components/core/user-nav";
import { Separator } from "@/components/ui/separator";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-end gap-2">
        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
          <Link href="/docs">
            <BookOpen className="h-4 w-4 mr-2" />
            Documentation
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild className="sm:hidden">
          <Link href="/docs" aria-label="Documentation">
            <BookOpen className="h-4 w-4" />
          </Link>
        </Button>

        <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
          <Link
            href="https://github.com/khalids01/serve"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild className="sm:hidden">
          <Link
            href="https://github.com/khalids01/serve"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </Link>
        </Button>

        <UserNav />
        <ThemeToggle />
      </div>
    </header>
  );
}
