-- Create ImageApplication junction table
CREATE TABLE "ImageApplication" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "tags" JSONB,
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageApplication_pkey" PRIMARY KEY ("id")
);

-- Backfill hash from filename where missing (strip extension)
UPDATE "Image"
SET "hash" = regexp_replace("filename", '\.[^.]+$', '')
WHERE "hash" IS NULL OR "hash" = '';

-- Backfill junction rows from existing Image records
INSERT INTO "ImageApplication" ("id", "imageId", "applicationId", "originalName", "tags", "linkedAt", "updatedAt")
SELECT
    md5("id" || "applicationId"),
    "id",
    "applicationId",
    "originalName",
    "tags",
    "createdAt",
    "updatedAt"
FROM "Image";

-- Identify canonical (oldest) and duplicate images per hash
CREATE TEMP TABLE "_image_dedup" AS
SELECT
    i."id" AS duplicate_id,
    c.canonical_id
FROM "Image" i
JOIN (
    SELECT DISTINCT ON ("hash") "id" AS canonical_id, "hash"
    FROM "Image"
    ORDER BY "hash", "createdAt" ASC
) c ON i."hash" = c."hash"
WHERE i."id" != c.canonical_id;

-- Drop junction rows for duplicates when canonical already links the same app
DELETE FROM "ImageApplication" ia
USING "_image_dedup" d
WHERE ia."imageId" = d.duplicate_id
  AND EXISTS (
    SELECT 1
    FROM "ImageApplication" ia2
    WHERE ia2."imageId" = d.canonical_id
      AND ia2."applicationId" = ia."applicationId"
  );

-- Re-point remaining junction rows to canonical image
UPDATE "ImageApplication" ia
SET "imageId" = d.canonical_id
FROM "_image_dedup" d
WHERE ia."imageId" = d.duplicate_id;

-- Delete duplicate Image rows (variants cascade)
DELETE FROM "Image" i
USING "_image_dedup" d
WHERE i."id" = d.duplicate_id;

DROP TABLE "_image_dedup";

-- Drop FK and columns from Image
ALTER TABLE "Image" DROP CONSTRAINT "Image_applicationId_fkey";
ALTER TABLE "Image" DROP COLUMN "applicationId";
ALTER TABLE "Image" DROP COLUMN "originalName";
ALTER TABLE "Image" DROP COLUMN "tags";

-- Enforce hash uniqueness and NOT NULL
ALTER TABLE "Image" ALTER COLUMN "hash" SET NOT NULL;
CREATE UNIQUE INDEX "Image_hash_key" ON "Image"("hash");

-- Junction indexes and FKs
CREATE UNIQUE INDEX "ImageApplication_imageId_applicationId_key" ON "ImageApplication"("imageId", "applicationId");
CREATE INDEX "ImageApplication_applicationId_updatedAt_idx" ON "ImageApplication"("applicationId", "updatedAt" DESC);

ALTER TABLE "ImageApplication" ADD CONSTRAINT "ImageApplication_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ImageApplication" ADD CONSTRAINT "ImageApplication_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
