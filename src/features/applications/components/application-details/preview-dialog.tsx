import { Copy, Crop, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toFileContentUrl } from "@/features/files/lib/file-kind";
import { VideoPlayer } from "@/features/media/components/video-player";
import {
  isPlaceholderLabel,
  toImageServeUrl,
  variantToServeUrl,
} from "@/lib/image-urls";
import { PdfViewer } from "../pdf-viewer";
import type { ImageFileDTO } from "./types";

const isPdf = (contentType: string) => contentType === "application/pdf";
const isSvg = (contentType: string) => contentType === "image/svg+xml";

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

interface Props {
  previewImage: ImageFileDTO | null;
  onClose: () => void;
  onCrop: (img: ImageFileDTO) => void;
  copyToClipboard: (text: string) => void;
}

export function ImagePreviewDialog({
  previewImage,
  onClose,
  onCrop,
  copyToClipboard,
}: Props) {
  const [activeVariant, setActiveVariant] = useState<string | null>(null);

  if (!previewImage) return null;

  const activeItem = activeVariant
    ? (previewImage.variants.find((variant) => variant.id === activeVariant) ??
      previewImage)
    : previewImage;
  const isImage = previewImage.contentType.startsWith("image/");
  const isVideo = previewImage.contentType.startsWith("video/");
  const isAudio = previewImage.contentType.startsWith("audio/");
  const isText =
    previewImage.contentType.startsWith("text/") ||
    ["application/json", "application/xml"].includes(previewImage.contentType);
  const rawContentUrl = toFileContentUrl(previewImage.id);

  const previewServeUrl = isImage
    ? activeVariant && "label" in activeItem
      ? variantToServeUrl(activeItem, previewImage.filename)
      : toImageServeUrl(previewImage.filename, {
          width: isSvg(previewImage.contentType) ? undefined : 1280,
        })
    : rawContentUrl;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const previewAbsoluteUrl = origin
    ? new URL(previewServeUrl, origin).toString()
    : previewServeUrl;
  const embedPath = `/embed/${previewImage.id}${previewImage.applicationId ? `?app=${encodeURIComponent(previewImage.applicationId)}` : ""}`;
  const embedUrl = origin ? new URL(embedPath, origin).toString() : embedPath;
  const embedCode = `<iframe src="${embedUrl}" title="${escapeHtmlAttribute(previewImage.originalName)}" width="1280" height="720" style="width:100%;aspect-ratio:16/9;border:0" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          setActiveVariant(null);
          onClose();
        }
      }}
    >
      <DialogContent className="flex h-[90vh] !w-full !max-w-[1000px] flex-col">
        <DialogHeader className="gap-3 pr-8 sm:flex-row sm:items-center sm:justify-between">
          <DialogTitle className="truncate">
            {activeVariant && "label" in activeItem
              ? `${previewImage.originalName} (${activeItem.label})`
              : previewImage.originalName}
          </DialogTitle>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {!activeVariant && isImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCrop(previewImage)}
              >
                <Crop className="h-4 w-4" />
                Crop
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(previewAbsoluteUrl)}
            >
              <Copy className="h-4 w-4" />
              Copy link
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href={previewAbsoluteUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-4 flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-md bg-black/5 p-4 dark:bg-white/5">
            {isVideo ? (
              <div className="w-full">
                <VideoPlayer
                  src={rawContentUrl}
                  title={previewImage.originalName}
                  contentType={previewImage.contentType}
                />
              </div>
            ) : isAudio ? (
              <div className="w-full max-w-2xl rounded-xl border bg-background p-6 shadow-sm">
                <p className="mb-4 truncate text-sm font-medium">
                  {previewImage.originalName}
                </p>
                {/* biome-ignore lint/a11y/useMediaCaption: Uploaded audio does not include a separate caption track. */}
                <audio
                  className="w-full"
                  src={rawContentUrl}
                  controls
                  preload="metadata"
                />
              </div>
            ) : isPdf(previewImage.contentType) && !activeVariant ? (
              <div className="h-full w-full">
                <PdfViewer url={rawContentUrl} />
              </div>
            ) : isImage ? (
              <>
                {/* biome-ignore lint/performance/noImgElement: This uses the app's optimized image endpoint and must preserve arbitrary dimensions. */}
                <img
                  src={previewServeUrl}
                  alt={previewImage.originalName}
                  className="max-h-full max-w-full object-contain shadow-sm"
                />
              </>
            ) : isText ? (
              <iframe
                src={rawContentUrl}
                title={`Preview of ${previewImage.originalName}`}
                sandbox=""
                className="h-full min-h-80 w-full rounded-md border bg-white"
              />
            ) : (
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">
                  Preview is not available for this file type.
                </p>
                <Button asChild>
                  <a href={rawContentUrl} download>
                    Download file
                  </a>
                </Button>
              </div>
            )}
          </div>

          {isVideo && (
            <div className="mb-3 rounded-lg border bg-muted/30 p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Embed code</p>
                <Button size="sm" onClick={() => copyToClipboard(embedCode)}>
                  <Copy className="h-4 w-4" />
                  Copy embed
                </Button>
              </div>
              <Input
                readOnly
                value={embedCode}
                onFocus={(event) => event.currentTarget.select()}
                aria-label="Video embed code"
                className="font-mono text-xs"
              />
            </div>
          )}

          {isImage && (
            <div className="h-auto min-h-[120px] overflow-x-auto py-2">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Versions
              </p>
              <div className="flex gap-2 pb-2">
                <button
                  type="button"
                  className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${!activeVariant ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}
                  onClick={() => setActiveVariant(null)}
                >
                  {/* biome-ignore lint/performance/noImgElement: This thumbnail is already resized by the app's image endpoint. */}
                  <img
                    src={toImageServeUrl(previewImage.filename, { width: 160 })}
                    className="h-full w-full object-cover"
                    alt="Original"
                  />
                  <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-center text-[10px] text-white">
                    Original
                  </span>
                </button>

                {previewImage.variants.map((variant) => (
                  <button
                    type="button"
                    key={variant.id}
                    className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${activeVariant === variant.id ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}
                    onClick={() => setActiveVariant(variant.id)}
                    title={`View ${variant.label}`}
                  >
                    {/* biome-ignore lint/performance/noImgElement: This thumbnail is already resized by the app's image endpoint. */}
                    <img
                      src={
                        isPlaceholderLabel(variant.label)
                          ? variantToServeUrl(variant, previewImage.filename)
                          : toImageServeUrl(variant.filename, { width: 160 })
                      }
                      className="h-full w-full object-cover"
                      alt={variant.label}
                    />
                    <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-center text-[10px] text-white">
                      {variant.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
