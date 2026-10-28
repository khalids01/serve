import type { BrowsePage } from "./browse";
export interface StorageObjectInfo {
  key: string;
  sizeBytes: number;
  mtimeMs?: number;
  etag?: string;
}

export interface StorageByteRange {
  start: number;
  end: number;
}

export interface StorageReadStream {
  body: ReadableStream<Uint8Array>;
  contentLength: number;
  contentRange?: string;
  contentType?: string;
}

export type SignedReadOptions = {
  contentType: string;
  disposition?: string;
  cacheControl?: string;
};

export interface StorageBackend {
  /** Short-lived GET only. Never exposes a storage secret. Null keeps proxy delivery. */
  signedRead?(key: string, options: SignedReadOptions): Promise<string | null>;
  readonly maxWriteBytes?: number;
  createDirectory(key: string): Promise<void>;
  createFile(
    key: string,
    body: ReadableStream<Uint8Array>,
    size: number,
    contentType?: string,
  ): Promise<void>;
  copyFile(source: string, target: string): Promise<void>;
  removeDirectory(key: string): Promise<void>;
  stat(key: string): Promise<StorageObjectInfo | null>;
  browse(prefix: string, cursor?: string): Promise<BrowsePage>;
  /** e.g. "my-app-slug/abc123.jpeg" */
  put(
    key: string,
    data: Buffer,
    opts?: { contentType?: string },
  ): Promise<void>;
  get(key: string): Promise<Buffer | null>;
  open(
    key: string,
    range?: StorageByteRange,
  ): Promise<StorageReadStream | null>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  list(prefix: string): Promise<StorageObjectInfo[]>;
  deletePrefix(prefix: string): Promise<void>;
}
