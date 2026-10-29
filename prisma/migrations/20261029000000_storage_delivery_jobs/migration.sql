-- AlterTable
ALTER TABLE "StorageConnection" ADD COLUMN     "deliveryMode" TEXT NOT NULL DEFAULT 'proxy';

-- DropTable
DROP TABLE "BackupConfig";

-- DropTable
DROP TABLE "BackupRecord";

-- DropTable
DROP TABLE "BackupLock";

-- DropEnum
DROP TYPE "BackupType";

-- DropEnum
DROP TYPE "BackupPeriod";

-- DropEnum
DROP TYPE "BackupStatus";

-- DropEnum
DROP TYPE "BackupTrigger";

-- CreateTable
CREATE TABLE "StorageSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "defaultUploadDestinationId" TEXT NOT NULL DEFAULT 'default',
    "defaultDeliveryMode" TEXT NOT NULL DEFAULT 'proxy',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StorageSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoragePreference" (
    "ownerId" TEXT NOT NULL,
    "localBackupConnectionId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoragePreference_pkey" PRIMARY KEY ("ownerId")
);

-- CreateTable
CREATE TABLE "StorageJob" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "payload" JSONB NOT NULL,
    "cursor" JSONB,
    "scanned" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseUntil" TIMESTAMP(3),
    "leaseToken" TEXT,
    "error" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageJobItem" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "destinationKey" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'file',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "imageId" TEXT,
    "metadata" JSONB,
    "checksum" TEXT,
    "sizeBytes" DOUBLE PRECISION,

    CONSTRAINT "StorageJobItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StorageJob_status_runAt_leaseUntil_idx" ON "StorageJob"("status", "runAt", "leaseUntil");

-- CreateIndex
CREATE INDEX "StorageJob_ownerId_createdAt_idx" ON "StorageJob"("ownerId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "StorageJobItem_jobId_status_id_idx" ON "StorageJobItem"("jobId", "status", "id");

-- CreateIndex
CREATE UNIQUE INDEX "StorageJobItem_jobId_key_key" ON "StorageJobItem"("jobId", "key");

-- AddForeignKey
ALTER TABLE "StorageJobItem" ADD CONSTRAINT "StorageJobItem_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "StorageJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;


CREATE INDEX "StorageJobItem_jobId_status_kind_id_idx" ON "StorageJobItem"("jobId", "status", "kind", "id");

CREATE INDEX "StorageJob_ownerId_kind_status_idx" ON "StorageJob"("ownerId", "kind", "status");
