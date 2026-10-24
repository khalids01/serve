import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
export class StorageSecretError extends Error {}
function keyBytes(value: string) {
  const key = Buffer.from(value, "base64");
  if (key.length !== 32 || key.toString("base64") !== value.trim())
    throw new StorageSecretError(
      "STORAGE_ENCRYPTION_KEY must be a base64-encoded 32-byte key.",
    );
  return key;
}
function keyring() {
  const primary = process.env.STORAGE_ENCRYPTION_KEY;
  if (!primary)
    throw new StorageSecretError(
      "Configure STORAGE_ENCRYPTION_KEY on the Serve host to save S3 connections.",
    );
  return [
    primary,
    ...(process.env.STORAGE_ENCRYPTION_PREVIOUS_KEYS?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? []),
  ].map(keyBytes);
}
function keyId(key: Buffer) {
  return createHash("sha256").update(key).digest("hex").slice(0, 16);
}
export function storageEncryptionReady() {
  try {
    keyring();
    return true;
  } catch {
    return false;
  }
}
export function encryptStorageCredentials(
  credentials: { accessKeyId: string; secretAccessKey: string },
  ownerId: string,
  connectionId: string,
) {
  const key = keyring()[0],
    iv = randomBytes(12),
    cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(`serve-storage:v1:${ownerId}:${connectionId}`));
  const data = Buffer.concat([
    cipher.update(
      JSON.stringify({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      }),
      "utf8",
    ),
    cipher.final(),
  ]);
  return [
    "v1",
    keyId(key),
    iv.toString("base64"),
    cipher.getAuthTag().toString("base64"),
    data.toString("base64"),
  ].join(".");
}
export function decryptStorageCredentials(
  encrypted: string,
  ownerId: string,
  connectionId: string,
): { accessKeyId: string; secretAccessKey: string } {
  const parts = encrypted.split(".");
  if (parts.length !== 5 || parts[0] !== "v1")
    throw new StorageSecretError(
      "Unsupported encrypted storage credential format.",
    );
  const key = keyring().find((key) => keyId(key) === parts[1]);
  if (!key)
    throw new StorageSecretError(
      "The encryption key for this connection is missing. Restore the previous storage key.",
    );
  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(parts[2], "base64"),
    );
    decipher.setAAD(Buffer.from(`serve-storage:v1:${ownerId}:${connectionId}`));
    decipher.setAuthTag(Buffer.from(parts[3], "base64"));
    const result = JSON.parse(
      Buffer.concat([
        decipher.update(Buffer.from(parts[4], "base64")),
        decipher.final(),
      ]).toString("utf8"),
    );
    if (
      typeof result.accessKeyId !== "string" ||
      typeof result.secretAccessKey !== "string"
    )
      throw new Error();
    return {
      accessKeyId: result.accessKeyId,
      secretAccessKey: result.secretAccessKey,
    };
  } catch {
    throw new StorageSecretError(
      "Storage credentials could not be authenticated. Check the encryption keys and connection record.",
    );
  }
}
