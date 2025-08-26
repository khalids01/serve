import { ProjectLogo } from "./project-logo"
import { ThemeToggle } from "./theme-toggle"
import { UserNav } from "@/components/auth/user-nav"
import { Button } from "@/components/ui/button"
import { Github, BookOpen } from "lucide-react"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <ProjectLogo />
        
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs">
              <BookOpen className="h-4 w-4 mr-2" />
              Documentation
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <Link href="https://github.com/your-username/serve" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Link>
          </Button>
          
          <ThemeToggle />
          <UserNav />
        </nav>
      </div>
    </header>
  )
}
