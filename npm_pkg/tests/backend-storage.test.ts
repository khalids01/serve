import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isPublicAddress,
  validateEndpoint,
} from "../../src/lib/storage/endpoint";
import { PrefixedStorage } from "../../src/lib/storage/prefix";
import {
  decryptStorageCredentials,
  encryptStorageCredentials,
  storageEncryptionReady,
} from "../../src/lib/storage/secrets";
import { reset, storage } from "./support/memory-serve";

afterEach(() => {
  vi.unstubAllEnvs();
  reset();
});
describe("encrypted storage credentials", () => {
  const credentials = {
    accessKeyId: "access-sensitive",
    secretAccessKey: "secret-sensitive",
  };
  it("uses random authenticated encryption and never persists plaintext", () => {
    vi.stubEnv(
      "STORAGE_ENCRYPTION_KEY",
      Buffer.alloc(32, 1).toString("base64"),
    );
    const a = encryptStorageCredentials(credentials, "owner", "connection"),
      b = encryptStorageCredentials(credentials, "owner", "connection");
    expect(a).not.toBe(b);
    expect(a).not.toContain(credentials.secretAccessKey);
    expect(a).not.toContain(credentials.accessKeyId);
    expect(decryptStorageCredentials(a, "owner", "connection")).toEqual(
      credentials,
    );
    expect(() =>
      decryptStorageCredentials(a, "another-owner", "connection"),
    ).toThrow(/authenticated/);
    expect(() =>
      decryptStorageCredentials(a, "owner", "another-connection"),
    ).toThrow(/authenticated/);
    const parts = a.split(".");
    parts[4] = Buffer.from("tampered").toString("base64");
    expect(() =>
      decryptStorageCredentials(parts.join("."), "owner", "connection"),
    ).toThrow(/authenticated/);
  });
  it("reads old keys during rotation and writes only the new key", () => {
    const old = Buffer.alloc(32, 1).toString("base64"),
      current = Buffer.alloc(32, 2).toString("base64");
    vi.stubEnv("STORAGE_ENCRYPTION_KEY", old);
    const encrypted = encryptStorageCredentials(
      credentials,
      "owner",
      "connection",
    );
    vi.stubEnv("STORAGE_ENCRYPTION_KEY", current);
    expect(() =>
      decryptStorageCredentials(encrypted, "owner", "connection"),
    ).toThrow(/missing/);
    vi.stubEnv("STORAGE_ENCRYPTION_PREVIOUS_KEYS", old);
    const restored = decryptStorageCredentials(
      encrypted,
      "owner",
      "connection",
    );
    const rotated = encryptStorageCredentials(restored, "owner", "connection");
    vi.stubEnv("STORAGE_ENCRYPTION_PREVIOUS_KEYS", "");
    expect(decryptStorageCredentials(rotated, "owner", "connection")).toEqual(
      credentials,
    );
  });
  it("fails closed without a valid host key", () => {
    vi.stubEnv("STORAGE_ENCRYPTION_KEY", "");
    expect(storageEncryptionReady()).toBe(false);
    expect(() => encryptStorageCredentials(credentials, "o", "c")).toThrow(
      /Configure/,
    );
    vi.stubEnv("STORAGE_ENCRYPTION_KEY", "short");
    expect(storageEncryptionReady()).toBe(false);
  });
});
describe("storage namespaces and endpoints", () => {
  it("isolates identical object names and confines enumeration/deletion", async () => {
    const a = new PrefixedStorage(storage, "owners/a/local/"),
      b = new PrefixedStorage(storage, "owners/b/local/");
    await a.put("_blobs/file", Buffer.from("a"));
    await b.put("_blobs/file", Buffer.from("b"));
    expect((await a.get("_blobs/file"))?.toString()).toBe("a");
    expect(await a.list("_blobs/")).toEqual([
      { key: "_blobs/file", sizeBytes: 1 },
    ]);
    await a.deletePrefix("_blobs/");
    expect(await a.get("_blobs/file")).toBeNull();
    expect((await b.get("_blobs/file"))?.toString()).toBe("b");
  });
  it("rejects traversal and absolute keys", () => {
    const a = new PrefixedStorage(storage, "owners/a/local/");
    for (const key of ["../b", "/absolute", "foo/../../b", "foo\\bar"])
      expect(() => a.get(key)).toThrow(/key/);
  });
  it("rejects local, metadata, multicast and mapped IPv6 addresses", () => {
    for (const address of [
      "127.0.0.1",
      "169.254.169.254",
      "10.0.0.1",
      "192.168.1.1",
      "172.16.0.1",
      "100.64.0.1",
      "::1",
      "fc00::1",
      "fe80::1",
      "::ffff:127.0.0.1",
      "224.0.0.1",
    ])
      expect(isPublicAddress(address)).toBe(false);
    expect(isPublicAddress("1.1.1.1")).toBe(true);
    expect(isPublicAddress("2606:4700:4700::1111")).toBe(true);
  });
  it("requires HTTPS origins and operator opt-in for private MinIO", () => {
    vi.stubEnv("STORAGE_ALLOWED_PRIVATE_HOSTS", "");
    for (const endpoint of [
      "http://public.example",
      "https://user:secret@public.example",
      "https://public.example/path",
      "https://127.0.0.1",
    ])
      expect(() => validateEndpoint(endpoint)).toThrow();
    expect(validateEndpoint("https://s3.example/")).toBe("https://s3.example");
    vi.stubEnv("STORAGE_ALLOWED_PRIVATE_HOSTS", "minio");
    expect(validateEndpoint("http://minio:9000")).toBe("http://minio:9000");
    expect(() => validateEndpoint("http://other:9000")).toThrow();
  });
});
