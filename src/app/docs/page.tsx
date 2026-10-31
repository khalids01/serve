import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/core/public-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuideContent } from "@/features/docs/guide-content";
import {
  integrationSections,
  sdkVersion,
} from "@/features/docs/integration-guide";

export const metadata: Metadata = {
  title: "Serve SDK integration guide",
  description:
    "Complete server, JavaScript and React integration guide, including authentication, destinations, images and delivery.",
  alternates: { types: { "text/markdown": "/docs.md" } },
};
export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b pb-6">
          <Badge variant="secondary">SDK {sdkVersion}</Badge>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <a href="/docs.md" type="text/markdown">
                Complete Markdown for agents
              </a>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/docs/legacy">Legacy REST testers</Link>
            </Button>
          </div>
        </header>
        <div className="grid min-w-0 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside>
            <nav
              aria-label="Integration guide sections"
              className="space-y-1 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
            >
              {integrationSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>
          <article className="min-w-0 max-w-4xl [overflow-wrap:anywhere]">
            <GuideContent />
          </article>
        </div>
      </main>
    </div>
  );
}
