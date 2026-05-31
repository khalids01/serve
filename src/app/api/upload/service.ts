import { NextResponse, } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiKeyService } from "@/lib/api-keys";
import { maxFileSizeBytes, config } from "@/config";
import { processImageUpload } from "@/lib/image-upload";

interface FileWithTags {
  file: File;
  tags?: string[];
}

async function processFile({
  file,
  tags,
  applicationId,
  userId,
  userAgent,
  ip,
}: {
  file: File;
  tags: string[] | null;
  applicationId: string;
  userId: string;
  userAgent?: string | null;
  ip?: string | null;
}) {
  const maxSize = maxFileSizeBytes();
  const limitMb = config.upload.maxFileSizeMb;
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size is ${limitMb}MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await processImageUpload(
    buffer,
    file.name,
    file.type,
    applicationId,
    tags,
  );

  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        applicationId,
        action: "UPLOAD",
        targetId: result.id,
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

  return result;
}

type UploadContext = {
  formData: FormData;
  sessionUser?: { id: string } | null;
  headers: {
    userAgent?: string | null;
    ip?: string;
    applicationId?: string | null;
    userId?: string | null;
    apiKey?: string | null;
  };
};


export async function handleUpload({
  formData,
  sessionUser,
  headers,
}: UploadContext) {
  try {

    // console.log(formData.get("file"));

    // Try API-key-provided headers first
    let applicationId = headers.applicationId || undefined;
    let userId = headers.userId || undefined;

    // Check for direct API key if headers missing (e.g. middleware skipped cloning to avoid disturbed body)
    if (!userId || !applicationId) {
      const apiKey = headers.apiKey
      if (!!apiKey) {
        const validation = await ApiKeyService.validateKey(apiKey);
        if (validation) {
          userId = validation.user.id;
          applicationId = validation.application.id;
        }
      }
    }

    // Fallback to session-based user when header missing
    if (!userId) {
      const user = sessionUser
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
          const result = await processFile({
            file,
            tags: config.tags || null,
            applicationId,
            userId,
            userAgent: headers.userAgent,
            ip: headers.ip,
          }
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
    const result = await processFile({
      file,
      tags: parsedTags,
      applicationId,
      userId,
      userAgent: headers.userAgent,
      ip: headers.ip,
    });

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
