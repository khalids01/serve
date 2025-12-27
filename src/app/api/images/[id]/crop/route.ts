import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { FileStorageService } from '@/lib/file-storage'
import { protect } from '@/features/auth/guard'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Get form data first to avoid disturbed body errors
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

    // Find the original image
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

    // Check ownership
    if (originalImage.application?.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const fileStorage = new FileStorageService();
    const dirKey =
      originalImage.application.slug || originalImage.applicationId;
    const buffer = Buffer.from(await croppedFile.arrayBuffer());

    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    const { width, height } = metadata;

    if (saveMode === "replace") {
      // Replace the original file - write directly without processing
      const appDir = path.join(process.env.UPLOAD_DIR || "uploads", dirKey);
      await fs.mkdir(appDir, { recursive: true });
      const filePath = path.join(appDir, originalImage.filename);
      await fs.writeFile(filePath, buffer);

      // Delete cached files
      try {
        const baseUploads = process.env.UPLOAD_DIR || "uploads";
        const uploadsRoot = path.isAbsolute(baseUploads)
          ? baseUploads
          : path.join(process.cwd(), baseUploads);
        const base = path.parse(originalImage.filename).name;
        const cacheDir = path.join(uploadsRoot, dirKey, "_cache");
        const entries = await fs.readdir(cacheDir).catch(() => []);
        await Promise.all(
          entries
            .filter((name) => name.startsWith(base))
            .map((name) =>
              fs.unlink(path.join(cacheDir, name)).catch(() => { }),
            ),
        );
      } catch { }

      // Update database with new dimensions
      await prisma.image.update({
        where: { id },
        data: {
          width: width || null,
          height: height || null,
          sizeBytes: buffer.length,
        },
      });

      // Create audit log
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

      // Revalidate the application details page and parent paths
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
      // Save as new image - let saveFile generate hash-based filename
      const originalExt = path.extname(originalImage.filename);
      const croppedOriginalName = `${path.basename(originalImage.originalName, path.extname(originalImage.originalName))}_cropped${originalExt}`;

      const result = await fileStorage.saveFile(
        buffer,
        croppedOriginalName, // This is just for the originalName field, actual filename will be hash-based
        dirKey,
        originalImage.contentType,
      );

      // Create new database record with variants
      const newImage = await prisma.image.create({
        data: {
          applicationId: originalImage.applicationId,
          filename: result.filename, // Hash-based filename like 0d3c2d3a8e7dbc9c.jpeg
          originalName: croppedOriginalName, // Human-readable name for display
          contentType: originalImage.contentType,
          sizeBytes: result.sizeBytes,
          width: result.width || null,
          height: result.height || null,
          hash: result.id, // Store content hash here
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

      console.log('✅ Cropped image saved:', {
        id: newImage.id,
        filename: result.filename,
        originalName: newImage.originalName,
        applicationId: originalImage.applicationId,
        dirKey,
      });

      // Create audit log
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

      // Revalidate the application details page and parent paths
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
