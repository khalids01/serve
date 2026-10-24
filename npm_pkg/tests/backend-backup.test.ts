import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  application: vi.fn(),
  folder: vi.fn(),
  parent: vi.fn(),
  connection: vi.fn(),
  image: vi.fn(),
  entry: vi.fn(),
  get: vi.fn(),
}));
vi.mock("@/lib/storage/factory", () => ({
  getStorage: () => ({ get: mocks.get }),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    backupRecord: {
      findUnique: async () => ({
        type: "json",
        status: "success",
        storageKey: "backup.json",
      }),
    },
    $transaction: async (work: (tx: unknown) => Promise<unknown>) =>
      work({
        application: { upsert: mocks.application },
        folder: { upsert: mocks.folder, update: mocks.parent },
        storageConnection: { upsert: mocks.connection },
        image: { upsert: mocks.image },
        imageVariant: { upsert: vi.fn() },
        imageApplication: { upsert: mocks.entry },
      }),
  },
}));

import { syncImageMetadataFromBackup } from "../../src/lib/backups";

describe("metadata backup v2", () => {
  it("restores connection encryption, location bindings, folder parents and Trash before linking files", async () => {
    const timestamp = new Date().toISOString();
    mocks.get.mockResolvedValue(
      Buffer.from(
        JSON.stringify({
          schemaVersion: 2,
          applications: [
            {
              id: "app",
              name: "App",
              slug: "app",
              ownerId: "owner",
              storageDir: "app",
              defaultStorageLocationId: "connection",
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          ],
          storageConnections: [
            {
              id: "connection",
              ownerId: "owner",
              encryptedCredentials: "encrypted-envelope",
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          ],
          folders: [
            {
              id: "child",
              applicationId: "app",
              parentId: "parent",
              name: "Child",
              createdAt: timestamp,
              updatedAt: timestamp,
              deletedAt: timestamp,
              trashBatchId: "batch",
            },
            {
              id: "parent",
              applicationId: "app",
              parentId: null,
              name: "Parent",
              createdAt: timestamp,
              updatedAt: timestamp,
              deletedAt: timestamp,
              trashBatchId: "batch",
            },
          ],
          images: [
            {
              id: "blob",
              hash: "hash",
              ownerId: "owner",
              storageLocationId: "connection",
              storageConfig: null,
              filename: "hash.txt",
              contentType: "text/plain",
              sizeBytes: 3,
              width: null,
              height: null,
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          ],
          imageVariants: [],
          imageApplications: [
            {
              id: "entry",
              imageId: "blob",
              applicationId: "app",
              originalName: "note.txt",
              folderId: "child",
              deletedAt: timestamp,
              trashBatchId: "batch",
              starred: true,
              tags: [],
              linkedAt: timestamp,
              updatedAt: timestamp,
            },
          ],
        }),
      ),
    );
    await syncImageMetadataFromBackup("backup");
    expect(mocks.application).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          defaultStorageLocationId: "connection",
        }),
      }),
    );
    expect(mocks.connection).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          encryptedCredentials: "encrypted-envelope",
          ownerId: "owner",
        }),
      }),
    );
    expect(mocks.image).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          storageLocationId: "connection",
          ownerId: "owner",
        }),
      }),
    );
    expect(mocks.entry).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          folderId: "child",
          deletedAt: expect.any(Date),
          trashBatchId: "batch",
          starred: true,
        }),
      }),
    );
    expect(mocks.parent.mock.invocationCallOrder[0]).toBeGreaterThan(
      mocks.folder.mock.invocationCallOrder[1],
    );
    expect(mocks.entry.mock.invocationCallOrder[0]).toBeGreaterThan(
      mocks.parent.mock.invocationCallOrder[0],
    );
  });
});
