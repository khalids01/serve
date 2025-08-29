import { createHash } from "crypto";

export function contentHash16(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex").substring(0, 16);
}
