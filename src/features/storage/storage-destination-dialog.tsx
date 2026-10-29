"use client";
import { ArrowLeft, ChevronRight, Folder, Loader2 } from "lucide-react";
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
import type { BrowsePage } from "@/lib/storage/browse";
import { StorageLocationSelect } from "./location-select";
import { storageLabel } from "./storage-preview";

export function StorageDestinationDialog({
  sourceId,
  initialPrefix,
  mode,
  count,
  busy,
  errorMessage,
  onClose,
  onChoose,
}: {
  sourceId: string;
  initialPrefix: string;
  mode: "copy" | "move";
  count: number;
  busy: boolean;
  errorMessage?: string;
  onClose: () => void;
  onChoose: (id: string, prefix: string) => void;
}) {
  const [id, setId] = useState(sourceId);
  const [prefix, setPrefix] = useState(initialPrefix);
  const [cursor, setCursor] = useState<string>();
  const [page, setPage] = useState<BrowsePage>();
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setPage(undefined);
    setError("");
    const query = new URLSearchParams({
      prefix,
      ...(cursor ? { cursor } : {}),
    });
    void fetch(
      `/api/storage-connections/${encodeURIComponent(id)}/browse?${query}`,
      { signal: controller.signal, cache: "no-store" },
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error ?? "Unable to load folders.");
        if (!controller.signal.aborted) setPage(data);
      })
      .catch((cause) => {
        if (!controller.signal.aborted) setError(cause.message);
      });
    return () => controller.abort();
  }, [id, prefix, cursor]);
  const navigate = (folder: string) => {
    setPrefix(folder);
    setCursor(undefined);
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "move" ? "Move" : "Copy"} {count}{" "}
            {count === 1 ? "item" : "items"}
          </DialogTitle>
          <DialogDescription>
            Choose a storage location and destination folder.
          </DialogDescription>
        </DialogHeader>
        <StorageLocationSelect
          value={id}
          onChange={(value) => {
            setId(value);
            navigate("");
          }}
          disabled={busy}
        />
        <div className="overflow-hidden rounded-lg border">
          <div className="flex items-center gap-2 border-b bg-muted/40 p-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Parent folder"
              disabled={!prefix || busy}
              onClick={() =>
                navigate(
                  prefix.split("/").slice(0, -2).join("/") +
                    (prefix.split("/").length > 2 ? "/" : ""),
                )
              }
            >
              <ArrowLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              type="button"
              className="shrink-0 text-sm hover:underline"
              onClick={() => navigate("")}
            >
              Root
            </Button>
            <span className="truncate text-sm text-muted-foreground">
              / {prefix}
            </span>
          </div>
          <div className="max-h-64 min-h-40 overflow-auto p-2">
            {error ? (
              <p role="alert" className="p-4 text-sm text-destructive">
                {error}
              </p>
            ) : !page ? (
              <Loader2 className="mx-auto my-10 size-5 animate-spin" />
            ) : (
              <>
                {page.entries
                  .filter(
                    (entry) => entry.kind === "folder" && !entry.protected,
                  )
                  .map((entry) => (
                    <Button
                      variant="ghost"
                      key={entry.key}
                      type="button"
                      disabled={busy}
                      className="flex h-auto w-full items-center justify-start gap-3 rounded-md px-3 py-3 text-left text-sm hover:bg-muted"
                      onClick={() => navigate(entry.key)}
                    >
                      <Folder className="size-5 shrink-0 text-blue-500" />
                      <span className="truncate">{storageLabel(entry)}</span>
                      <ChevronRight className="ml-auto size-4" />
                    </Button>
                  ))}
                {!page.entries.some(
                  (entry) => entry.kind === "folder" && !entry.protected,
                ) && (
                  <p className="p-6 text-center text-sm text-muted-foreground">
                    No subfolders on this page. You can use the current folder.
                  </p>
                )}
              </>
            )}
          </div>
          {page && (cursor || page.nextCursor) && (
            <div className="flex justify-end gap-2 border-t p-2">
              {cursor && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCursor(undefined)}
                >
                  First page
                </Button>
              )}
              {page.nextCursor && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCursor(page.nextCursor)}
                >
                  Next page
                </Button>
              )}
            </div>
          )}
        </div>
        {errorMessage && (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" disabled={busy} onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={busy || !page || Boolean(error)}
            onClick={() => onChoose(id, prefix)}
          >
            {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
            {mode === "move" ? "Move here" : "Copy here"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
