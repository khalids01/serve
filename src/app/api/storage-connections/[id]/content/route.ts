import sharp from "sharp";
import { z } from "zod";
import { maxFileSizeBytes } from "@/config";
import { requireSession, sessionApi } from "@/lib/session-api";
import { browsePath } from "@/lib/storage/browse";
import {
  resolveBrowseLocation,
  StorageLocationError,
} from "@/lib/storage/locations";
import {
  checkStorageOrigin,
  readTrash,
  storageUpload,
} from "@/lib/storage/manager";

const imageTypes = new Map([
  ["png", "image/png"],
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["gif", "image/gif"],
  ["webp", "image/webp"],
  ["avif", "image/avif"],
]);
const textTypes = new Set([
  "txt",
  "md",
  "json",
  "csv",
  "log",
  "yaml",
  "yml",
  "xml",
  "html",
  "css",
  "js",
  "ts",
  "tsx",
  "jsx",
]);

export const runtime = "nodejs";
export function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    const { id } = await context.params;
    const { key: requestedKey } = z
      .object({
        key: browsePath.refine(
          (key) => Boolean(key) && !key.endsWith("/") && !key.includes("//"),
          "Choose a file.",
        ),
      })
      .parse(Object.fromEntries(new URL(request.url).searchParams));
    const { storage } = await resolveBrowseLocation(user, id);
    const trashId = new URL(request.url).searchParams.get("trashId");
    let key = requestedKey;
    if (trashId) {
      const record = await readTrash(storage, user.id, trashId);
      if (record.kind !== "file")
        throw new StorageLocationError("Choose a file.");
      key = `.serve-trash/${user.id}/${trashId}/data`;
    } else if (key.split("/").includes(".serve-trash"))
      throw new StorageLocationError(
        "Use the Trash view to access deleted items.",
        403,
      );
    const thumbnail =
      new URL(request.url).searchParams.get("thumbnail") === "1";
    const preview =
      thumbnail || new URL(request.url).searchParams.get("preview") === "1";
    const extension = requestedKey.split(".").at(-1)?.toLowerCase() ?? "";
    const imageType = imageTypes.get(extension);
    const previewType =
      imageType ??
      (textTypes.has(extension) ? "text/plain; charset=utf-8" : undefined);
    if (thumbnail && !imageType)
      throw new StorageLocationError(
        "Thumbnails are available for supported images only.",
        415,
      );
    if (preview && !previewType)
      throw new StorageLocationError(
        "Preview is unavailable for this file type.",
        415,
      );
    const opened = await storage.open(key);
    if (!opened) throw new StorageLocationError("File not found.", 404);
    if (preview && opened.contentLength > (imageType ? 10 : 1) * 1024 * 1024) {
      await opened.body.cancel();
      throw new StorageLocationError(
        "This file is too large to preview. Download it instead.",
        413,
      );
    }
    if (thumbnail) {
      try {
        // Bound source bytes independently of metadata before decoding an untrusted image.
        const reader = opened.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            received += value.byteLength;
            if (received > 10 * 1024 * 1024)
              throw new StorageLocationError(
                "This image is too large to thumbnail.",
                413,
              );
            chunks.push(value);
          }
        } finally {
          await reader.cancel().catch(() => {});
        }
        const image = sharp(Buffer.concat(chunks), {
          limitInputPixels: 25_000_000,
        });
        const metadata = await image.metadata();
        if (
          !["png", "jpeg", "gif", "webp", "heif", "avif"].includes(
            metadata.format ?? "",
          )
        )
          throw new StorageLocationError(
            "This image format cannot be thumbnailed.",
            415,
          );
        const output = await image
          .rotate()
          .resize(320, 240, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 75 })
          .timeout({ seconds: 5 })
          .toBuffer();
        return new Response(new Uint8Array(output), {
          headers: {
            "Content-Type": "image/webp",
            "Content-Length": String(output.length),
            "Cache-Control": "private, no-store",
            "X-Content-Type-Options": "nosniff",
            "Content-Security-Policy": "default-src 'none'; sandbox",
          },
        });
      } catch (cause) {
        if (cause instanceof StorageLocationError) throw cause;
        throw new StorageLocationError(
          "This image cannot be previewed. Download it instead.",
          415,
        );
      }
    }
    const name = requestedKey.split("/").at(-1) ?? "download";
    const encodedName = encodeURIComponent(name).replace(
      /[!'()*]/g,
      (char) => `%${char.charCodeAt(0).toString(16)}`,
    );
    return new Response(opened.body, {
      headers: {
        "Content-Type": preview
          ? (previewType ?? "application/octet-stream")
          : "application/octet-stream",
        "Content-Length": String(opened.contentLength),
        "Content-Disposition": `${preview ? "inline" : "attachment"}; filename="${name.replace(/[^a-zA-Z0-9._-]/g, "_")}"; filename*=UTF-8''${encodedName}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  });
}

export function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    checkStorageOrigin(request);
    const { id } = await context.params;
    const key = browsePath
      .refine((value) => Boolean(value) && !value.endsWith("/"))
      .parse(new URL(request.url).searchParams.get("key"));
    const size = Number(request.headers.get("x-file-size"));
    if (
      request.headers.get("x-file-size") === null ||
      !Number.isSafeInteger(size) ||
      size < 0 ||
      size > maxFileSizeBytes()
    )
      throw new StorageLocationError(
        "File exceeds the upload limit or has an invalid size.",
        413,
      );
    const body =
      request.body ??
      (size === 0
        ? new ReadableStream<Uint8Array>({
            start(controller) {
              controller.close();
            },
          })
        : null);
    if (!body) throw new StorageLocationError("Missing file body.");
    let received = 0;
    const bounded = body.pipeThrough(
      new TransformStream<Uint8Array, Uint8Array>({
        transform(chunk, controller) {
          received += chunk.byteLength;
          if (received > size)
            throw new StorageLocationError(
              "File size does not match the request.",
              413,
            );
          controller.enqueue(chunk);
        },
        flush() {
          if (received !== size)
            throw new StorageLocationError("The upload was incomplete.");
        },
      }),
    );
    try {
      await storageUpload(
        user,
        id,
        key,
        bounded,
        size,
        request.headers.get("content-type") ?? undefined,
      );
    } finally {
      await bounded.cancel().catch(() => {});
    }
    return Response.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  });
}
