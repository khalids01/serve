import { createHash } from "node:crypto";
import { config } from "@/config";
import { withBlobLock } from "@/lib/blob-lock";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/prisma-types";
import type { StorageBackend } from "./backend";
import { getStorage } from "./factory";
import { LocalStorageBackend } from "./local";
import { PrefixedStorage } from "./prefix";
import { S3StorageBackend } from "./s3";
import { decryptStorageCredentials } from "./secrets";
export class StorageLocationError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}
type Snapshot =
  | { kind: "local" }
  | {
      kind: "s3";
      endpoint?: string;
      bucket?: string;
      region: string;
      forcePathStyle: boolean;
    };
export function defaultLocationReady() {
  return (
    config.storage.provider === "local" ||
    Boolean(
      config.storage.s3.accessKeyId &&
        config.storage.s3.secretAccessKey &&
        config.storage.s3.bucket,
    )
  );
}
function defaultSnapshot(): Snapshot {
  return config.storage.provider === "local"
    ? { kind: "local" }
    : {
        kind: "s3",
        endpoint: config.storage.s3.endpoint,
        bucket: config.storage.s3.bucket,
        region: config.storage.s3.region,
        forcePathStyle: config.storage.s3.forcePathStyle,
      };
}
export async function assertLocationAccess(
  ownerId: string,
  choice: string,
  requireEnabled = true,
) {
  if (choice === "default") {
    if (!defaultLocationReady())
      throw new StorageLocationError(
        "Default storage is not configured. Select Local storage or add an S3 connection.",
        503,
      );
    return;
  }
  if (choice === "local") return;
  const connection = await prisma.storageConnection.findFirst({
    where: {
      id: choice,
      ownerId,
      ...(requireEnabled ? { enabled: true } : {}),
    },
  });
  if (!connection)
    throw new StorageLocationError(
      "Storage connection is unavailable or does not belong to you.",
      403,
    );
}
export async function resolveUploadLocation(
  applicationId: string,
  choice?: string,
) {
  const app = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
    select: { ownerId: true, defaultStorageLocationId: true },
  });
  const selected = choice ?? app.defaultStorageLocationId;
  await assertLocationAccess(app.ownerId, selected);
  const snapshot =
    selected === "default"
      ? defaultSnapshot()
      : selected === "local"
        ? ({ kind: "local" } as Snapshot)
        : null;
  const fingerprint =
    selected === "default"
      ? createHash("sha256")
          .update(JSON.stringify(snapshot))
          .digest("hex")
          .slice(0, 16)
      : null;
  const id =
    selected === "default"
      ? `default:${app.ownerId}:${fingerprint}`
      : selected === "local"
        ? `local:${app.ownerId}`
        : selected;
  return {
    id,
    ownerId: app.ownerId,
    snapshot: snapshot
      ? (JSON.parse(JSON.stringify(snapshot)) as Prisma.InputJsonValue)
      : undefined,
    storage: await getStorageForImage({
      storageLocationId: id,
      storageConfig: snapshot,
    }),
  };
}
export async function getStorageForImage(image: {
  storageLocationId?: string;
  storageConfig?: unknown;
  ownerId?: string;
}): Promise<StorageBackend> {
  const id = image.storageLocationId ?? "system";
  // Reserved for system backups and old metadata; new uploads always have an owner namespace.
  if (id === "system") return getStorage();
  if (id.startsWith("default:") || id.startsWith("local:")) {
    const [kind, ownerId, fingerprint] = id.split(":");
    if (
      !ownerId ||
      !/^[a-zA-Z0-9_-]+$/.test(ownerId) ||
      (fingerprint && !/^[a-f0-9]{16}$/.test(fingerprint))
    )
      throw new StorageLocationError("Invalid storage owner binding.");
    const snapshot = (image.storageConfig ??
      (kind === "local" ? { kind: "local" } : defaultSnapshot())) as Snapshot;
    const backend =
      snapshot.kind === "local"
        ? new LocalStorageBackend(config.storage.local.uploadDir)
        : new S3StorageBackend({ ...config.storage.s3, ...snapshot });
    return new PrefixedStorage(
      backend,
      `owners/${ownerId}/${kind}/${fingerprint ? `${fingerprint}/` : ""}`,
    );
  }
  const connection = await prisma.storageConnection.findUnique({
    where: { id },
  });
  if (!connection || (image.ownerId && image.ownerId !== connection.ownerId))
    throw new StorageLocationError(
      "The file's storage connection no longer exists.",
      503,
    );
  const credentials = decryptStorageCredentials(
    connection.encryptedCredentials,
    connection.ownerId,
    id,
  );
  return new PrefixedStorage(
    new S3StorageBackend({
      ...connection,
      ...credentials,
      restrictNetwork: true,
    }),
    `connections/${id}/`,
  );
}

export function withOwnerStorageLock<T>(
  ownerId: string,
  work: () => Promise<T>,
) {
  // Folder transfers can span multiple sequential storage requests.
  return withBlobLock(`owner-files:${ownerId}`, async () => work(), 900_000);
}
