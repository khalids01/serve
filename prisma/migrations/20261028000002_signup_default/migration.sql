-- Allow registration on a fresh installation; preserve any administrator's saved choice.
ALTER TABLE "AuthSettings" ALTER COLUMN "signupEnabled" SET DEFAULT true;
