import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { tenantStoragePath } from "@/config";
import { protect } from "@/features/auth/guard";
import { prisma } from "@/lib/prisma";
import { requireOwnedApplication, sessionApi } from "@/lib/session-api";
import {
  assertLocationAccess,
  withOwnerStorageLock,
} from "@/lib/storage/locations";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const { id } = await context.params;
    const application = await prisma.application.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
      include: {
        _count: {
          select: {
            imageApplications: true,
            apiKeys: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      application: {
        ...application,
        storageDir: tenantStoragePath(application.slug),
      },
    });
  } catch (error) {
    console.error("List applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

export function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return sessionApi(async () => {
    const { id } = await context.params,
      { user } = await requireOwnedApplication(request, id);
    const input = z
      .object({
        name: z.string().trim().min(1).max(100),
        defaultStorageLocationId: z.string().optional(),
      })
      .parse(await request.json());
    return withOwnerStorageLock(user.id, async () => {
      if (input.defaultStorageLocationId)
        if (input.defaultStorageLocationId !== "default")
          await assertLocationAccess(user.id, input.defaultStorageLocationId);
      const application = await prisma.application.update({
        where: { id },
        data: input,
        include: {
          _count: { select: { imageApplications: true, apiKeys: true } },
        },
      });
      return NextResponse.json({
        application: {
          ...application,
          storageDir: tenantStoragePath(application.slug),
        },
      });
    });
  });
}
