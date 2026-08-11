export interface StorageObjectInfo {
  key: string;
  sizeBytes: number;
  mtimeMs?: number;
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

export interface StorageBackend {
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
