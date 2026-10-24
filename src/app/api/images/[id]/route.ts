import { type NextRequest, NextResponse } from "next/server";
import { protect } from "@/features/auth/guard";
import { purgeFileEntry } from "@/lib/file-deletion";
import {
  appIsLinkedToImage,
  formatImageResponse,
  imageInclude,
  userOwnsLinkedImage,
} from "@/lib/image-response";
import { prisma } from "@/lib/prisma";
import { sessionApi } from "@/lib/session-api";
import {
  StorageLocationError,
  withOwnerStorageLock,
} from "@/lib/storage/locations";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;
    const { user, application: authApp } = auth;

    const { id } = await context.params;
    const image = await prisma.image.findUnique({
      where: { id },
      include: imageInclude,
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    if (authApp) {
      const linked = await appIsLinkedToImage(id, authApp.id);
      if (!linked) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    } else {
      const owns = await userOwnsLinkedImage(id, user.id);
      if (!owns) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    return NextResponse.json(formatImageResponse(image, authApp?.id));
  } catch (error) {
    console.error("Get image error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 },
    );
  }
}

export function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return sessionApi(async () => {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;
    const { id } = await context.params;
    const applicationId =
      auth.application?.id ?? request.nextUrl.searchParams.get("applicationId");
    const entry = await prisma.imageApplication.findFirst({
      where: {
        OR: [{ id }, { imageId: id }],
        ...(applicationId ? { applicationId } : {}),
        application: { ownerId: auth.user.id },
      },
      select: { id: true, applicationId: true },
    });
    if (!entry) throw new StorageLocationError("File not found.", 404);
    return withOwnerStorageLock(auth.user.id, async () =>
      NextResponse.json({
        success: true,
        ...(await purgeFileEntry(entry.id, entry.applicationId)),
      }),
    );
  });
}
