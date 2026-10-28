"use client";
import { Download, FileImage, Loader2, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentPreview } from "@/features/media/components/document-preview";
import { filePreview } from "@/lib/file-preview";
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

export function StorageThumbnail({
  id,
  entry,
  large,
  fallback,
}: {
  id: string;
  entry: BrowseEntry;
  large: boolean;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed || entry.kind !== "file" || !imagePattern.test(entry.key))
    return fallback;
  return (
    // biome-ignore lint/performance/noImgElement: Authenticated, lazy, server-sized thumbnail.
    <img
      src={`${storageContentURL(id, entry)}&thumbnail=1`}
      alt=""
      draggable={false}
      loading="lazy"
      decoding="async"
      width={large ? 160 : 36}
      height={large ? 112 : 36}
      className={
        large
          ? "h-28 w-full rounded-md object-contain"
          : "size-9 shrink-0 rounded object-cover"
      }
      onError={() => setFailed(true)}
    />
  );
}
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
  const [activeKey, setActiveKey] = useState(entry.key);
  const selected = entry.variants?.find((variant) => variant.key === activeKey);
  const activeEntry: BrowseEntry = selected
    ? { ...entry, ...selected, variants: undefined }
    : entry;
  const versions = [{ ...entry, label: "Original" }, ...(entry.variants ?? [])];
  const url = storageContentURL(id, activeEntry);
  const type = filePreview(activeEntry.key);
  const streamed =
    type?.kind === "video" || type?.kind === "audio" || type?.kind === "pdf";
  const supported = entry.kind === "file" && Boolean(type);
  useEffect(() => {
    setPreview(undefined);
    if (!supported || streamed) return;
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
        if (filePreview(activeEntry.key)?.kind === "image") {
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
  }, [url, activeEntry.key, supported, streamed]);
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
            {entry.kind === "folder"
              ? "Folder"
              : `${selected?.label ?? (versions.length > 1 ? "Original" : "File")} · ${storageSize(activeEntry.sizeBytes)}`}
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
        {streamed ? (
          <div className="space-y-3">
            {type?.kind === "video" ? (
              // biome-ignore lint/a11y/useMediaCaption: User-provided videos do not have captions available.
              <video
                key={url}
                src={`${url}&preview=1`}
                controls
                playsInline
                preload="metadata"
                className="max-h-[55vh] w-full rounded-lg bg-black"
                onError={() =>
                  setPreview({
                    error:
                      "Your browser cannot play this video format or codec. Download the file to open it in a video player.",
                  })
                }
              />
            ) : type?.kind === "audio" ? (
              // biome-ignore lint/a11y/useMediaCaption: User-provided audio does not have transcripts available.
              <audio
                key={url}
                src={`${url}&preview=1`}
                controls
                preload="metadata"
                className="w-full"
                onError={() =>
                  setPreview({
                    error:
                      "Your browser cannot play this audio format. Download it to listen in another player.",
                  })
                }
              />
            ) : (
              <DocumentPreview
                kind="pdf"
                url={`${url}&preview=1`}
                title={storageLabel(activeEntry)}
              />
            )}
            {preview?.error && (
              <p role="alert" className="text-sm text-muted-foreground">
                {preview.error}
              </p>
            )}
            {type?.kind === "pdf" && (
              <p className="text-xs text-muted-foreground">
                If your browser cannot display the PDF here, use the download
                button below.
              </p>
            )}
          </div>
        ) : supported ? (
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
              alt={storageLabel(activeEntry)}
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
              This file type does not have a browser preview. Download it to
              open in its application.
            </p>
          )
        )}
        {versions.length > 1 && (
          <section aria-label="Image variants" className="space-y-3">
            <h3 className="text-sm font-medium">
              Image variants{" "}
              <span className="text-muted-foreground">({versions.length})</span>
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {versions.map((version) => (
                <div
                  key={version.key}
                  className={`flex min-w-0 items-center gap-2 rounded-lg border p-2 ${activeKey === version.key ? "border-blue-500 bg-blue-500/5" : ""}`}
                >
                  <button
                    type="button"
                    aria-pressed={activeKey === version.key}
                    onClick={() => setActiveKey(version.key)}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded p-1 text-left focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <StorageThumbnail
                      id={id}
                      entry={{ ...version, kind: "file" }}
                      large={false}
                      fallback={
                        <FileImage className="size-9 shrink-0 text-muted-foreground" />
                      }
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {version.label}
                      </span>
                      <span
                        className="block truncate text-xs text-muted-foreground"
                        title={version.key}
                      >
                        {version.key.split("/").at(-1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {storageSize(version.sizeBytes)}
                      </span>
                    </span>
                  </button>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={storageContentURL(id, { ...version, kind: "file" })}
                      aria-label={`Download ${version.label}`}
                    >
                      <Download className="size-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}
        <dl className="grid gap-2 rounded-lg border p-4 text-sm">
          <dt className="text-xs text-muted-foreground">Location</dt>
          <dd className="break-all font-mono text-xs">/{activeEntry.key}</dd>
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
              {versions.length > 1
                ? "Download selected variant"
                : "Download file"}
            </a>
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
