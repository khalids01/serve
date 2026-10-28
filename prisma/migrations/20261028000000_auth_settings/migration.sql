CREATE TABLE "AuthSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "signupEnabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuthSettings_pkey" PRIMARY KEY ("id")
);
