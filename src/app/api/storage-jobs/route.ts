import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession, sessionApi } from "@/lib/session-api";
import { boundedJSON, checkStorageOrigin } from "@/lib/storage/manager";
import { createTransfer } from "@/lib/storage/transfers";
export function GET(request: Request) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    const cursor = z
      .string()
      .max(255)
      .optional()
      .parse(new URL(request.url).searchParams.get("cursor") ?? undefined);
    const jobs = await prisma.storageJob.findMany({
      where: { ownerId: user.id },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 26,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    const page = jobs.slice(0, 25);
    const totals = await prisma.storageJobItem.groupBy({
      by: ["jobId", "status"],
      where: { jobId: { in: page.map((job) => job.id) }, kind: "file" },
      _count: true,
      _sum: { sizeBytes: true },
    });
    const entries = page.map((job) => {
      const counts = totals.filter((total) => total.jobId === job.id);
      const payload = job.payload as {
        source?: string;
        target?: string;
        operation?: string;
        image?: { filename: string };
        raw?: { key: string };
        backupJobId?: string;
      };
      return {
        id: job.id,
        kind: job.kind,
        status: job.status,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        attempts: job.attempts,
        error: job.error,
        scanned: job.scanned,
        phase: (job.cursor as { phase?: string } | null)?.phase,
        counts,
        source: payload.source,
        target: payload.target,
        operation: payload.operation,
        name:
          payload.image?.filename ?? payload.raw?.key ?? payload.backupJobId,
      };
    });
    return Response.json(
      {
        jobs: entries,
        nextCursor: jobs.length > 25 ? page.at(-1)?.id : undefined,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  });
}
export function POST(request: Request) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    checkStorageOrigin(request);
    const job = await createTransfer(user, await boundedJSON(request));
    return Response.json(
      { id: job.id },
      { status: 202, headers: { "Cache-Control": "private, no-store" } },
    );
  });
}
