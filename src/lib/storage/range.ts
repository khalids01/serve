import type { StorageByteRange } from "./backend";
export function parseRange(
  header: string | null,
  size: number,
): StorageByteRange | "invalid" | undefined {
  if (!header) return undefined;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || (!match[1] && !match[2]) || size <= 0) return "invalid";
  if (!match[1]) {
    const length = Number(match[2]);
    return Number.isSafeInteger(length) && length > 0
      ? { start: Math.max(0, size - length), end: size - 1 }
      : "invalid";
  }
  const start = Number(match[1]);
  const end = match[2] ? Number(match[2]) : size - 1;
  return Number.isSafeInteger(start) &&
    Number.isSafeInteger(end) &&
    start >= 0 &&
    start < size &&
    end >= start
    ? { start, end: Math.min(end, size - 1) }
    : "invalid";
}
