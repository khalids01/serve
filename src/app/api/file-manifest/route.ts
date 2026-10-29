import { prisma } from "@/lib/prisma";
import { requireSession, sessionApi } from "@/lib/session-api";
export function GET(request: Request) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    const applications = await prisma.application.findMany({
      where: { ownerId: user.id },
      select: {
        id: true,
        name: true,
        slug: true,
        defaultStorageLocationId: true,
      },
    });
    const encoder = new TextEncoder();
    let phase: "files" | "folders" = "files",
      cursor: string | undefined,
      first = true,
      cancelled = false;
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              schemaVersion: 1,
              exportedAt: new Date().toISOString(),
              applications,
            }).slice(0, -1) + ',"files":[',
          ),
        );
      },
      async pull(controller) {
        if (cancelled || request.signal.aborted) {
          controller.close();
          return;
        }
        try {
          const page =
            phase === "files"
              ? await prisma.imageApplication.findMany({
                  where: { application: { ownerId: user.id } },
                  include: { image: { include: { variants: true } } },
                  orderBy: { id: "asc" },
                  take: 100,
                  ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
                })
              : await prisma.folder.findMany({
                  where: { application: { ownerId: user.id } },
                  orderBy: { id: "asc" },
                  take: 100,
                  ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
                });
          if (cancelled) return;
          if (!page.length) {
            if (phase === "files") {
              controller.enqueue(encoder.encode('],"folders":['));
              phase = "folders";
              cursor = undefined;
              first = true;
            } else {
              controller.enqueue(encoder.encode("]}"));
              controller.close();
            }
            return;
          }
          controller.enqueue(
            encoder.encode(
              (first ? "" : ",") +
                page.map((entry) => JSON.stringify(entry)).join(","),
            ),
          );
          first = false;
          cursor = page.at(-1)?.id;
        } catch (error) {
          if (!cancelled) controller.error(error);
        }
      },
      cancel() {
        cancelled = true;
      },
    });
    return new Response(body, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition":
          'attachment; filename="serve-file-metadata.json"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  });
}
