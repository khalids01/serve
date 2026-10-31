import { BookOpen, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectLogo } from "./project-logo";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 min-w-0 items-center justify-between gap-1 px-3 sm:gap-3 sm:px-4">
        <ProjectLogo />

        <nav className="flex shrink-0 items-center gap-1 sm:gap-4">
          <Button variant="ghost" size="sm" className="px-2 sm:px-3" asChild>
            <Link href="/docs" aria-label="Documentation">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Documentation</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" className="px-2 sm:px-3" asChild>
            <Link
              href="https://github.com/khalids01/serve"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
          </Button>
          <UserNav />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
