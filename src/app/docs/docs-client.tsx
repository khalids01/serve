"use client";

import {
  ImageIcon,
  List,
  Maximize2,
  Menu,
  ScrollText,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PublicHeader } from "@/components/core/public-header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ApiKeySelector } from "@/features/docs/api-key-selector";
import { ApiTestProvider } from "@/features/docs/api-test-provider";
import { AuditLogsSection } from "@/features/docs/sections/audit-logs";
import { DeleteImageSection } from "@/features/docs/sections/delete-image";
import { GetImageSection } from "@/features/docs/sections/get-image";
import { ImageOptimizationSection } from "@/features/docs/sections/image-optimization";
import { ListImagesSection } from "@/features/docs/sections/list-images";
import { OnDemandResizeSection } from "@/features/docs/sections/on-demand-resize";
import { UploadImageSection } from "@/features/docs/sections/upload-image";
import { cn } from "@/lib/utils";
import type { DocsPageData } from "./types";

interface DocsClientProps {
  data: DocsPageData;
}

const sectionGroups = [
  {
    label: "Legacy REST testers",
    sections: [
      { id: "upload", title: "Upload Image", icon: Upload },
      { id: "optimization", title: "Image Optimization", icon: Sparkles },
      { id: "list", title: "List Images", icon: List },
      { id: "get", title: "Get Image", icon: ImageIcon },
      { id: "resize", title: "On-demand Resize", icon: Maximize2 },
      { id: "audit-logs", title: "Audit Logs", icon: ScrollText },
      { id: "delete", title: "Delete Image", icon: Trash2 },
    ],
  },
];

function DocsNav({
  activeSection,
  onSectionChange,
  className,
}: {
  activeSection: string;
  onSectionChange: (id: string) => void;
  className?: string;
}) {
  return (
    <nav className={cn("space-y-6", className)}>
      {sectionGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  variant="ghost"
                  key={section.id}
                  type="button"
                  aria-current={
                    activeSection === section.id ? "page" : undefined
                  }
                  onClick={() => onSectionChange(section.id)}
                  className={cn(
                    "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="mr-3 h-4 w-4 shrink-0" />
                  {section.title}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function DocsContent({ activeSection }: { activeSection: string }) {
  switch (activeSection) {
    case "upload":
      return <UploadImageSection />;
    case "optimization":
      return <ImageOptimizationSection />;
    case "list":
      return <ListImagesSection />;
    case "get":
      return <GetImageSection />;
    case "resize":
      return <OnDemandResizeSection />;
    case "audit-logs":
      return <AuditLogsSection />;
    case "delete":
      return <DeleteImageSection />;
    default:
      return <UploadImageSection />;
  }
}

export default function DocsClient({ data }: DocsClientProps) {
  const [activeSection, setActiveSection] = useState("upload");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const readHash = () => {
      const id = window.location.hash.slice(1);
      if (
        sectionGroups.some((group) =>
          group.sections.some((section) => section.id === id),
        )
      )
        setActiveSection(id);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  function handleSectionChange(id: string) {
    window.history.replaceState(null, "", `#${id}`);
    setActiveSection(id);
    setMobileOpen(false);
  }

  return (
    <ApiTestProvider applications={data.applications}>
      <div className="min-h-screen bg-background">
        <PublicHeader />

        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Legacy REST testers
                </h1>
                <p className="text-muted-foreground">
                  Interactive testers for earlier REST endpoints. New
                  integrations should use the complete SDK guide.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <Link href="/docs">Integration guide</Link>
                </Button>
                <span className="hidden rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-950 dark:text-green-300 sm:inline-flex">
                  Legacy API
                </span>
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                      <Menu className="h-4 w-4" />
                      <span className="sr-only">Open docs menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72">
                    <SheetHeader>
                      <SheetTitle>Documentation</SheetTitle>
                    </SheetHeader>
                    <DocsNav
                      activeSection={activeSection}
                      onSectionChange={handleSectionChange}
                      className="mt-6"
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto">
          <ApiKeySelector />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <aside className="hidden w-64 shrink-0 md:block">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="sticky top-8 pr-4">
                  <DocsNav
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                  />
                </div>
              </ScrollArea>
            </aside>

            <div className="min-w-0 flex-1 max-w-4xl">
              <DocsContent activeSection={activeSection} />
            </div>
          </div>
        </div>
      </div>
    </ApiTestProvider>
  );
}
