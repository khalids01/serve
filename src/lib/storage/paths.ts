import fs from "fs/promises";
import path from "path";
import { env } from "@/env";

export function resolveBaseUploadDir(baseUploadDir = env.UPLOAD_DIR || "uploads") {
  const dir = baseUploadDir;
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
}

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export function getAppDir(baseAbsDir: string, applicationKey: string) {
  return path.join(baseAbsDir, applicationKey);
}
