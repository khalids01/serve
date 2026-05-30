import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { FileStorageService } from '@/lib/file-storage'
import { protect } from '@/features/auth/guard'
import { deleteTenantCacheByBase } from '@/lib/storage/read'
import { uniqueTenantKeys } from '@/lib/storage/keys'
import { getStorage } from '@/lib/storage/factory'
import sharp from 'sharp'
import path from 'path'

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

    if (!croppedFile) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const originalImage = await prisma.image.findUnique({
      where: { id },
      include: {
        application: {
          select: {
            id: true,
            slug: true,
            ownerId: true,
          },
        },
        variants: true,
      },
    });

    if (!originalImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    if (originalImage.application?.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const fileStorage = new FileStorageService();
    const dirKey =
      originalImage.application.slug || originalImage.applicationId;
    const buffer = Buffer.from(await croppedFile.arrayBuffer());

    const metadata = await sharp(buffer).metadata();
    const { width, height } = metadata;

    if (saveMode === "replace") {
      await fileStorage.putRaw(
        dirKey,
        originalImage.filename,
        buffer,
        originalImage.contentType,
      );

      const tenantKeys = uniqueTenantKeys(
        originalImage.application.slug,
        originalImage.applicationId,
      );
      const base = path.parse(originalImage.filename).name;
      await deleteTenantCacheByBase(getStorage(), tenantKeys, base);

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
            applicationId: originalImage.applicationId,
            action: "UPDATE",
            targetId: originalImage.id,
            ip: ip || undefined,
            userAgent: userAgent || undefined,
            metadata: {
              operation: "crop-replace",
              originalName: originalImage.originalName,
              filename: originalImage.filename,
              newDimensions: `${width}x${height}`,
            } as any,
          },
        });
      } catch (e) {
        console.error("Audit log error:", e);
      }

      revalidatePath(`/dashboard/applications/${originalImage.applicationId}`, 'page');
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
    } else {
      const originalExt = path.extname(originalImage.filename);
      const croppedOriginalName = `${path.basename(originalImage.originalName, path.extname(originalImage.originalName))}_cropped${originalExt}`;

      const result = await fileStorage.saveFile(
        buffer,
        croppedOriginalName,
        dirKey,
        originalImage.contentType,
      );

      const newImage = await prisma.image.create({
        data: {
          applicationId: originalImage.applicationId,
          filename: result.filename,
          originalName: croppedOriginalName,
          contentType: originalImage.contentType,
          sizeBytes: result.sizeBytes,
          width: result.width || null,
          height: result.height || null,
          hash: result.id,
          variants: {
            create: result.variants.map((v) => ({
              label: v.label,
              filename: v.filename,
              width: v.width || null,
              height: v.height || null,
              sizeBytes: v.sizeBytes,
            })),
          },
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
            applicationId: originalImage.applicationId,
            action: "UPLOAD",
            targetId: newImage.id,
            ip: ip || undefined,
            userAgent: userAgent || undefined,
            metadata: {
              operation: "crop-new",
              originalName: newImage.originalName,
              filename: newImage.filename,
              dimensions: `${width}x${height}`,
              sourceImageId: originalImage.id,
            } as any,
          },
        });
      } catch (e) {
        console.error("Audit log error:", e);
      }

      revalidatePath(`/dashboard/applications/${originalImage.applicationId}`, 'page');
      revalidatePath('/dashboard/applications', 'layout');

      return NextResponse.json({
        success: true,
        mode: "new",
        image: {
          id: newImage.id,
          filename: newImage.filename,
          originalName: newImage.originalName,
          width,
          height,
        },
      });
    }
  } catch (error) {
    console.error("Crop image error:", error);
    return NextResponse.json(
      { error: "Failed to crop image" },
      { status: 500 },
    );
  }
}
