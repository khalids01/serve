import type { StorageBackend, StorageByteRange } from "./backend";
export class PrefixedStorage implements StorageBackend {
  constructor(
    private readonly backend: StorageBackend,
    private readonly prefix: string,
  ) {
    if (!/^[a-zA-Z0-9/_:-]+\/$/.test(prefix) || prefix.includes(".."))
      throw new Error("Invalid storage namespace.");
  }
  private key(key: string) {
    if (
      key.startsWith("/") ||
      key.split("/").includes("..") ||
      key.includes("\\")
    )
      throw new Error("Invalid storage key.");
    return this.prefix + key;
  }
  put(key: string, data: Buffer, options?: { contentType?: string }) {
    return this.backend.put(this.key(key), data, options);
  }
  get(key: string) {
    return this.backend.get(this.key(key));
  }
  open(key: string, range?: StorageByteRange) {
    return this.backend.open(this.key(key), range);
  }
  delete(key: string) {
    return this.backend.delete(this.key(key));
  }
  exists(key: string) {
    return this.backend.exists(this.key(key));
  }
  async list(prefix: string) {
    return (await this.backend.list(this.key(prefix))).map((value) => ({
      ...value,
      key: value.key.slice(this.prefix.length),
    }));
  }
  deletePrefix(prefix: string) {
    return this.backend.deletePrefix(this.key(prefix));
  }
}
