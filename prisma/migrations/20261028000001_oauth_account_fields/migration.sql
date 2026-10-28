-- Preserve existing provider/token columns; Prisma maps them to Better Auth's field names.
ALTER TABLE "Account" ALTER COLUMN "type" SET DEFAULT 'oauth';
ALTER TABLE "Account"
    ADD COLUMN "accessTokenExpiresAt" TIMESTAMP(3),
    ADD COLUMN "refreshTokenExpiresAt" TIMESTAMP(3),
    ADD COLUMN "password" TEXT;
UPDATE "Account" SET "accessTokenExpiresAt" = to_timestamp("expires_at") AT TIME ZONE 'UTC'
WHERE "expires_at" IS NOT NULL;
