"use client";

import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MethodBadge } from "@/features/docs/components/method-badge";

type DocsSectionLayoutProps = {
  title: string;
  description: string;
  method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
  path: string;
  tester: React.ReactNode;
  reference: React.ReactNode;
  alert?: React.ReactNode;
};

export function DocsSectionLayout({
  title,
  description,
  method,
  path,
  tester,
  reference,
  alert,
}: DocsSectionLayoutProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mb-4 text-lg text-muted-foreground">{description}</p>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
          <MethodBadge method={method} />
          <code className="font-mono text-sm md:text-base">{path}</code>
        </div>
      </div>

      {alert}

      {tester}

      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-left font-medium hover:bg-muted/50">
          <span>Reference examples</span>
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-6 rounded-lg border bg-card p-6">
          {reference}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
