import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { tenantStoragePath } from "@/config";
import { protect } from "@/features/auth/guard";
import { prisma } from "@/lib/prisma";
import { requireSession, sessionApi } from "@/lib/session-api";
import {
  assertLocationAccess,
  StorageLocationError,
  withOwnerStorageLock,
} from "@/lib/storage/locations";

export async function GET(request: NextRequest) {
  try {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const applications = await prisma.application.findMany({
      where: {
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

    const appsWithComputedDir = applications.map((app) => ({
      ...app,
      storageDir: tenantStoragePath(app.slug),
    }));

    return NextResponse.json({ applications: appsWithComputedDir });
  } catch (error) {
    console.error("List applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    const body = z
      .object({
        name: z.string().trim().min(1).max(100),
        slug: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
          .max(100),
        defaultStorageLocationId: z.string().default("default"),
      })
      .parse(await request.json());
    return withOwnerStorageLock(user.id, async () => {
      if (body.defaultStorageLocationId !== "default")
        await assertLocationAccess(user.id, body.defaultStorageLocationId);
      if (await prisma.application.findUnique({ where: { slug: body.slug } }))
        throw new StorageLocationError("Slug already exists.", 409);
      const application = await prisma.application.create({
        data: {
          ...body,
          ownerId: user.id,
          storageDir: tenantStoragePath(body.slug),
        },
      });
      return NextResponse.json({ application }, { status: 201 });
    });
  });
}
