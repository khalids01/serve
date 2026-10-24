import { NextResponse } from "next/server";
import { processImageUpload } from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";
import { error, preflight, withAuth } from "@/lib/v1-api";
import {
  linkedFile,
  listQuery,
  serializeFile,
  v1ImageInclude,
} from "@/lib/v1-files";
import { parseUpload, UploadValidationError } from "@/lib/v1-upload";
export const runtime = "nodejs";
export const OPTIONS = preflight;
export const GET = withAuth("files:read", async (request, auth) => {
  let query: ReturnType<typeof listQuery>;
  try {
    query = listQuery(request.nextUrl.searchParams, auth.applicationId);
  } catch {
    return error("INVALID_QUERY", "Invalid file filter or pagination.", 400);
  }
  const {
    input: { page, limit },
    where,
    orderBy,
  } = query;
  const [links, total] = await prisma.$transaction(
    [
      prisma.imageApplication.findMany({
        where,
        include: { image: { include: v1ImageInclude } },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.imageApplication.count({ where }),
    ],
    { isolationLevel: "RepeatableRead" },
  );
  const pages = Math.ceil(total / limit);
  return NextResponse.json({
    data: links.map(serializeFile),
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  });
});
export const POST = withAuth("files:write", async (request, auth) => {
  try {
    const input = await parseUpload(request);
    if (input.saveMode !== null)
      return error(
        "INVALID_UPLOAD",
        "saveMode is only accepted by the crop endpoint.",
        400,
      );
    const result = await processImageUpload(
      input.buffer,
      input.filename,
      input.contentType,
      auth.applicationId,
      input.tags,
    );
    const link = await linkedFile(result.entryId, auth.applicationId);
    if (!link) throw new Error("Upload link disappeared");
    return NextResponse.json({ data: serializeFile(link) }, { status: 201 });
  } catch (cause) {
    if (cause instanceof UploadValidationError)
      return error(cause.code, cause.message, cause.status);
    throw cause;
  }
});
