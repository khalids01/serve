import { spawn } from "node:child_process";
import crypto from "node:crypto";
import { config } from "@/config";
import { prisma } from "@/lib/prisma";
import type {
  BackupPeriod,
  BackupTrigger,
  BackupType,
} from "@/lib/prisma-types";
import { getStorage } from "@/lib/storage/factory";

const CONFIG_ID = "default";
const JSON_SCHEMA_VERSION = 1;

export type EffectiveBackupConfig = {
  id: string;
  enabled: boolean;
  basePrefix: string;
  jsonIntervalMinutes: number;
  sqlIntervalMinutes: number;
  schedulerIntervalMinutes: number;
  dailyRetentionDays: number;
  weeklyRetentionWeeks: number;
  monthlyRetentionMonths: number;
  lastJsonBackupAt: string | null;
  lastSqlBackupAt: string | null;
};

type BackupConfigRow = Awaited<ReturnType<typeof ensureBackupConfig>>;

type BackupJsonPayload = {
  schemaVersion: number;
  exportedAt: string;
  counts: {
    applications: number;
    images: number;
    imageApplications: number;
    imageVariants: number;
  };
  applications: Array<{
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    storageDir: string;
  }>;
  images: Array<{
    id: string;
    filename: string;
    contentType: string;
    sizeBytes: number;
    width: number | null;
    height: number | null;
    hash: string;
    createdAt: string;
    updatedAt: string;
  }>;
  imageApplications: Array<{
    id: string;
    imageId: string;
    applicationId: string;
    originalName: string;
    tags: unknown;
    linkedAt: string;
    updatedAt: string;
  }>;
  imageVariants: Array<{
    id: string;
    imageId: string;
    label: string;
    filename: string;
    width: number | null;
    height: number | null;
    sizeBytes: number;
    createdAt: string;
  }>;
};

function toIso(date: Date | null | undefined) {
  return date ? date.toISOString() : null;
}

function defaultConfigData() {
  return {
    id: CONFIG_ID,
    enabled: config.backup.enabled,
    basePrefix: config.backup.basePrefix,
    jsonIntervalMinutes: config.backup.jsonIntervalMinutes,
    sqlIntervalMinutes: config.backup.sqlIntervalMinutes,
    schedulerIntervalMinutes: config.backup.schedulerIntervalMinutes,
    dailyRetentionDays: config.backup.retention.dailyDays,
    weeklyRetentionWeeks: config.backup.retention.weeklyWeeks,
    monthlyRetentionMonths: config.backup.retention.monthlyMonths,
  };
}

function cleanPrefix(prefix: string) {
  const trimmed = prefix.trim().replace(/^\/+|\/+$/g, "");
  return trimmed || "data-backup";
}

function positiveInt(value: unknown, fallback: number, min = 1) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(min, Math.round(num));
}

export async function ensureBackupConfig() {
  const defaults = defaultConfigData();
  return prisma.backupConfig.upsert({
    where: { id: CONFIG_ID },
    create: defaults,
    update: {},
  });
}

export function serializeBackupConfig(
  row: BackupConfigRow,
): EffectiveBackupConfig {
  return {
    id: row.id,
    enabled: row.enabled,
    basePrefix: row.basePrefix,
    jsonIntervalMinutes: row.jsonIntervalMinutes,
    sqlIntervalMinutes: row.sqlIntervalMinutes,
    schedulerIntervalMinutes: row.schedulerIntervalMinutes,
    dailyRetentionDays: row.dailyRetentionDays,
    weeklyRetentionWeeks: row.weeklyRetentionWeeks,
    monthlyRetentionMonths: row.monthlyRetentionMonths,
    lastJsonBackupAt: toIso(row.lastJsonBackupAt),
    lastSqlBackupAt: toIso(row.lastSqlBackupAt),
  };
}

export async function updateBackupConfig(
  input: Partial<EffectiveBackupConfig>,
) {
  const current = await ensureBackupConfig();
  return prisma.backupConfig.update({
    where: { id: CONFIG_ID },
    data: {
      enabled:
        typeof input.enabled === "boolean" ? input.enabled : current.enabled,
      basePrefix:
        typeof input.basePrefix === "string"
          ? cleanPrefix(input.basePrefix)
          : current.basePrefix,
      jsonIntervalMinutes: positiveInt(
        input.jsonIntervalMinutes,
        current.jsonIntervalMinutes,
      ),
      sqlIntervalMinutes: positiveInt(
        input.sqlIntervalMinutes,
        current.sqlIntervalMinutes,
      ),
      schedulerIntervalMinutes: positiveInt(
        input.schedulerIntervalMinutes,
        current.schedulerIntervalMinutes,
      ),
      dailyRetentionDays: positiveInt(
        input.dailyRetentionDays,
        current.dailyRetentionDays,
      ),
      weeklyRetentionWeeks: positiveInt(
        input.weeklyRetentionWeeks,
        current.weeklyRetentionWeeks,
      ),
      monthlyRetentionMonths: positiveInt(
        input.monthlyRetentionMonths,
        current.monthlyRetentionMonths,
      ),
    },
  });
}

