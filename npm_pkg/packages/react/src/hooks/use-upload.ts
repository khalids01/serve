"use client";
import {
  type FileAsset,
  joinUrl,
  UploadError,
  type UploadTransport,
  uploadWithProgress,
} from "@skycanvasstudio/serve-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFileServer } from "../context/file-server-provider";
export type UploadItem = {
  id: string;
  file: File;
  status:
    | "queued"
    | "uploading"
    | "processing"
    | "success"
    | "error"
    | "cancelled";
  progress: number;
  asset?: FileAsset;
  error?: string;
};
export type UploadOptions = {
  tags?: string[];
  parallel?: number;
  onUploadComplete?: (asset: FileAsset) => void;
  onBatchComplete?: (items: UploadItem[]) => void;
};
export type { UploadTransport } from "@skycanvasstudio/serve-client";
export { uploadWithProgress } from "@skycanvasstudio/serve-client";
export function useUpload(
  options: UploadOptions = {},
  transport: UploadTransport = uploadWithProgress,
) {
  const { client, getToken } = useFileServer();
  const [items, setItems] = useState<UploadItem[]>([]);
  const records = useRef(new Map<string, UploadItem>());
  const controllers = useRef(new Map<string, AbortController>());
  const batches = useRef<
    Array<{ ids: string[]; done: (items: UploadItem[]) => void }>
  >([]);
  const mounted = useRef(true);
  const currentOptions = useRef(options);
  currentOptions.current = options;
  const pumpRef = useRef<() => void>(() => {});
  const publish = useCallback(() => {
    if (mounted.current)
      setItems([...records.current.values()].map((item) => ({ ...item })));
  }, []);
  const settleBatches = useCallback(() => {
    const pending = batches.current;
    batches.current = [];
    for (const batch of pending) {
      const values = batch.ids
        .map((id) => records.current.get(id))
        .filter((item): item is UploadItem => !!item);
      if (
        values.some((item) =>
          ["queued", "uploading", "processing"].includes(item.status),
        )
      ) {
        batches.current.push(batch);
        continue;
      }
      batch.done(values.map((item) => ({ ...item })));
    }
  }, []);
  const pump = useCallback(() => {
    if (!mounted.current) return;
    const requested = currentOptions.current.parallel ?? 3;
    const maximum = Number.isFinite(requested)
      ? Math.max(1, Math.min(6, Math.floor(requested)))
      : 3;
    for (const item of records.current.values()) {
      if (controllers.current.size >= maximum) break;
      if (item.status !== "queued") continue;
      const controller = new AbortController();
      controllers.current.set(item.id, controller);
      item.status = "uploading";
      item.error = undefined;
      const run = async () => {
        try {
          let asset: FileAsset | undefined;
          for (let attempt = 0; attempt < 2; attempt++) {
            const token = await getToken(attempt === 1);
            if (controller.signal.aborted)
              throw new DOMException("Upload cancelled.", "AbortError");
            try {
              asset = await transport(
                joinUrl(client.baseUrl, "/api/v1/files"),
                item.file,
                currentOptions.current.tags,
                token,
                controller.signal,
                (progress) => {
                  item.progress = progress;
                  item.status = progress >= 100 ? "processing" : "uploading";
                  publish();
                },
              );
              break;
            } catch (cause) {
              if (
                !(
                  cause instanceof UploadError &&
                  cause.code === "TOKEN_EXPIRED" &&
                  attempt === 0
                )
              )
                throw cause;
            }
          }
          if (!asset) throw new Error("Upload failed.");
          item.asset = asset;
          item.status = "success";
          item.progress = 100;
          if (mounted.current) currentOptions.current.onUploadComplete?.(asset);
        } catch (cause) {
          item.status = controller.signal.aborted ? "cancelled" : "error";
          item.error =
            item.status === "cancelled"
              ? undefined
              : cause instanceof Error
                ? cause.message
                : "Upload failed.";
        } finally {
          controllers.current.delete(item.id);
          publish();
          settleBatches();
          pumpRef.current();
        }
      };
      void run();
    }
    publish();
  }, [client.baseUrl, getToken, transport, publish, settleBatches]);
  pumpRef.current = pump;
  useEffect(() => {
    mounted.current = true;
    pump();
    return () => {
      mounted.current = false;
      for (const item of records.current.values())
        if (item.status === "queued") item.status = "cancelled";
      for (const controller of controllers.current.values()) controller.abort();
    };
  }, [pump]);
  const upload = useCallback(
    (files: File[]) =>
      new Promise<UploadItem[]>((resolve) => {
        const ids = files.map((file) => {
          const id = crypto.randomUUID();
          records.current.set(id, { id, file, status: "queued", progress: 0 });
          return id;
        });
        batches.current.push({
          ids,
          done: (values) => {
            resolve(values);
            if (mounted.current)
              currentOptions.current.onBatchComplete?.(values);
          },
        });
        settleBatches();
        pumpRef.current();
      }),
    [settleBatches],
  );
  const cancel = useCallback(
    (id: string) => {
      const item = records.current.get(id);
      if (item?.status === "queued") {
        item.status = "cancelled";
        publish();
        settleBatches();
      }
      controllers.current.get(id)?.abort();
    },
    [publish, settleBatches],
  );
  const retry = useCallback((id: string) => {
    const item = records.current.get(id);
    if (item && ["error", "cancelled"].includes(item.status)) {
      item.status = "queued";
      item.progress = 0;
      item.error = undefined;
      pumpRef.current();
    }
  }, []);
  return {
    items,
    upload,
    cancel,
    retry,
    uploading: items.some((item) =>
      ["queued", "uploading", "processing"].includes(item.status),
    ),
  };
}
