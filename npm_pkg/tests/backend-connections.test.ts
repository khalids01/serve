import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  saved: vi.fn(),
  row: vi.fn(),
  count: vi.fn(),
  delete: vi.fn(),
  put: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    storageSettings: { findUnique: async () => null },
    storagePreference: { findUnique: async () => null, count: async () => 0 },
    storageJob: { count: async () => 0 },
    storageConnection: {
      count: async () => 0,
      create: mocks.saved,
      findFirst: mocks.row,
      update: mocks.saved,
    },
    image: { count: mocks.count },
    application: { count: async () => 0 },
  },
}));
vi.mock("@/lib/storage/endpoint", () => ({
  validateEndpoint: (value: string) => new URL(value).origin,
  assertEndpointAddresses: async () => [{ address: "1.1.1.1", family: 4 }],
}));
vi.mock("@/lib/storage/s3", () => ({
  S3StorageBackend: class {
    put = mocks.put;
    get = async () => Buffer.from("Serve storage connection check");
    list = async () => [];
    delete = mocks.delete;
  },
}));

import {
  createConnection,
  publicConnection,
  testConnection,
  updateConnection,
} from "../../src/lib/storage/connections";
import {
  decryptStorageCredentials,
  encryptStorageCredentials,
} from "../../src/lib/storage/secrets";

const input = {
  name: "My bucket",
  provider: "idrive-e2" as const,
  deliveryMode: "proxy" as const,
  endpoint: "https://s3.example",
  bucket: "media",
  region: "auto",
  forcePathStyle: true,
  accessKeyId: "sensitive-access",
  secretAccessKey: "sensitive-secret",
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("STORAGE_ENCRYPTION_KEY", Buffer.alloc(32, 1).toString("base64"));
  mocks.put.mockResolvedValue(undefined);
  mocks.delete.mockResolvedValue(undefined);
  mocks.count.mockResolvedValue(0);
  mocks.saved.mockImplementation(async ({ data }: { data: unknown }) => data);
});
afterEach(() => vi.unstubAllEnvs());
describe("saved connection lifecycle", () => {
  it("tests permissions, stores only encrypted credentials, and redacts its response", async () => {
    const row = await createConnection("owner", input);
    expect(mocks.put).toHaveBeenCalled();
    expect(mocks.delete).toHaveBeenCalled();
    expect(row).not.toHaveProperty("secretAccessKey");
    expect(row).not.toHaveProperty("accessKeyId");
    expect(
      decryptStorageCredentials(row.encryptedCredentials, "owner", row.id),
    ).toEqual({
      accessKeyId: input.accessKeyId,
      secretAccessKey: input.secretAccessKey,
    });
    const response = JSON.stringify(publicConnection(row));
    for (const secret of [
      input.accessKeyId,
      input.secretAccessKey,
      row.encryptedCredentials,
    ])
      expect(response).not.toContain(secret);
  });
  it("fails the connection test when delete permissions are missing", async () => {
    mocks.delete.mockRejectedValue(
      new Error("AccessDenied with sensitive internal diagnostics"),
    );
    await expect(testConnection(input, "test")).rejects.toMatchObject({
      status: 422,
      message: expect.not.stringContaining("sensitive"),
    });
  });
  it("does not persist an unverified bucket", async () => {
    mocks.put.mockRejectedValue(new Error("access denied"));
    await expect(createConnection("owner", input)).rejects.toMatchObject({
      status: 422,
    });
    expect(mocks.saved).not.toHaveBeenCalled();
  });
  it("allows disabling an unreachable connection without a bucket test", async () => {
    mocks.row.mockResolvedValue({
      ...input,
      id: "connection",
      ownerId: "owner",
      enabled: true,
      encryptedCredentials: encryptStorageCredentials(
        input,
        "owner",
        "connection",
      ),
    });
    await updateConnection("connection", "owner", { enabled: false });
    expect(mocks.put).not.toHaveBeenCalled();
    expect(mocks.saved).toHaveBeenCalledWith({
      where: { id: "connection" },
      data: expect.objectContaining({ enabled: false }),
    });
  });
  it("prevents redirecting a connection that already stores files", async () => {
    mocks.row.mockResolvedValue({
      ...input,
      id: "connection",
      ownerId: "owner",
      enabled: true,
    });
    mocks.count.mockResolvedValue(1);
    await expect(
      updateConnection("connection", "owner", { bucket: "different" }),
    ).rejects.toMatchObject({ status: 409 });
    expect(mocks.saved).not.toHaveBeenCalled();
  });
});