function formatBackupTimestamp(date: Date) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" }).toLowerCase();
  return `${hour12}-${minutes}_${ampm}__${day}-${month}-${date.getFullYear()}`;
}

function backupFilename(type: BackupType, date: Date) {
  const suffix = type === "json" ? "image-data.json" : "database.sql";
  return `${formatBackupTimestamp(date)}__${suffix}`;
}

function backupKey(
  basePrefix: string,
  period: BackupPeriod,
  type: BackupType,
  filename: string,
) {
  return `${cleanPrefix(basePrefix)}/${period}/${type}/${filename}`;
}

function startOfIsoWeek(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  const day = copy.getDay() || 7;
  copy.setDate(copy.getDate() - day + 1);
  return copy;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

async function periodsForSnapshot(type: BackupType, now: Date) {
  const periods: BackupPeriod[] = ["daily"];
  const [weeklyCount, monthlyCount] = await Promise.all([
    prisma.backupRecord.count({
      where: {
        type,
        period: "weekly",
        status: "success",
        completedAt: { gte: startOfIsoWeek(now) },
      },
    }),
    prisma.backupRecord.count({
      where: {
        type,
        period: "monthly",
        status: "success",
        completedAt: { gte: startOfMonth(now) },
      },
    }),
  ]);

  if (weeklyCount === 0) periods.push("weekly");
  if (monthlyCount === 0) periods.push("monthly");
  return periods;
}

async function exportImageMetadataJson(): Promise<Buffer> {
  const [applications, images, imageApplications, imageVariants] =
    await Promise.all([
      prisma.application.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.image.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.imageApplication.findMany({ orderBy: { linkedAt: "asc" } }),
      prisma.imageVariant.findMany({ orderBy: { createdAt: "asc" } }),
    ]);

  const payload: BackupJsonPayload = {
    schemaVersion: JSON_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    counts: {
      applications: applications.length,
      images: images.length,
      imageApplications: imageApplications.length,
      imageVariants: imageVariants.length,
    },
    applications: applications.map((app) => ({
      ...app,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    })),
    images: images.map((image) => ({
      ...image,
      createdAt: image.createdAt.toISOString(),
      updatedAt: image.updatedAt.toISOString(),
    })),
    imageApplications: imageApplications.map((link) => ({
      ...link,
      linkedAt: link.linkedAt.toISOString(),
      updatedAt: link.updatedAt.toISOString(),
    })),
    imageVariants: imageVariants.map((variant) => ({
      ...variant,
      createdAt: variant.createdAt.toISOString(),
    })),
  };

  return Buffer.from(JSON.stringify(payload, null, 2));
}

async function runPgDump(): Promise<Buffer> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for SQL backups");
  }

  return new Promise((resolve, reject) => {
    const child = spawn("pg_dump", [
      "--dbname",
      databaseUrl,
      "--format=plain",
      "--no-owner",
      "--no-privileges",
    ]);
    const chunks: Buffer[] = [];
    const errorChunks: Buffer[] = [];

    child.stdout.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    child.stderr.on("data", (chunk) => errorChunks.push(Buffer.from(chunk)));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(Buffer.concat(chunks));
        return;
      }
      const message = Buffer.concat(errorChunks).toString().trim();
      reject(new Error(message || `pg_dump exited with code ${code}`));
    });
  });
}

async function acquireBackupLock(name: string, ttlMs = 30 * 60 * 1000) {
  const owner = crypto.randomUUID();
  const now = new Date();
  const lockedUntil = new Date(now.getTime() + ttlMs);

  const updated = await prisma.backupLock.updateMany({
    where: {
      name,
      lockedUntil: { lt: now },
    },
    data: { owner, lockedUntil, lockedAt: now },
  });
  if (updated.count > 0) return owner;

  try {
    await prisma.backupLock.create({
      data: { name, owner, lockedUntil },
    });
    return owner;
  } catch {
    return null;
  }
}

async function releaseBackupLock(name: string, owner: string) {
  await prisma.backupLock.deleteMany({ where: { name, owner } });
}

