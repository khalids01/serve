import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { FileStorageService } from '@/lib/file-storage'
import { protect } from '@/features/auth/guard'
import { deleteBlobAndLegacyCacheByBase } from '@/lib/storage/read'
import { getStorage } from '@/lib/storage/factory'
import sharp from 'sharp'
import path from 'path'
import { processImageUpload, imageInclude } from '@/lib/image-upload'
import {
  formatImageResponse,
  getJunctionForApp,
  getLegacyTenantKeys,
  userOwnsLinkedImage,
} from '@/lib/image-response'

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const formData = await request.formData();
    const { id } = await context.params;

    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const croppedFile = formData.get("file") as File;
    const saveMode = formData.get("saveMode") as "new" | "replace";
    const contextApplicationId = formData.get("applicationId") as string | null;

    if (!croppedFile) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const originalImage = await prisma.image.findUnique({
      where: { id },
      include: imageInclude,
    });

    if (!originalImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const owns = await userOwnsLinkedImage(id, user.id);
    if (!owns) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const applicationId =
      contextApplicationId ??
      originalImage.applications[0]?.applicationId;

    if (!applicationId) {
      return NextResponse.json({ error: "Application context required" }, { status: 400 });
    }

    const junction = getJunctionForApp(originalImage, applicationId);
    const fileStorage = new FileStorageService();
    const buffer = Buffer.from(await croppedFile.arrayBuffer());

    const metadata = await sharp(buffer).metadata();
    const { width, height } = metadata;

    if (saveMode === "replace") {
      await fileStorage.putRaw(
        originalImage.filename,
        buffer,
        originalImage.contentType,
      );

      const legacyTenantKeys = getLegacyTenantKeys(originalImage);
      const base = path.parse(originalImage.filename).name;
      await deleteBlobAndLegacyCacheByBase(getStorage(), base, legacyTenantKeys);

      await prisma.image.update({
        where: { id },
        data: {
          width: width || null,
          height: height || null,
          sizeBytes: buffer.length,
        },
      });

      try {
        const userAgent = request.headers.get("user-agent") || undefined;
        const ip =
          (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
          request.headers.get("x-real-ip") ||
          undefined;

        await prisma.auditLog.create({
          data: {
            userId: user.id,
            applicationId,
            action: "UPDATE",
            targetId: originalImage.id,
            ip: ip || undefined,
            userAgent: userAgent || undefined,
            metadata: {
              operation: "crop-replace",
              originalName: junction?.originalName,
              filename: originalImage.filename,
              newDimensions: `${width}x${height}`,
            } as any,
          },
        });
      } catch (e) {
        console.error("Audit log error:", e);
      }

      revalidatePath(`/dashboard/applications/${applicationId}`, 'page');
      revalidatePath('/dashboard/applications', 'layout');

      return NextResponse.json({
        success: true,
        mode: "replace",
        image: {
          id: originalImage.id,
          width,
          height,
        },
      });
    }

    const originalExt = path.extname(originalImage.filename);
    const sourceName = junction?.originalName ?? originalImage.filename;
    const croppedOriginalName = `${path.basename(sourceName, path.extname(sourceName))}_cropped${originalExt}`;

    const result = await processImageUpload(
      buffer,
      croppedOriginalName,
      originalImage.contentType,
      applicationId,
    );

    try {
      const userAgent = request.headers.get("user-agent") || undefined;
      const ip =
        (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        undefined;

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          applicationId,
          action: "UPLOAD",
          targetId: result.id,
          ip: ip || undefined,
          userAgent: userAgent || undefined,
          metadata: {
            operation: "crop-new",
            originalName: result.originalName,
            filename: result.filename,
            dimensions: `${width}x${height}`,
            sourceImageId: originalImage.id,
          } as any,
        },
      });
    } catch (e) {
      console.error("Audit log error:", e);
    }

    revalidatePath(`/dashboard/applications/${applicationId}`, 'page');
    revalidatePath('/dashboard/applications', 'layout');

    return NextResponse.json({
      success: true,
      mode: "new",
      image: formatImageResponse(
        await prisma.image.findUniqueOrThrow({
          where: { id: result.id },
          include: imageInclude,
        }),
        applicationId,
      ),
    });
  } catch (error) {
    console.error("Crop image error:", error);
    return NextResponse.json(
      { error: "Failed to crop image" },
      { status: 500 },
    );
  }
}
