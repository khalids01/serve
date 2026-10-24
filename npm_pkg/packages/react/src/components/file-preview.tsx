"use client";
import { useEffect, useState } from "react";
import type { FileAsset } from "../contracts";
import { AdvancedImage } from "./advanced-image";

export type FilePreviewProps = {
  asset: FileAsset;
  className?: string;
  textPreviewBytes?: number;
  captions?: { src: string; srcLang: string; label: string }[];
};

export function FilePreview({
  asset,
  className,
  textPreviewBytes = 32_000,
  captions = [],
}: FilePreviewProps) {
  const [text, setText] = useState<string | null>(null);
  const isText =
    asset.contentType.startsWith("text/") ||
    ["application/json", "application/xml"].includes(asset.contentType);
  useEffect(() => {
    if (!isText) return;
    setText(null);
    const controller = new AbortController();
    fetch(asset.urls.content, {
      signal: controller.signal,
      headers: { Range: `bytes=0-${Math.max(0, textPreviewBytes - 1)}` },
    })
      .then(async (response) => {
        if (!response.ok || !response.body)
          throw new Error("Preview unavailable");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = "";
        let bytes = 0;
        try {
          while (bytes < textPreviewBytes) {
            const chunk = await reader.read();
            if (chunk.done) break;
            const part = chunk.value.subarray(0, textPreviewBytes - bytes);
            bytes += part.byteLength;
            result += decoder.decode(part, { stream: true });
          }
          result += decoder.decode();
        } finally {
          await reader.cancel();
        }
        if (!controller.signal.aborted) setText(result);
      })
      .catch(() => {
        if (!controller.signal.aborted) setText("Preview unavailable.");
      });
    return () => controller.abort();
  }, [asset.urls.content, isText, textPreviewBytes]);
  if (asset.kind === "image")
    return (
      <div className={className}>
        <AdvancedImage
          asset={asset}
          alt={asset.originalName}
          width={asset.width ?? undefined}
          height={asset.height ?? undefined}
          fit="contain"
        />
      </div>
    );
  if (asset.kind === "video")
    return (
      // biome-ignore lint/a11y/useMediaCaption: Optional caption tracks are supplied through the captions prop.
      <video
        className={className}
        controls
        preload="metadata"
        src={asset.urls.content}
        title={asset.originalName}
      >
        {captions.map((track) => (
          <track
            key={track.src}
            kind="captions"
            src={track.src}
            srcLang={track.srcLang}
            label={track.label}
          />
        ))}
      </video>
    );
  if (asset.kind === "audio")
    return (
      // biome-ignore lint/a11y/useMediaCaption: Optional caption tracks are supplied through the captions prop.
      <audio
        className={className}
        controls
        preload="metadata"
        src={asset.urls.content}
        title={asset.originalName}
      >
        {captions.map((track) => (
          <track
            key={track.src}
            kind="captions"
            src={track.src}
            srcLang={track.srcLang}
            label={track.label}
          />
        ))}
      </audio>
    );
  if (asset.contentType === "application/pdf")
    return (
      <object
        className={className}
        data={asset.urls.content}
        type="application/pdf"
        aria-label={asset.originalName}
      >
        <a href={asset.urls.content} download={asset.originalName}>
          Download PDF
        </a>
      </object>
    );
  if (isText)
    return <pre className={className}>{text ?? "Loading preview…"}</pre>;
  return (
    <a
      className={className}
      href={asset.urls.content}
      download={asset.originalName}
    >
      Download {asset.originalName}
    </a>
  );
}
