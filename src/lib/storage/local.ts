import { constants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { z } from "zod";
import type {
  StorageBackend,
  StorageByteRange,
  StorageObjectInfo,
  StorageReadStream,
} from "./backend";
import {
  BROWSE_PAGE_SIZE,
  type BrowseEntry,
  type BrowsePage,
  browsePath,
} from "./browse";
import { resolveBaseUploadDir } from "./paths";

export class LocalStorageBackend implements StorageBackend {
  private baseDir: string;

  constructor(uploadDir?: string) {
    this.baseDir = resolveBaseUploadDir(uploadDir);
  }

  private keyToPath(key: string): string {
    return path.join(this.baseDir, ...key.split("/"));
  }

  // Reject symlinks in every path component, including links to other tenants.
  private async safePath(key: string, directory = false): Promise<string> {
    browsePath.parse(key);
    const root = await fs.realpath(this.baseDir);
    const target = path.resolve(root, key);
    const relative = path.relative(root, target);
    if (
      relative === ".." ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative)
    )
      throw new Error("Storage path escapes the upload directory.");
    const check = directory ? target : path.dirname(target);
    if ((await fs.realpath(check)) !== check)
      throw new Error("Symbolic links cannot be browsed.");
    return target;
  }

  private async ensureParent(key: string) {
    browsePath.parse(key);
    await fs.mkdir(this.baseDir, { recursive: true });
    let directory = await fs.realpath(this.baseDir);
    for (const segment of key.split("/").slice(0, -1)) {
      if (!segment) continue;
      directory = path.join(directory, segment);
      try {
        await fs.mkdir(directory);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      }
      if (
        (await fs.realpath(directory)) !== directory ||
        !(await fs.lstat(directory)).isDirectory()
      )
        throw new Error("Symbolic links cannot be modified.");
    }
  }

  async createDirectory(key: string) {
    const clean = key.replace(/\/$/, "");
    await this.ensureParent(clean);
    await fs.mkdir(await this.safePath(clean));
  }

  async createFile(
    key: string,
    body: ReadableStream<Uint8Array>,
    _size: number,
    _contentType?: string,
  ) {
    await this.ensureParent(key);
    const target = await this.safePath(key);
    const handle = await fs.open(
      target,
      constants.O_WRONLY |
        constants.O_CREAT |
        constants.O_EXCL |
        constants.O_NOFOLLOW,
      0o600,
    );
    try {
      await pipeline(
        Readable.fromWeb(
          body as unknown as Parameters<typeof Readable.fromWeb>[0],
        ),
        handle.createWriteStream(),
      );
    } catch (error) {
      await handle.close().catch(() => {});
      await fs.unlink(target).catch(() => {});
      throw error;
    }
  }

  async copyFile(source: string, target: string) {
    const opened = await this.open(source);
    if (!opened) throw new Error("Source file not found.");
    try {
      await this.createFile(target, opened.body, opened.contentLength);
    } catch (error) {
      await opened.body.cancel().catch(() => {});
      throw error;
    }
  }

  async removeDirectory(key: string) {
    await fs.rmdir(await this.safePath(key, true));
  }

  async stat(key: string): Promise<StorageObjectInfo | null> {
    try {
      const file = await fs.lstat(await this.safePath(key));
      if (file.isSymbolicLink() || (!file.isFile() && !file.isDirectory()))
        throw new Error("Unsupported file type.");
      return {
        key,
        sizeBytes: file.isFile() ? file.size : 0,
        mtimeMs: file.mtimeMs,
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  async browse(prefix: string, cursor?: string): Promise<BrowsePage> {
    const offset =
      cursor === undefined
        ? 0
        : Number(
            z
              .string()
              .regex(/^(0|[1-9][0-9]{0,7})$/)
              .parse(cursor),
          );
    try {
      const directory = await fs.opendir(await this.safePath(prefix, true));
      const entries: BrowseEntry[] = [];
      let index = 0;
      let nextCursor: string | undefined;
      let hasUnsupportedEntries = false;
      for await (const entry of directory) {
        const position = index++;
        if (position < offset) continue;
        if (
          entry.isSymbolicLink() ||
          (!entry.isFile() && !entry.isDirectory())
        ) {
          hasUnsupportedEntries = true;
          continue;
        }
        if (entries.length === BROWSE_PAGE_SIZE) {
          nextCursor = String(position);
          break;
        }
        const key = `${prefix}${entry.name}`;
        if (entry.isDirectory())
          entries.push({ key: `${key}/`, kind: "folder" });
        else {
          try {
            const stat = await fs.lstat(this.keyToPath(key));
            if (stat.isFile())
              entries.push({
                key,
                kind: "file",
                sizeBytes: stat.size,
                modifiedAt: stat.mtimeMs,
              });
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
          }
        }
      }
      return {
        entries,
        nextCursor,
        ...(hasUnsupportedEntries ? { hasUnsupportedEntries: true } : {}),
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT")
        return { entries: [] };
      throw error;
    }
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

  async open(
    key: string,
    range?: StorageByteRange,
  ): Promise<StorageReadStream | null> {
    try {
      const filePath = await this.safePath(key);
      const handle = await fs.open(
        filePath,
        constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK,
      );
      try {
        const stat = await handle.stat();
        if (!stat.isFile()) {
          throw new Error("Only regular files can be downloaded.");
        }
        const stream = handle.createReadStream(range);
        const contentLength = range ? range.end - range.start + 1 : stat.size;

        return {
          body: Readable.toWeb(stream) as ReadableStream<Uint8Array>,
          contentLength,
          contentRange: range
            ? `bytes ${range.start}-${range.end}/${stat.size}`
            : undefined,
        };
      } catch (error) {
        await handle.close();
        throw error;
      }
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
      await fs.unlink(await this.safePath(key));
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as NodeJS.ErrnoException).code === "ENOENT"
      ) {
        return;
      }
      throw error;
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
    await fs.rm(dirPath, { recursive: true, force: true });
  }
}
