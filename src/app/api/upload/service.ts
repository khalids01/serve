import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FileStorageService } from "@/lib/file-storage";
import { getCurrentUser } from "@/lib/auth-server";
import type { ImageVariant } from "@/lib/prisma-types";

interface FileWithTags {
  file: File;
  tags?: string[];
}

async function processFile(
  file: File,
  tags: string[] | null,
  applicationId: string,
  userId: string,
  application: any,
  request: NextRequest,
) {
  // Validate max file size from env (defaults to 10MB)
  const maxMb = Number(process.env.MAX_FILE_SIZE ?? "10");
  const limitMb = Number.isFinite(maxMb) && maxMb > 0 ? Math.floor(maxMb) : 10;
  const maxSize = limitMb * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size is ${limitMb}MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileStorage = new FileStorageService();

  const uploadResult = await fileStorage.saveFile(
    buffer,
    file.name,
    application.slug, // use human-readable dir
    file.type,
  );

  // Save to database
  const image = await prisma.image.create({
    data: {
      id: uploadResult.id,
      applicationId,
      filename: uploadResult.filename,
      originalName: uploadResult.originalName,
      contentType: uploadResult.contentType,
      sizeBytes: uploadResult.sizeBytes,
      width: uploadResult.width,
      height: uploadResult.height,
      tags: tags ?? undefined,
      variants: {
        create: uploadResult.variants.map((variant) => ({
          label: variant.label,
          filename: variant.filename,
          width: variant.width,
          height: variant.height,
          sizeBytes: variant.sizeBytes,
        })),
      },
    },
    include: {
      variants: true,
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
        userId: userId || null,
        applicationId,
        action: "UPLOAD",
        targetId: image.id,
        ip: ip || undefined,
        userAgent: userAgent || undefined,
        metadata: {
          originalName: file.name,
          size: file.size,
          contentType: file.type,
        } as any,
      },
    });
  } catch (e) {
    console.error("Audit log (UPLOAD) error:", e);
  }

  return {
    ...image,
    url: `/api/img/${image.filename}`,
    variants: image.variants.map((variant: ImageVariant) => ({
      ...variant,
      url: `/api/img/${variant.filename}`,
    })),
  };
}

export async function handleUpload(request: NextRequest) {
  try {
    const formData = await request.formData();

    // console.log(formData.get("file"));

    // Try API-key-provided headers first
    let applicationId = request.headers.get("x-application-id") || undefined;
    let userId = request.headers.get("x-user-id") || undefined;

    // Fallback to session-based user when header missing
    if (!userId) {
      const user = await getCurrentUser(request.headers);
      if (user) {
        userId = user.id;
      }
    }

    // Accept applicationId from formData when header not present (dashboard upload)
    if (!applicationId) {
      const appFromForm = formData.get("applicationId") as string | null;
      if (appFromForm) applicationId = appFromForm;
    }

    if (!applicationId) {
      return NextResponse.json(
        {
          error:
            "Application ID required. Provide either a valid API key or applicationId in form data.",
          details:
            "When using API key authentication, the application ID is automatically determined from your key.",
        },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Verify application exists (should always exist due to middleware validation)
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    // Check for array format first
    const filesData = formData.get("files") as string | null;
    if (filesData) {
      // Array format: JSON array of {file: string, tags: string[]}
      let fileConfigs: Array<{ file: string; tags?: string[] }> = [];
      try {
        fileConfigs = JSON.parse(filesData);
      } catch (e) {
        return NextResponse.json(
          { error: "Invalid files JSON format" },
          { status: 400 },
        );
      }

      if (!Array.isArray(fileConfigs) || fileConfigs.length === 0) {
        return NextResponse.json(
          { error: "Files must be a non-empty array" },
          { status: 400 },
        );
      }

      const results = [];
      const errors = [];

      for (let i = 0; i < fileConfigs.length; i++) {
        const config = fileConfigs[i];
        const file = formData.get(config.file) as File;

        if (!file) {
          errors.push(`File not found for key: ${config.file}`);
          continue;
        }

        try {
          const result = await processFile(
            file,
            config.tags || null,
            applicationId,
            userId,
            application,
            request,
          );
          results.push(result);
        } catch (error) {
          errors.push(
            `Failed to process ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      }

      if (results.length === 0) {
        return NextResponse.json(
          {
            error: "No files were successfully uploaded",
            details: errors,
          },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        images: results,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // Single file format (backward compatibility)
    const file = formData.get("file") as File;
    const tags = formData.get("tags") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const parsedTags = tags ? JSON.parse(tags) : null;
    const result = await processFile(
      file,
      parsedTags,
      applicationId,
      userId,
      application,
      request,
    );

    return NextResponse.json({
      success: true,
      image: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
