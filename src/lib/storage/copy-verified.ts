import { createHash } from "node:crypto";
import type { StorageBackend } from "./backend";
import { StorageLocationError } from "./locations";

export async function checksum(storage: StorageBackend, key: string) {
  const opened = await storage.open(key);
  if (!opened) throw new StorageLocationError("A source file is missing.", 409);
  const reader = opened.body.getReader(),
    hash = createHash("sha256");
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      hash.update(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  if (size !== opened.contentLength)
    throw new StorageLocationError(
      "A file changed while being read. Retry the transfer.",
      409,
    );
  return { hash: hash.digest("hex"), size };
}

/** Exclusive create, bounded streaming, then an independent read-back hash. */
export async function copyVerified(
  source: StorageBackend,
  target: StorageBackend,
  key: string,
  destinationKey: string,
  contentType?: string,
) {
  const existing = await target.stat(destinationKey);
  if (existing) {
    const [a, b] = await Promise.all([
      checksum(source, key),
      checksum(target, destinationKey),
    ]);
    if (a.hash !== b.hash || a.size !== b.size)
      throw new StorageLocationError(
        "A different file exists at the destination. Nothing was overwritten.",
        409,
      );
    return a;
  }
  const opened = await source.open(key);
  if (!opened) throw new StorageLocationError("A source file is missing.", 409);
  if (opened.contentLength > (target.maxWriteBytes ?? Infinity)) {
    await opened.body.cancel();
    throw new StorageLocationError(
      "A file exceeds the destination's single-file limit.",
      413,
    );
  }
  const hash = createHash("sha256");
  let size = 0;
  const body = opened.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        size += chunk.byteLength;
        if (size > opened.contentLength)
          throw new StorageLocationError(
            "Source size changed during the copy.",
            409,
          );
        hash.update(chunk);
        controller.enqueue(chunk);
      },
      flush() {
        if (size !== opened.contentLength)
          throw new StorageLocationError(
            "Source size changed during the copy.",
            409,
          );
      },
    }),
  );
  try {
    await target.createFile(
      destinationKey,
      body,
      opened.contentLength,
      contentType ?? opened.contentType,
    );
  } finally {
    await body.cancel().catch(() => {});
  }
  const digest = hash.digest("hex"),
    verified = await checksum(target, destinationKey);
  if (digest !== verified.hash || size !== verified.size)
    throw new StorageLocationError(
      "Copy verification failed. The source has been retained.",
      502,
    );
  return { hash: digest, size };
}
