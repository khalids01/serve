import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  app: { ownerId: "alice", defaultStorageLocationId: "default" },
  connection: vi.fn(),
  s3: vi.fn(),
  local: vi.fn(),
  config: {
    storage: {
      provider: "s3",
      local: { uploadDir: "/uploads" },
      s3: {
        accessKeyId: "host-access",
        secretAccessKey: "host-secret",
        bucket: "first",
        region: "auto",
        endpoint: "https://s3.example",
        forcePathStyle: true,
      },
    },
  },
}));
vi.mock("@/config", () => ({ config: mocks.config }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    storageSettings: { findUnique: async () => null },
    storagePreference: { findUnique: async () => null, count: async () => 0 },
    storageJob: { count: async () => 0 },
    application: { findUniqueOrThrow: async () => mocks.app },
    storageConnection: {
      findFirst: mocks.connection,
      findUnique: mocks.connection,
    },
  },
}));
vi.mock("@/lib/storage/s3", () => ({
  S3StorageBackend: class {
    constructor(options: unknown) {
      mocks.s3(options);
      Object.assign(this, storage);
    }
  },
}));
vi.mock("@/lib/storage/local", () => ({
  LocalStorageBackend: class {
    constructor(directory: unknown) {
      mocks.local(directory);
      Object.assign(this, storage);
    }
  },
}));

import {
  assertLocationAccess,
  getStorageForImage,
  resolveUploadLocation,
} from "../../src/lib/storage/locations";
import { encryptStorageCredentials } from "../../src/lib/storage/secrets";
import { reset, storage } from "./support/memory-serve";

beforeEach(() => {
  reset();
  vi.clearAllMocks();
  mocks.config.storage.s3.bucket = "first";
  mocks.config.storage.s3.accessKeyId = "host-access";
  mocks.app = { ownerId: "alice", defaultStorageLocationId: "default" };
  mocks.connection.mockResolvedValue(null);
  vi.stubEnv("STORAGE_ENCRYPTION_KEY", Buffer.alloc(32, 1).toString("base64"));
});
afterEach(() => vi.unstubAllEnvs());
describe("recorded storage locations", () => {
  it("keeps existing Default files bound to their original bucket when env defaults change", async () => {
    const original = await resolveUploadLocation("app");
    await original.storage.put("_blobs/same", Buffer.from("old"));
    mocks.config.storage.s3.bucket = "second";
    const next = await resolveUploadLocation("app");
    expect(next.id).not.toBe(original.id);
    await next.storage.put("_blobs/same", Buffer.from("new"));
    const recorded = await getStorageForImage({
      storageLocationId: original.id,
      storageConfig: original.snapshot,
    });
    expect((await recorded.get("_blobs/same"))?.toString()).toBe("old");
    expect(mocks.s3).toHaveBeenLastCalledWith(
      expect.objectContaining({ bucket: "first" }),
    );
  });
  it("allows Local independently of an unconfigured default and isolates owners", async () => {
    mocks.config.storage.s3.accessKeyId = "";
    await expect(resolveUploadLocation("app")).rejects.toThrow(
      /not configured/,
    );
    const alice = await resolveUploadLocation("app", "local");
    await alice.storage.put("_blobs/same", Buffer.from("alice"));
    mocks.app.ownerId = "bob";
    const bob = await resolveUploadLocation("app", "local");
    expect(await bob.storage.get("_blobs/same")).toBeNull();
    expect(mocks.local).toHaveBeenCalledWith("/uploads");
  });
  it("rejects another owner's or disabled connection for new uploads", async () => {
    await expect(
      assertLocationAccess("alice", "foreign"),
    ).rejects.toMatchObject({ status: 403 });
    expect(mocks.connection).toHaveBeenCalledWith({
      where: { id: "foreign", ownerId: "alice", enabled: true },
    });
  });
  it("uses decrypted saved credentials for existing reads even when new uploads are disabled", async () => {
    const credentials = {
      accessKeyId: "saved-access",
      secretAccessKey: "saved-secret",
    };
    mocks.connection.mockResolvedValue({
      id: "saved",
      ownerId: "alice",
      enabled: false,
      endpoint: "https://s3.example",
      bucket: "bucket",
      region: "auto",
      forcePathStyle: true,
      encryptedCredentials: encryptStorageCredentials(
        credentials,
        "alice",
        "saved",
      ),
    });
    await getStorageForImage({ storageLocationId: "saved", ownerId: "alice" });
    expect(mocks.s3).toHaveBeenCalledWith(
      expect.objectContaining({
        ...credentials,
        restrictNetwork: true,
        bucket: "bucket",
      }),
    );
    await expect(
      getStorageForImage({ storageLocationId: "saved", ownerId: "bob" }),
    ).rejects.toMatchObject({ status: 503 });
  });
});
