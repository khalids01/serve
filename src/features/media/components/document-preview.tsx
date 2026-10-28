"use client";
import { useEffect, useState } from "react";

export function DocumentPreview({
  url,
  title,
  kind,
}: {
  url: string;
  title: string;
  kind: "pdf" | "text";
}) {
  const [text, setText] = useState<string>();
  const [error, setError] = useState("");
  useEffect(() => {
    if (kind !== "text") return;
    const controller = new AbortController();
    setText(undefined);
    setError("");
    void (async () => {
      const response = await fetch(url, {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok || !response.body)
        throw new Error("Unable to load this document.");
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let size = 0;
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > 1024 * 1024)
            throw new Error(
              "This document is too large to preview. Download it instead.",
            );
          chunks.push(value);
        }
      } finally {
        await reader.cancel().catch(() => {});
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      }
      if (!controller.signal.aborted) setText(new TextDecoder().decode(bytes));
    })().catch((cause) => {
      if (!controller.signal.aborted) setError(cause.message);
    });
    return () => controller.abort();
  }, [url, kind]);
  if (kind === "pdf")
    return (
      <iframe
        key={url}
        src={url}
        title={`PDF preview: ${title}`}
        className="h-[55vh] w-full rounded-lg border"
      />
    );
  if (error)
    return (
      <p role="alert" className="text-sm text-muted-foreground">
        {error}
      </p>
    );
  return text === undefined ? (
    <p
      aria-live="polite"
      className="p-8 text-center text-sm text-muted-foreground"
    >
      Loading document…
    </p>
  ) : (
    <pre className="max-h-[55vh] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-muted p-4 text-xs">
      {text}
    </pre>
  );
}