async function createSnapshotBuffer(type: BackupType) {
  return type === "json" ? exportImageMetadataJson() : runPgDump();
}

export async function createBackupSnapshot(
  type: BackupType,
  trigger: BackupTrigger,
  createdByUserId?: string,
) {
  const lockName = `backup:${type}`;
  const owner = await acquireBackupLock(lockName);
  if (!owner) {
    throw new Error(`${type.toUpperCase()} backup is already running`);
  }

  try {
    const backupConfig = await ensureBackupConfig();
    if (!backupConfig.enabled) {
      throw new Error("Backups are disabled");
    }

    const now = new Date();
    const periods = await periodsForSnapshot(type, now);
    const filename = backupFilename(type, now);
    const records = await Promise.all(
      periods.map((period) =>
        prisma.backupRecord.create({
          data: {
            type,
            period,
            status: "running",
            trigger,
            filename,
            storageKey: backupKey(
              backupConfig.basePrefix,
              period,
              type,
              filename,
            ),
            createdByUserId,
            startedAt: now,
          },
        }),
      ),
    );

    try {
      const buffer = await createSnapshotBuffer(type);
      const storage = getStorage();
      const contentType =
        type === "json" ? "application/json" : "application/sql";

      await Promise.all(
        records.map(async (record) => {
          if (!record.storageKey) return;
          await storage.put(record.storageKey, buffer, { contentType });
          await prisma.backupRecord.update({
            where: { id: record.id },
            data: {
              status: "success",
              sizeBytes: buffer.byteLength,
              completedAt: new Date(),
              metadata: {
                periods,
                schemaVersion: type === "json" ? JSON_SCHEMA_VERSION : null,
              },
            },
          });
        }),
      );

      await prisma.backupConfig.update({
        where: { id: CONFIG_ID },
        data:
          type === "json"
            ? { lastJsonBackupAt: now }
            : { lastSqlBackupAt: now },
      });

      await cleanupOldBackups();

      return prisma.backupRecord.findMany({
        where: { id: { in: records.map((record) => record.id) } },
        orderBy: { createdAt: "asc" },
      });
    } catch (error) {
      await Promise.all(
        records.map((record) =>
          prisma.backupRecord.update({
            where: { id: record.id },
            data: {
              status: "failed",
              errorMessage:
                error instanceof Error ? error.message : "Unknown backup error",
              completedAt: new Date(),
            },
          }),
        ),
      );
      throw error;
    }
  } finally {
    await releaseBackupLock(lockName, owner);
  }
}

function subtractRetention(period: BackupPeriod, row: BackupConfigRow) {
  const cutoff = new Date();
  if (period === "daily") {
    cutoff.setDate(cutoff.getDate() - row.dailyRetentionDays);
  } else if (period === "weekly") {
    cutoff.setDate(cutoff.getDate() - row.weeklyRetentionWeeks * 7);
  } else {
    cutoff.setMonth(cutoff.getMonth() - row.monthlyRetentionMonths);
  }
  return cutoff;
}

