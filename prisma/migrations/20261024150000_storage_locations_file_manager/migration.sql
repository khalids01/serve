-- DropIndex
DROP INDEX "Image_hash_key";

-- DropIndex
DROP INDEX "ImageApplication_imageId_applicationId_key";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "defaultStorageLocationId" TEXT NOT NULL DEFAULT 'default';

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "ownerId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "storageConfig" JSONB,
ADD COLUMN     "storageLocationId" TEXT NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE "ImageApplication" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "folderId" TEXT,
ADD COLUMN     "starred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trashBatchId" TEXT;

-- CreateTable
CREATE TABLE "StorageConnection" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 's3',
    "endpoint" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'auto',
    "forcePathStyle" BOOLEAN NOT NULL DEFAULT true,
    "encryptedCredentials" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "trashBatchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StorageConnection_ownerId_idx" ON "StorageConnection"("ownerId");

-- CreateIndex
CREATE INDEX "Folder_applicationId_parentId_deletedAt_idx" ON "Folder"("applicationId", "parentId", "deletedAt");

-- CreateIndex
CREATE INDEX "Image_ownerId_storageLocationId_idx" ON "Image"("ownerId", "storageLocationId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_storageLocationId_hash_key" ON "Image"("storageLocationId", "hash");

-- CreateIndex
CREATE INDEX "ImageApplication_imageId_applicationId_idx" ON "ImageApplication"("imageId", "applicationId");

-- CreateIndex
CREATE INDEX "ImageApplication_applicationId_folderId_deletedAt_idx" ON "ImageApplication"("applicationId", "folderId", "deletedAt");

-- AddForeignKey
ALTER TABLE "ImageApplication" ADD CONSTRAINT "ImageApplication_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
