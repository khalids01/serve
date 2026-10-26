"use client";
import { Download, Loader2, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BrowseEntry } from "@/lib/storage/browse";

export function storageLabel(entry: BrowseEntry) {
  return entry.key.replace(/\/$/, "").split("/").at(-1) ?? entry.key;
}
export function storageSize(bytes?: number) {
  if (bytes === undefined) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const unit = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 4);
  return `${(bytes / 1024 ** unit).toFixed(1)} ${["B", "KB", "MB", "GB", "TB"][unit]}`;
}
export function storageContentURL(id: string, entry: BrowseEntry) {
  return `/api/storage-connections/${encodeURIComponent(id)}/content?${new URLSearchParams({ key: entry.key, ...(entry.trashId ? { trashId: entry.trashId } : {}) })}`;
}
const imagePattern = /\.(png|jpe?g|gif|webp|avif)$/i;
const textPattern = /\.(txt|md|json|csv|log|ya?ml|xml|html|css|[jt]sx?)$/i;
export function StoragePreview({
  id,
  entry,
  onClose,
}: {
  id: string;
  entry: BrowseEntry;
  onClose: () => void;
}) {
  const [preview, setPreview] = useState<{
    url?: string;
    text?: string;
    error?: string;
  }>();
  const url = storageContentURL(id, entry);
  const supported =
    entry.kind === "file" &&
    (imagePattern.test(entry.key) || textPattern.test(entry.key));
  useEffect(() => {
    if (!supported) return;
    const controller = new AbortController();
    let objectURL: string | undefined;
    void fetch(`${url}&preview=1`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error ?? "Unable to preview file.");
        }
        if (imagePattern.test(entry.key)) {
          const blob = await response.blob();
          if (controller.signal.aborted) return;
          objectURL = URL.createObjectURL(blob);
          setPreview({ url: objectURL });
        } else {
          const text = await response.text();
          if (!controller.signal.aborted) setPreview({ text });
        }
      })
      .catch((cause) => {
        if (!controller.signal.aborted) setPreview({ error: cause.message });
      });
    return () => {
      controller.abort();
      if (objectURL) URL.revokeObjectURL(objectURL);
    };
  }, [url, entry.key, supported]);
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="break-all pr-6">
            {storageLabel(entry)}
          </DialogTitle>
          <DialogDescription>
            {entry.kind === "folder" ? "Folder" : storageSize(entry.sizeBytes)}
            {entry.modifiedAt
              ? ` · ${new Date(entry.modifiedAt).toLocaleString()}`
              : ""}
          </DialogDescription>
        </DialogHeader>
        {entry.protected && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <LockKeyhole className="size-3" />
            Managed by Serve
          </p>
        )}
        {supported ? (
          preview?.error ? (
            <p
              role="alert"
              className="rounded-lg bg-muted p-6 text-sm text-muted-foreground"
            >
              {preview.error}
            </p>
          ) : preview?.url ? (
            // biome-ignore lint/performance/noImgElement: Private object URL cannot use Next Image optimization.
            <img
              src={preview.url}
              alt={storageLabel(entry)}
              className="max-h-[55vh] w-full rounded-lg bg-muted/40 object-contain"
              onError={() =>
                setPreview({
                  error: "This image cannot be displayed. Download it instead.",
                })
              }
            />
          ) : preview?.text !== undefined ? (
            <pre className="max-h-[55vh] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-muted p-4 text-xs">
              {preview.text}
            </pre>
          ) : (
            <div aria-live="polite" className="flex justify-center p-12">
              <Loader2 className="size-6 animate-spin" />
              <span className="sr-only">Loading preview</span>
            </div>
          )
        ) : (
          entry.kind === "file" && (
            <p className="rounded-lg bg-muted p-8 text-center text-sm text-muted-foreground">
              Download this file to open it.
            </p>
          )
        )}
        <dl className="grid gap-2 rounded-lg border p-4 text-sm">
          <dt className="text-xs text-muted-foreground">Location</dt>
          <dd className="break-all font-mono text-xs">/{entry.key}</dd>
          {entry.deletedAt && (
            <>
              <dt className="mt-2 text-xs text-muted-foreground">
                Moved to Trash
              </dt>
              <dd>{new Date(entry.deletedAt).toLocaleString()}</dd>
            </>
          )}
        </dl>
        {entry.kind === "file" && (
          <Button asChild>
            <a href={url}>
              <Download className="mr-2 size-4" />
              Download file
            </a>
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
