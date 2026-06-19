"use client";

import Link from "next/link";
import { Book, Key, Upload, HardDrive, Database } from "lucide-react";
import { CodeBlock } from "@/features/docs/code-block";

type GettingStartedSectionProps = {
  onSectionChange?: (sectionId: string) => void;
};

export function GettingStartedSection({
  onSectionChange,
}: GettingStartedSectionProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Book className="h-5 w-5 text-primary" />
          Start here
        </h3>
        <ol className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              1
            </span>
            <span>
              Sign in to the{" "}
              <Link href="/dashboard" className="text-primary underline-offset-4 hover:underline">
                dashboard
              </Link>
              , create an application, and generate an API key.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              2
            </span>
            <span className="flex flex-wrap items-center gap-2">
              Select your key above, then read
              {onSectionChange ? (
                <button
                  type="button"
                  onClick={() => onSectionChange("authentication")}
                  className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                >
                  <Key className="h-3.5 w-3.5" />
                  Authentication
                </button>
              ) : (
                " Authentication "
              )}
              for header format.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              3
            </span>
            <span className="flex flex-wrap items-center gap-2">
              Try
              {onSectionChange ? (
                <button
                  type="button"
                  onClick={() => onSectionChange("upload")}
                  className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Image
                </button>
              ) : (
                " Upload Image "
              )}
              with the live tester.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              4
            </span>
            <span className="flex flex-wrap items-center gap-2">
              Manage backups at
              <Link
                href="/dashboard/data-backup"
                className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
              >
                <Database className="h-3.5 w-3.5" />
                Data Backup
              </Link>
              and cache at
              <Link
                href="/dashboard/cache"
                className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
              >
                <HardDrive className="h-3.5 w-3.5" />
                Cache
              </Link>
            </span>
          </li>
        </ol>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Getting Started
        </h2>
        <p className="mb-6 text-lg text-muted-foreground">
          Welcome to the Serve API. This guide helps you upload and manage files
          programmatically.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 font-semibold">Quick Setup</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>Generate an API key from your dashboard</li>
            <li>Include it in your requests</li>
            <li>Start uploading files</li>
          </ol>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 font-semibold">Base URL</h3>
          <CodeBlock
            code="https://your-domain.com/api"
            language="text"
            id="base-url"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 font-semibold">First Request</h3>
        <p className="mb-4 text-muted-foreground">
          Here&apos;s how to make your first API call:
        </p>
        <CodeBlock
          code={`curl -X POST https://your-domain.com/api/upload \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -F "file=@image.jpg" \\
  -F "tags=profile,avatar"`}
          language="bash"
          id="first-request"
        />
      </div>
    </div>
  );
}
