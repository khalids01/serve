import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { tenantStoragePath } from "@/config";
import ApplicationDetailsClient from "@/features/applications/components/application-details-client";
import  {
  type ApplicationDTO,
  type ImageFileDTO,
  type AuditLogItemDTO,
  type CacheResponse,
} from "@/features/applications/components/application-details/types";
import { formatImageResponse } from "@/lib/image-response";
import { imageInclude } from "@/lib/image-upload";

export default async function ApplicationDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth");
  }

  const app = await prisma.application.findFirst({
    where: { id: params.id, ownerId: user.id },
    include: {
      _count: { select: { imageApplications: true, apiKeys: true } },
    },
  });

  if (!app) return notFound();

  const storageDir = tenantStoragePath(app.slug);

  const links = await prisma.imageApplication.findMany({
    where: { applicationId: app.id },
    orderBy: { updatedAt: "desc" },
    include: {
      image: { include: imageInclude },
    },
  });

  const activityRaw = await prisma.auditLog.findMany({
    where: { applicationId: app.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const application: ApplicationDTO = {
    id: app.id,
    name: app.name,
    slug: app.slug,
    createdAt: app.createdAt.toISOString(),
    storageDir,
    _count: {
      imageApplications: app._count.imageApplications,
      apiKeys: app._count.apiKeys,
    },
  };

  const images: ImageFileDTO[] = links.map((link) => {
    const formatted = formatImageResponse(link.image, app.id);
    return {
      id: formatted.id,
      filename: formatted.filename,
      originalName: formatted.originalName,
      contentType: formatted.contentType,
      sizeBytes: formatted.sizeBytes,
      width: formatted.width ?? undefined,
      height: formatted.height ?? undefined,
      createdAt: link.linkedAt.toISOString(),
      applicationId: app.id,
      applicationName: app.name,
      linkedApplications: formatted.linkedApplications,
      variants: formatted.variants.map((v) => ({
        id: v.id,
        label: v.label,
        filename: v.filename,
        width: v.width ?? undefined,
        height: v.height ?? undefined,
        sizeBytes: v.sizeBytes,
      })),
    };
  });

  const activity: AuditLogItemDTO[] = activityRaw.map((a) => ({
    id: a.id,
    userId: a.userId ?? null,
    applicationId: a.applicationId ?? null,
    action: a.action,
    targetId: a.targetId ?? null,
    ip: a.ip ?? null,
    userAgent: a.userAgent ?? null,
    metadata: a.metadata as any,
    createdAt: a.createdAt.toISOString(),
  }));

  const cacheData: CacheResponse | null = null;

  return (
    <Suspense fallback={<div className="container mx-auto py-8">Loading...</div>}>
      <ApplicationDetailsClient
        application={application}
        images={images}
        activity={activity}
        cacheData={cacheData}
      />
    </Suspense>
  );
}
