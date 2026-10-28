import { type NextRequest, NextResponse } from "next/server";
import { getLegacyTenantKeys, imageInclude } from "@/lib/image-response";
import { prisma } from "@/lib/prisma";
import { getStorageForImage } from "@/lib/storage/locations";
import { parseRange } from "@/lib/storage/range";
import { openBlobFileWithLegacy } from "@/lib/storage/read";

export const runtime = "nodejs";

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
  const entry = await prisma.imageApplication.findUnique({
    where: { id },
    include: { image: { include: imageInclude } },
  });
  if (entry) return { ...entry.image, downloadName: entry.originalName };
  const image = await prisma.image.findUnique({
    where: { id },
    include: imageInclude,
  });
  return image ? { ...image, downloadName: image.filename } : null;
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

    const storage = await getStorageForImage(file);
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
    if (request.nextUrl.searchParams.get("download") === "1")
      headers.set(
        "Content-Disposition",
        `attachment; filename="${file.downloadName.replace(/[^a-zA-Z0-9._-]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(file.downloadName).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16)}`)}`,
      );
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
