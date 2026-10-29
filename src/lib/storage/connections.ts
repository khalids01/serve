import { randomUUID } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertEndpointAddresses, validateEndpoint } from "./endpoint";
import { StorageLocationError } from "./locations";
import { PrefixedStorage } from "./prefix";
import { S3StorageBackend } from "./s3";
import {
  decryptStorageCredentials,
  encryptStorageCredentials,
} from "./secrets";
import { deliveryMode } from "./settings";
export const connectionInput = z
  .object({
    name: z.string().trim().min(1).max(100),
    provider: z
      .enum(["idrive-e2", "aws", "r2", "minio", "s3"])
      .default("idrive-e2"),
    endpoint: z.string().max(500),
    bucket: z
      .string()
      .regex(
        /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/,
        "Use a valid S3 bucket name.",
      ),
    region: z
      .string()
      .regex(/^[a-zA-Z0-9-]{1,80}$/)
      .default("auto"),
    forcePathStyle: z.boolean().default(true),
    deliveryMode: deliveryMode.default("proxy"),
    accessKeyId: z.string().trim().min(1).max(512),
    secretAccessKey: z.string().min(1).max(2048),
  })
  .strict();
export async function testConnection(
  input: z.infer<typeof connectionInput>,
  id: string,
) {
  let endpoint: string;
  try {
    endpoint = validateEndpoint(input.endpoint);
    await assertEndpointAddresses(
      new URL(endpoint).hostname.replace(/^\[|\]$/g, ""),
    );
  } catch {
    throw new StorageLocationError(
      "Use a public HTTPS S3 endpoint, or ask the operator to allow its private hostname.",
      400,
    );
  }
  const storage = new PrefixedStorage(
    new S3StorageBackend({ ...input, endpoint, restrictNetwork: true }),
    `connections/${id}/`,
  );
  const key = `_serve-checks/${randomUUID()}`;
  const bytes = Buffer.from("Serve storage connection check");
  try {
    await storage.put(key, bytes, { contentType: "text/plain" });
    if (!(await storage.get(key))?.equals(bytes)) throw new Error();
    await storage.list("_serve-checks/");
    await storage.delete(key);
  } catch {
    throw new StorageLocationError(
      "Storage test failed. Check the endpoint, bucket, and read/write/list/delete permissions.",
      422,
    );
  } finally {
    await storage.delete(key).catch(() => {});
  }
}
export async function createConnection(ownerId: string, body: unknown) {
  const input = connectionInput.parse(body),
    id = randomUUID();
  if ((await prisma.storageConnection.count({ where: { ownerId } })) >= 100)
    throw new StorageLocationError(
      "You can save up to 100 storage connections.",
    );
  const encryptedCredentials = encryptStorageCredentials(input, ownerId, id);
  await testConnection(input, id);
  const { accessKeyId: _access, secretAccessKey: _secret, ...metadata } = input;
  return prisma.storageConnection.create({
    data: {
      ...metadata,
      endpoint: validateEndpoint(input.endpoint),
      id,
      ownerId,
      encryptedCredentials,
    },
  });
}
export async function ownedConnection(id: string, ownerId: string) {
  const row = await prisma.storageConnection.findFirst({
    where: { id, ownerId },
  });
  if (!row)
    throw new StorageLocationError("Storage connection not found.", 404);
  return row;
}
export async function connectionUsage(id: string) {
  const [files, applications] = await Promise.all([
    prisma.image.count({ where: { storageLocationId: id } }),
    prisma.application.count({ where: { defaultStorageLocationId: id } }),
  ]);
  const references = await prisma.storageJob.count({
    where: {
      OR: [
        { kind: "backup", payload: { path: ["target"], equals: id } },
        {
          status: { in: ["queued", "running", "failed"] },
          OR: [
            { payload: { path: ["source"], equals: id } },
            { payload: { path: ["target"], equals: id } },
          ],
        },
      ],
    },
  });
  const preferences = await prisma.storagePreference.count({
    where: { localBackupConnectionId: id },
  });
  return { files, applications, references: references + preferences };
}
export function publicConnection(
  row: Awaited<ReturnType<typeof ownedConnection>>,
) {
  const { encryptedCredentials: _secret, ...value } = row;
  return { ...value, credentialsConfigured: true };
}
export async function updateConnection(
  id: string,
  ownerId: string,
  body: unknown,
) {
  const row = await ownedConnection(id, ownerId);
  const patch = connectionInput
    .partial()
    .extend({
      enabled: z.boolean().optional(),
      deliveryMode: deliveryMode.optional(),
      provider: connectionInput.shape.provider.removeDefault().optional(),
      region: connectionInput.shape.region.removeDefault().optional(),
      forcePathStyle: connectionInput.shape.forcePathStyle
        .removeDefault()
        .optional(),
    })
    .parse(body);
  const usage = await connectionUsage(id);
  const coordinates = [
    "endpoint",
    "bucket",
    "region",
    "forcePathStyle",
  ] as const;
  if (
    (usage.files || usage.applications || usage.references) &&
    coordinates.some(
      (key) => patch[key] !== undefined && patch[key] !== row[key],
    )
  )
    throw new StorageLocationError(
      "This location is in use. Create a new connection to change its endpoint, bucket or addressing settings.",
      409,
    );
  const credentials = decryptStorageCredentials(
    row.encryptedCredentials,
    ownerId,
    id,
  );
  const input = connectionInput.parse({
    name: row.name,
    provider: row.provider,
    endpoint: row.endpoint,
    bucket: row.bucket,
    region: row.region,
    forcePathStyle: row.forcePathStyle,
    deliveryMode: row.deliveryMode,
    ...credentials,
    ...Object.fromEntries(
      Object.entries(patch).filter(([key]) => key !== "enabled"),
    ),
  });
  if (
    [...coordinates, "accessKeyId", "secretAccessKey"].some(
      (key) => key in patch,
    )
  )
    await testConnection(input, id);
  const { accessKeyId: _access, secretAccessKey: _secret, ...metadata } = input;
  return prisma.storageConnection.update({
    where: { id },
    data: {
      ...metadata,
      endpoint: validateEndpoint(input.endpoint),
      enabled: patch.enabled ?? row.enabled,
      encryptedCredentials: encryptStorageCredentials(input, ownerId, id),
    },
  });
}
