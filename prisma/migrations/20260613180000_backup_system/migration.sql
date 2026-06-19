-- CreateEnum
CREATE TYPE "BackupType" AS ENUM ('json', 'sql');

-- CreateEnum
CREATE TYPE "BackupPeriod" AS ENUM ('daily', 'weekly', 'monthly');

-- CreateEnum
CREATE TYPE "BackupStatus" AS ENUM ('running', 'success', 'failed');

-- CreateEnum
CREATE TYPE "BackupTrigger" AS ENUM ('manual', 'scheduled');

-- CreateTable
CREATE TABLE "BackupConfig" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "enabled" BOOLEAN NOT NULL,
    "basePrefix" TEXT NOT NULL,
    "jsonIntervalMinutes" INTEGER NOT NULL,
    "sqlIntervalMinutes" INTEGER NOT NULL,
    "schedulerIntervalMinutes" INTEGER NOT NULL,
    "dailyRetentionDays" INTEGER NOT NULL,
    "weeklyRetentionWeeks" INTEGER NOT NULL,
    "monthlyRetentionMonths" INTEGER NOT NULL,
    "lastJsonBackupAt" TIMESTAMP(3),
    "lastSqlBackupAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackupConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackupRecord" (
    "id" TEXT NOT NULL,
    "type" "BackupType" NOT NULL,
    "period" "BackupPeriod" NOT NULL,
    "status" "BackupStatus" NOT NULL,
    "trigger" "BackupTrigger" NOT NULL,
    "storageKey" TEXT,
    "filename" TEXT NOT NULL,
    "sizeBytes" INTEGER,
    "errorMessage" TEXT,
    "createdByUserId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackupRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackupLock" (
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "lockedUntil" TIMESTAMP(3) NOT NULL,
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackupLock_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE INDEX "BackupRecord_type_status_completedAt_idx" ON "BackupRecord"("type", "status", "completedAt");

-- CreateIndex
CREATE INDEX "BackupRecord_period_completedAt_idx" ON "BackupRecord"("period", "completedAt");
