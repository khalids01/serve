import { z } from "zod";
import { config } from "@/config";
import { getLegacyTenantKeys, imageInclude } from "@/lib/image-response";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/prisma-types";
import type { StorageJob } from "../../../prisma/generated/prisma";
import { storageFolder } from "./browse";
import { blobKey, objectKey } from "./keys";
import {
  resolveBrowseLocation,
  resolveOwnerUploadLocation,
  StorageLocationError,
} from "./locations";

export const transferInput = z
  .object({
    source: z.string().min(1).max(255),
    target: z.string().min(1).max(255),
    operation: z.enum(["copy", "move"]),
    prefix: storageFolder.default(""),
  })
  .strict();
export type TransferPayload = z.infer<typeof transferInput> & {
  disk: boolean;
  sourceIdentity: string;
  targetIdentity: string;
};
export type JobCursor = {
  phase: "images" | "scan" | "copy" | "metadata" | "cleanup";
  imageCursor?: string;
  folders?: Array<{ prefix: string; cursor?: string }>;
};
export type ManagedImage = Prisma.ImageGetPayload<{
  include: typeof imageInclude;
}>;
export const json = (value: unknown): Prisma.InputJsonValue =>
  JSON.parse(JSON.stringify(value));

export async function createTransfer(
  user: { id: string; role?: string | null },
  body: unknown,
) {
  const input = transferInput.parse(body);
  const source = await resolveBrowseLocation(user, input.source);
  const target = await resolveBrowseLocation(
    { id: user.id, role: "user" },
    input.target,
  );
  if (!source.enabled || !target.enabled)
    throw new StorageLocationError("Enable both storage locations first.", 409);
  const sourceRoot = source.identity + input.prefix;
  if (
    target.identity.startsWith(sourceRoot) ||
    sourceRoot.startsWith(target.identity)
  )
    throw new StorageLocationError(
      "Choose separate source and destination locations; nested transfers are not supported.",
      409,
    );
  if (
    input.prefix
      .split("/")
      .some((part) =>
        [
          "_cache",
          ".serve-trash",
          ".serve-backups",
          ".serve-transfers",
          "data-backup",
        ].includes(part),
      )
  )
    throw new StorageLocationError(
      "Caches, Trash and backup archives cannot be transferred.",
      403,
    );
  if (
    (await prisma.storageJob.count({
      where: {
        ownerId: user.id,
        kind: "transfer",
        status: { in: ["queued", "running"] },
      },
    })) >= 5
  )
    throw new StorageLocationError(
      "Wait for an existing transfer to finish (up to five active transfers).",
      429,
    );
  return prisma.storageJob.create({
    data: {
      ownerId: user.id,
      kind: "transfer",
      payload: json({
        ...input,
        disk: source.scope === "disk",
        sourceIdentity: source.identity,
        targetIdentity: target.identity,
      }),
      cursor: { phase: "images" },
    },
  });
}
export async function transferLocations(job: StorageJob) {
  const payload = job.payload as unknown as TransferPayload;
  if (payload.disk) {
    const user = await prisma.user.findUnique({
      where: { id: job.ownerId },
      select: { role: true },
    });
    if (user?.role !== "admin")
      throw new StorageLocationError(
        "Administrator access is required for this disk transfer.",
        403,
      );
  }
  const source = await resolveBrowseLocation(
    { id: job.ownerId, role: payload.disk ? "admin" : "user" },
    payload.source,
  );
  const target = await resolveBrowseLocation(
    { id: job.ownerId, role: "user" },
    payload.target,
  );
  if (
    !source.enabled ||
    !target.enabled ||
    source.identity !== payload.sourceIdentity ||
    target.identity !== payload.targetIdentity
  )
    throw new StorageLocationError(
      "A transfer location changed or was disabled. Restore its settings before retrying.",
      409,
    );
  return { source, target, payload };
}

