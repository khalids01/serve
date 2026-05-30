import fs from "fs/promises";
import path from "path";
import { config } from "@/config";

export function resolveBaseUploadDir(
  baseUploadDir = config.storage.local.uploadDir,
) {
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
