import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession, sessionApi } from "@/lib/session-api";
import { importStorageItems } from "@/lib/storage/import";
import { boundedJSON, checkStorageOrigin } from "@/lib/storage/manager";
export const runtime = "nodejs";
export function GET(request: Request) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    const query = z
      .object({
        q: z.string().max(100).default(""),
        cursor: z.string().max(255).optional(),
      })
      .parse(Object.fromEntries(new URL(request.url).searchParams));
    const applications = await prisma.application.findMany({
      where: {
        ownerId: user.id,
        ...(query.q
          ? { name: { contains: query.q, mode: "insensitive" } }
          : {}),
      },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      take: 26,
      select: { id: true, name: true, slug: true },
    });
    return Response.json(
      {
        applications: applications.slice(0, 25),
        nextCursor: applications.length > 25 ? applications[24].id : undefined,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  });
}
export function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    checkStorageOrigin(request);
    const { id } = await context.params;
    const result = await importStorageItems(
      user,
      id,
      await boundedJSON(request),
    );
    return Response.json(result, {
      headers: { "Cache-Control": "private, no-store" },
    });
  });
}
