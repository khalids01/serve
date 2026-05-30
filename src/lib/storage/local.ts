import fs from "fs/promises";
import path from "path";
import type { StorageBackend, StorageObjectInfo } from "./backend";
import { resolveBaseUploadDir } from "./paths";

export class LocalStorageBackend implements StorageBackend {
  private baseDir: string;

  constructor(uploadDir?: string) {
    this.baseDir = resolveBaseUploadDir(uploadDir);
  }

  private keyToPath(key: string): string {
    return path.join(this.baseDir, ...key.split("/"));
  }

  async put(
    key: string,
    data: Buffer,
    _opts?: { contentType?: string },
  ): Promise<void> {
    const filePath = this.keyToPath(key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data);
  }

  async get(key: string): Promise<Buffer | null> {
    try {
      return await fs.readFile(this.keyToPath(key));
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as NodeJS.ErrnoException).code === "ENOENT"
      ) {
        return null;
      }
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await fs.unlink(this.keyToPath(key));
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as NodeJS.ErrnoException).code === "ENOENT"
      ) {
        return;
      }
      console.error("Error deleting file:", error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.keyToPath(key));
      return true;
    } catch {
      return false;
    }
  }

  async list(prefix: string): Promise<StorageObjectInfo[]> {
    const dirPath = this.keyToPath(prefix.replace(/\/$/, ""));
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const items: StorageObjectInfo[] = [];
      for (const entry of entries.filter((e) => e.isFile())) {
        const filePath = path.join(dirPath, entry.name);
        try {
          const stat = await fs.stat(filePath);
          items.push({
            key: `${prefix}${entry.name}`,
            sizeBytes: stat.size,
            mtimeMs: stat.mtimeMs,
          });
        } catch {}
      }
      return items;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        ((error as NodeJS.ErrnoException).code === "ENOENT" ||
          (error as NodeJS.ErrnoException).code === "ENOTDIR")
      ) {
        return [];
      }
      throw error;
    }
  }

  async deletePrefix(prefix: string): Promise<void> {
    const dirPath = this.keyToPath(prefix.replace(/\/$/, ""));
    await fs.rm(dirPath, { recursive: true, force: true }).catch(() => {});
  }
}
