-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ImageVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImageVariant_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ImageVariant" ("createdAt", "filename", "height", "id", "imageId", "label", "sizeBytes", "width") SELECT "createdAt", "filename", "height", "id", "imageId", "label", "sizeBytes", "width" FROM "ImageVariant";
DROP TABLE "ImageVariant";
ALTER TABLE "new_ImageVariant" RENAME TO "ImageVariant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