export async function cleanupOldBackups() {
  const backupConfig = await ensureBackupConfig();
  const storage = getStorage();
  const periods: BackupPeriod[] = ["daily", "weekly", "monthly"];

  for (const period of periods) {
    const oldRecords = await prisma.backupRecord.findMany({
      where: {
        period,
        completedAt: { lt: subtractRetention(period, backupConfig) },
      },
    });

    for (const record of oldRecords) {
      if (record.storageKey) {
        await storage.delete(record.storageKey);
      }
      await prisma.backupRecord.delete({ where: { id: record.id } });
    }
  }
}

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function assertBackupPayload(value: unknown): BackupJsonPayload {
  if (!value || typeof value !== "object") {
    throw new Error("Backup JSON must be an object");
  }
  const payload = value as BackupJsonPayload;
  if (payload.schemaVersion !== JSON_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported backup schema version: ${payload.schemaVersion}`,
    );
  }
  for (const key of [
    "applications",
    "images",
    "imageApplications",
    "imageVariants",
  ] as const) {
    if (!Array.isArray(payload[key])) {
      throw new Error(`Backup JSON is missing ${key}`);
    }
  }
  return payload;
}

export async function syncImageMetadataFromBackup(recordId: string) {
  const record = await prisma.backupRecord.findUnique({
    where: { id: recordId },
  });
  if (
    !record ||
    record.type !== "json" ||
    record.status !== "success" ||
    !record.storageKey
  ) {
    throw new Error("A successful JSON backup is required for sync");
  }

  const data = await getStorage().get(record.storageKey);
  if (!data) {
    throw new Error("Backup file was not found in storage");
  }

  const payload = assertBackupPayload(JSON.parse(data.toString("utf8")));
  const result = {
    applications: 0,
    images: 0,
    imageVariants: 0,
    imageApplications: 0,
  };

  await prisma.$transaction(async (tx) => {
    for (const app of payload.applications) {
      await tx.application.upsert({
        where: { id: app.id },
        create: {
          id: app.id,
          name: app.name,
          slug: app.slug,
          ownerId: app.ownerId,
          storageDir: app.storageDir,
          createdAt: parseDate(app.createdAt),
          updatedAt: parseDate(app.updatedAt),
        },
        update: {
          name: app.name,
          slug: app.slug,
          ownerId: app.ownerId,
          storageDir: app.storageDir,
        },
      });
      result.applications += 1;
    }

    for (const image of payload.images) {
      await tx.image.upsert({
        where: { id: image.id },
        create: {
          id: image.id,
          filename: image.filename,
          contentType: image.contentType,
          sizeBytes: image.sizeBytes,
          width: image.width,
          height: image.height,
          hash: image.hash,
          createdAt: parseDate(image.createdAt),
          updatedAt: parseDate(image.updatedAt),
        },
        update: {
          filename: image.filename,
          contentType: image.contentType,
          sizeBytes: image.sizeBytes,
          width: image.width,
          height: image.height,
          hash: image.hash,
        },
      });
      result.images += 1;
    }

    for (const variant of payload.imageVariants) {
      await tx.imageVariant.upsert({
        where: { id: variant.id },
        create: {
          id: variant.id,
          imageId: variant.imageId,
          label: variant.label,
          filename: variant.filename,
          width: variant.width,
          height: variant.height,
          sizeBytes: variant.sizeBytes,
          createdAt: parseDate(variant.createdAt),
        },
        update: {
          imageId: variant.imageId,
          label: variant.label,
          filename: variant.filename,
          width: variant.width,
          height: variant.height,
          sizeBytes: variant.sizeBytes,
        },
      });
      result.imageVariants += 1;
    }

    for (const link of payload.imageApplications) {
      await tx.imageApplication.upsert({
        where: { id: link.id },
        create: {
          id: link.id,
          imageId: link.imageId,
          applicationId: link.applicationId,
          originalName: link.originalName,
          tags: link.tags as never,
          linkedAt: parseDate(link.linkedAt),
          updatedAt: parseDate(link.updatedAt),
        },
        update: {
          imageId: link.imageId,
          applicationId: link.applicationId,
          originalName: link.originalName,
          tags: link.tags as never,
        },
      });
      result.imageApplications += 1;
    }
  });

  return result;
}

export async function deleteBackupRecord(recordId: string) {
  const record = await prisma.backupRecord.findUnique({
    where: { id: recordId },
  });
  if (!record) {
    throw new Error("Backup record not found");
  }
  if (record.storageKey) {
    await getStorage().delete(record.storageKey);
  }
  await prisma.backupRecord.delete({ where: { id: recordId } });
  return { deleted: true };
}

export async function runDueBackups() {
  const backupConfig = await ensureBackupConfig();
  if (!backupConfig.enabled) return { ran: false, reason: "disabled" };

  const now = Date.now();
  const jobs: BackupType[] = [];
  if (
    !backupConfig.lastJsonBackupAt ||
    now - backupConfig.lastJsonBackupAt.getTime() >=
      backupConfig.jsonIntervalMinutes * 60 * 1000
  ) {
    jobs.push("json");
  }
  if (
    !backupConfig.lastSqlBackupAt ||
    now - backupConfig.lastSqlBackupAt.getTime() >=
      backupConfig.sqlIntervalMinutes * 60 * 1000
  ) {
    jobs.push("sql");
  }

  const results = [];
  for (const type of jobs) {
    try {
      const records = await createBackupSnapshot(type, "scheduled");
      results.push({ type, ok: true, count: records.length });
    } catch (error) {
      console.error(`Scheduled ${type} backup failed:`, error);
      results.push({
        type,
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return { ran: jobs.length > 0, results };
}

export async function listBackups() {
  const [backupConfig, backups] = await Promise.all([
    ensureBackupConfig(),
    prisma.backupRecord.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  return {
    config: serializeBackupConfig(backupConfig),
    backups: backups.map((backup) => ({
      ...backup,
      startedAt: backup.startedAt.toISOString(),
      completedAt: toIso(backup.completedAt),
      createdAt: backup.createdAt.toISOString(),
      updatedAt: backup.updatedAt.toISOString(),
    })),
  };
}
