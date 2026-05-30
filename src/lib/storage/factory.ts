import type { StorageBackend } from "./backend";
import { LocalStorageBackend } from "./local";
import { S3StorageBackend } from "./s3";
import { config } from "@/config";

let instance: StorageBackend | null = null;

export function getStorage(): StorageBackend {
  if (!instance) {
    instance =
      config.storage.provider === "s3"
        ? new S3StorageBackend()
        : new LocalStorageBackend(config.storage.local.uploadDir);
  }
  return instance;
}
