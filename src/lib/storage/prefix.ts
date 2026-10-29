import type {
  SignedReadOptions,
  StorageBackend,
  StorageByteRange,
} from "./backend";
import { browsePath } from "./browse";
export class PrefixedStorage implements StorageBackend {
  constructor(
    private readonly backend: StorageBackend,
    private readonly prefix: string,
  ) {
    if (!/^[a-zA-Z0-9/_:-]+\/$/.test(prefix) || prefix.includes(".."))
      throw new Error("Invalid storage namespace.");
  }
  get directDelivery() {
    return this.backend.directDelivery;
  }
  get maxWriteBytes() {
    return this.backend.maxWriteBytes;
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
  signedRead(key: string, options: SignedReadOptions) {
    return (
      this.backend.signedRead?.(this.key(key), options) ?? Promise.resolve(null)
    );
  }
  createDirectory(key: string) {
    return this.backend.createDirectory(this.key(key));
  }
  createFile(
    key: string,
    body: ReadableStream<Uint8Array>,
    size: number,
    contentType?: string,
  ) {
    return this.backend.createFile(this.key(key), body, size, contentType);
  }
  copyFile(source: string, target: string) {
    return this.backend.copyFile(this.key(source), this.key(target));
  }
  removeDirectory(key: string) {
    return this.backend.removeDirectory(this.key(key));
  }
  async stat(key: string) {
    const info = await this.backend.stat(this.key(key));
    return info ? { ...info, key } : null;
  }
  async browse(prefix: string, cursor?: string) {
    browsePath.parse(prefix);
    const page = await this.backend.browse(this.key(prefix), cursor);
    return {
      ...page,
      entries: page.entries
        .filter((entry) => entry.key.startsWith(this.prefix))
        .map((entry) => ({
          ...entry,
          key: entry.key.slice(this.prefix.length),
        })),
    };
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
