import { type NextRequest, NextResponse } from "next/server";
import { getLegacyTenantKeys, imageInclude } from "@/lib/image-response";
import { prisma } from "@/lib/prisma";
import type { StorageByteRange } from "@/lib/storage/backend";
import { getStorage } from "@/lib/storage/factory";
import { openBlobFileWithLegacy } from "@/lib/storage/read";

export const runtime = "nodejs";

type ParsedRange = StorageByteRange | "invalid" | undefined;

function parseRange(header: string | null, size: number): ParsedRange {
  if (!header) return undefined;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || (!match[1] && !match[2]) || size <= 0) return "invalid";

  if (!match[1]) {
    const suffixLength = Number(match[2]);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0)
      return "invalid";
    return { start: Math.max(0, size - suffixLength), end: size - 1 };
  }

  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : size - 1;
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(requestedEnd) ||
    start < 0 ||
    start >= size ||
    requestedEnd < start
  ) {
    return "invalid";
  }

  return { start, end: Math.min(requestedEnd, size - 1) };
}

function contentHeaders(file: {
  contentType: string;
  sizeBytes: number;
  hash: string;
}) {
  return {
    "Accept-Ranges": "bytes",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Type": file.contentType || "application/octet-stream",
    ETag: `"${file.hash}"`,
    "X-Content-Type-Options": "nosniff",
  };
}

async function findFile(id: string) {
  return prisma.image.findUnique({
    where: { id },
    include: imageInclude,
  });
}

export async function HEAD(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const file = await findFile(id);
  if (!file) return new NextResponse(null, { status: 404 });

  return new NextResponse(null, {
    headers: {
      ...contentHeaders(file),
      "Content-Length": String(file.sizeBytes),
    },
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const file = await findFile(id);
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const range = parseRange(request.headers.get("range"), file.sizeBytes);
    if (range === "invalid") {
      return new NextResponse(null, {
        status: 416,
        headers: {
          ...contentHeaders(file),
          "Content-Range": `bytes */${file.sizeBytes}`,
        },
      });
    }

    const storage = getStorage();
    const opened = await openBlobFileWithLegacy(
      storage,
      file.filename,
      getLegacyTenantKeys(file),
      range,
    );
    if (!opened) {
      return NextResponse.json(
        { error: "Stored file not found" },
        { status: 404 },
      );
    }

    const headers = new Headers(contentHeaders(file));
    headers.set("Content-Length", String(opened.contentLength));
    if (range) {
      headers.set(
        "Content-Range",
        opened.contentRange ??
          `bytes ${range.start}-${range.end}/${file.sizeBytes}`,
      );
    }

    return new Response(opened.body, {
      status: range ? 206 : 200,
      headers,
    });
  } catch (error) {
    console.error("File stream error:", error);
    return NextResponse.json(
      { error: "Failed to stream file" },
      { status: 500 },
    );
  }
}
