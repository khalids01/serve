export interface StorageObjectInfo {
  key: string;
  sizeBytes: number;
  mtimeMs?: number;
}

export interface StorageBackend {
  /** e.g. "my-app-slug/abc123.jpeg" */
  put(
    key: string,
    data: Buffer,
    opts?: { contentType?: string },
  ): Promise<void>;
  get(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  list(prefix: string): Promise<StorageObjectInfo[]>;
  deletePrefix(prefix: string): Promise<void>;
}
