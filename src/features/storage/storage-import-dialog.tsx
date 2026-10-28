"use client";
import { FolderPlus, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { BrowseEntry } from "@/lib/storage/browse";

type Application = { id: string; name: string; slug: string };
type Result = {
  imported: number;
  failed: number;
  folders: number;
  results: { key: string; entryId?: string; error?: string }[];
};
export function StorageImportDialog({
  id,
  entries,
  onClose,
}: {
  id: string;
  entries: BrowseEntry[];
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState<string>();
  const [page, setPage] = useState<{
    applications: Application[];
    nextCursor?: string;
  }>();
  const [applicationId, setApplicationId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>();
  const endpoint = `/api/storage-connections/${encodeURIComponent(id)}/import`;
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const timer = setTimeout(() => {
      const query = new URLSearchParams({
        q: search,
        ...(cursor ? { cursor } : {}),
      });
      void fetch(`${endpoint}?${query}`, {
        signal: controller.signal,
        cache: "no-store",
      })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok)
            throw new Error(data.error || "Unable to load applications.");
          if (!controller.signal.aborted) setPage(data);
        })
        .catch((cause) => {
          if (!controller.signal.aborted) setError(cause.message);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, cursor, endpoint]);
  async function add() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          keys: entries.map((entry) => entry.key),
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to add these items.");
      setResult(data);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to add these items.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        onEscapeKeyDown={(event) => {
          if (busy) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (busy) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Add to application</DialogTitle>
          <DialogDescription>
            Copy {entries.length} selected{" "}
            {entries.length === 1 ? "item" : "items"} into an existing
            application's storage. Originals stay in place. Folder structure is
            preserved and supported images receive optimized variants.
          </DialogDescription>
        </DialogHeader>
        {!result && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                autoFocus
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCursor(undefined);
                }}
                disabled={busy}
                placeholder="Search applications…"
                aria-label="Search applications"
                maxLength={100}
                className="pl-9"
              />
            </div>
            <fieldset
              className="max-h-64 space-y-2 overflow-y-auto"
              aria-label="Choose application"
            >
              {loading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Loading applications…
                </p>
              ) : page?.applications.length ? (
                page.applications.map((app) => (
                  <label
                    key={app.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${applicationId === app.id ? "border-blue-500 bg-blue-500/5" : ""}`}
                  >
                    <input
                      type="radio"
                      name="application"
                      value={app.id}
                      checked={applicationId === app.id}
                      disabled={busy}
                      onChange={() => setApplicationId(app.id)}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {app.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {app.slug}
                      </span>
                    </span>
                  </label>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {search
                    ? "No matching applications."
                    : "Create an application before adding files."}
                </p>
              )}
            </fieldset>
            <div className="flex justify-end gap-2">
              {cursor && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busy || loading}
                  onClick={() => setCursor(undefined)}
                >
                  First page
                </Button>
              )}
              {page?.nextCursor && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy || loading}
                  onClick={() => setCursor(page.nextCursor)}
                >
                  More applications
                </Button>
              )}
            </div>
          </>
        )}
        {busy && (
          <p className="flex items-center gap-2 text-sm" aria-live="polite">
            <Loader2 className="size-4 animate-spin" />
            Copying files… Keep this dialog open until the import finishes.
          </p>
        )}
        {result && (
          <div className="space-y-3">
            <p className="text-sm" aria-live="polite">
              {result.imported}{" "}
              {result.imported === 1 ? "file is" : "files are"} available in the
              application.{" "}
              {result.folders > 0 &&
                `${result.folders} folders added or reused.`}
            </p>
            {result.failed > 0 && (
              <div
                role="alert"
                className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-destructive/30 p-3 text-sm"
              >
                <p>{result.failed} files could not be added:</p>
                {result.results
                  .filter((item) => item.error)
                  .map((item) => (
                    <p key={item.key} className="break-words text-xs">
                      {item.key}: {item.error}
                    </p>
                  ))}
              </div>
            )}
            <Button asChild variant="outline">
              <Link
                href={`/dashboard/files?applicationId=${encodeURIComponent(applicationId)}`}
              >
                Open application files
              </Link>
            </Button>
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" disabled={busy} onClick={onClose}>
            {result ? "Done" : "Cancel"}
          </Button>
          {(!result || result.failed > 0) && (
            <Button
              disabled={!applicationId || busy || loading}
              onClick={() => void add()}
            >
              <FolderPlus className="mr-2 size-4" />
              {result ? "Retry import" : "Add selected items"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
