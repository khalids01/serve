import { config } from "@/config";
import type { StorageBackend } from "./backend";
import { LocalStorageBackend } from "./local";
import { S3StorageBackend } from "./s3";

let instance: StorageBackend | null = null;

export function getStorage(deliveryMode?: "proxy" | "direct"): StorageBackend {
  if (deliveryMode)
    return config.storage.provider === "s3"
      ? new S3StorageBackend({ ...config.storage.s3, deliveryMode })
      : new LocalStorageBackend(config.storage.local.uploadDir);
  if (!instance) {
    instance =
      config.storage.provider === "s3"
        ? new S3StorageBackend({ ...config.storage.s3, deliveryMode: "proxy" })
        : new LocalStorageBackend(config.storage.local.uploadDir);
  }
  return instance;
}