function physicalPrefix(image: ManagedImage, sourceChoice: string) {
  const id = image.storageLocationId;
  if (id === "system")
    return sourceChoice === "default" ||
      (sourceChoice === "local" && config.storage.provider === "local")
      ? ""
      : null;
  if (sourceChoice !== "local" && sourceChoice !== "default")
    return id === sourceChoice ? `connections/${id}/` : null;
  const match = /^(default|local):([^:]+)(?::([a-f0-9]{16}))?$/.exec(id);
  if (!match) return null;
  const snapshot = image.storageConfig as {
    kind?: string;
    endpoint?: string;
    bucket?: string;
  } | null;
  const local = match[1] === "local" || snapshot?.kind === "local";
  const sourceLocal =
    sourceChoice === "local" || config.storage.provider === "local";
  if (local !== sourceLocal) return null;
  if (
    !local &&
    (snapshot?.endpoint !== config.storage.s3.endpoint ||
      snapshot?.bucket !== config.storage.s3.bucket)
  )
    return null;
  return `owners/${match[2]}/${match[1]}/${match[3] ? `${match[3]}/` : ""}`;
}
export async function scanTransfer(job: StorageJob, cursor: JobCursor) {
  const { source, payload } = await transferLocations(job);
  if (cursor.phase === "images") {
    const images = await prisma.image.findMany({
      where: {
        OR: [
          { ownerId: job.ownerId },
          {
            ownerId: "",
            applications: { some: { application: { ownerId: job.ownerId } } },
          },
        ],
      },
      include: imageInclude,
      orderBy: { id: "asc" },
      take: 50,
      ...(cursor.imageCursor
        ? { cursor: { id: cursor.imageCursor }, skip: 1 }
        : {}),
    });
    for (const image of images) {
      const root = physicalPrefix(image, payload.source);
      if (root === null || !root.startsWith(source.namespacePrefix)) continue;
      if (
        image.applications.some(
          (entry) =>
            entry.application.ownerId &&
            entry.application.ownerId !== job.ownerId,
        )
      )
        continue;
      const files: Array<{
        key: string;
        destinationKey: string;
        kind: string;
        jobId: string;
        imageId: string;
      }> = [];
      for (const filename of [
        image.filename,
        ...image.variants.map((variant) => variant.filename),
      ]) {
        const candidates = [
          blobKey(filename),
          ...getLegacyTenantKeys(image).map((tenant) =>
            objectKey(tenant, filename),
          ),
        ];
        let found: string | undefined;
        for (const key of candidates) {
          const physical = root + key;
          if (!physical.startsWith(source.namespacePrefix)) continue;
          const relative = physical.slice(source.namespacePrefix.length);
          if (await source.storage.stat(relative)) {
            found = relative;
            break;
          }
        }
        if (!found)
          throw new StorageLocationError(
            "A managed source file or variant is missing. Source files have been retained.",
            409,
          );
        files.push({
          jobId: job.id,
          key: found,
          destinationKey: blobKey(filename),
          kind: "file",
          imageId: image.id,
        });
      }
      if (!files.some((file) => file.key.startsWith(payload.prefix))) continue;
      await prisma.storageJobItem.createMany({
        data: files,
        skipDuplicates: true,
      });
      await prisma.storageJobItem.upsert({
        where: { jobId_key: { jobId: job.id, key: `/image/${image.id}` } },
        create: {
          jobId: job.id,
          key: `/image/${image.id}`,
          destinationKey: "",
          kind: "metadata",
          imageId: image.id,
          metadata: json(image),
        },
        update: {},
      });
    }
    return images.length
      ? { ...cursor, imageCursor: images.at(-1)?.id }
      : { phase: "scan" as const, folders: [{ prefix: payload.prefix }] };
  }
  const folders = cursor.folders ?? [],
    current = folders[0];
  if (!current) return { phase: "copy" as const };
  const page = await source.storage.browse(current.prefix, current.cursor);
  if (page.hasUnsupportedEntries)
    throw new StorageLocationError(
      "The source contains a symbolic link or unsupported file. Remove it before retrying.",
      409,
    );
  const reserved = new Set<string>(),
    ownedKeys = new Set<string>();
  if (source.scope === "disk") {
    const names = page.entries
      .filter((entry) => entry.kind === "file")
      .map((entry) => entry.key.split("/").at(-1) ?? "");
    const [images, variants, owned] = await Promise.all([
      prisma.image.findMany({
        where: { filename: { in: names } },
        select: { filename: true },
      }),
      prisma.imageVariant.findMany({
        where: { filename: { in: names } },
        select: { filename: true },
      }),
      prisma.storageJobItem.findMany({
        where: {
          jobId: job.id,
          key: { in: page.entries.map((entry) => entry.key) },
          imageId: { not: null },
        },
        select: { key: true },
      }),
    ]);
    for (const file of [...images, ...variants]) reserved.add(file.filename);
    for (const item of owned) ownedKeys.add(item.key);
  }
  for (const entry of page.entries) {
    if (
      entry.kind === "file" &&
      reserved.has(entry.key.split("/").at(-1) ?? "") &&
      !ownedKeys.has(entry.key)
    )
      continue;
    const parts = entry.key.split("/");
    if (
      parts.some((part) =>
        [
          "_cache",
          ".serve-trash",
          ".serve-backups",
          ".serve-transfers",
          "data-backup",
        ].includes(part),
      )
    )
      continue;
    if (
      source.scope === "disk" &&
      ((parts[0] === "owners" &&
        parts.length > 2 &&
        parts[1] !== job.ownerId) ||
        (parts[0] === "connections" && parts.length > 2))
    )
      continue;
    if (entry.kind === "folder") folders.push({ prefix: entry.key });
    await prisma.storageJobItem.createMany({
      data: [
        {
          jobId: job.id,
          key: entry.key,
          destinationKey: entry.key.slice(payload.prefix.length),
          kind: entry.kind,
        },
      ],
      skipDuplicates: true,
    });
  }
  if (page.nextCursor) current.cursor = page.nextCursor;
  else folders.shift();
  if (folders.length > 10000)
    throw new StorageLocationError(
      "Too many nested folders. Transfer a smaller source folder.",
      413,
    );
  return { phase: "scan" as const, folders };
}
export async function rebindTransferredImage(
  job: StorageJob,
  image: ManagedImage,
) {
  const payload = job.payload as unknown as TransferPayload;
  if (payload.operation === "copy") return;
  const destination = await resolveOwnerUploadLocation(
    job.ownerId,
    payload.target,
  );
  const existing = await prisma.image.findUnique({
    where: {
      storageLocationId_hash: {
        storageLocationId: destination.id,
        hash: image.hash,
      },
    },
  });
  if (existing && existing.id !== image.id)
    throw new StorageLocationError(
      "The destination already has a managed image with this hash. Use Copy or choose another destination.",
      409,
    );
  const changed = await prisma.image.updateMany({
    where: {
      id: image.id,
      storageLocationId: image.storageLocationId,
      hash: image.hash,
      filename: image.filename,
      updatedAt: new Date(String(image.updatedAt)),
    },
    data: {
      storageLocationId: destination.id,
      storageConfig: destination.snapshot,
      ownerId: job.ownerId,
    },
  });
  if (!changed.count && existing?.id !== image.id)
    throw new StorageLocationError(
      "A managed file changed during the transfer. Source copies have been retained.",
      409,
    );
}
