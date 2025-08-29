import { notFound, redirect } from 'next/navigation'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-server'
import ApplicationDetailsClient, { type ApplicationDTO, type ImageFileDTO, type AuditLogItemDTO, type CacheResponse } from '@/features/applications/components/application-details-client'

export default async function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth')
  }

  const app = await prisma.application.findFirst({
    where: { id: params.id, ownerId: user.id },
    include: {
      _count: { select: { images: true, apiKeys: true } },
    },
  })

  if (!app) return notFound()

  // Normalize storageDir to reflect current UPLOAD_DIR and slug
  const baseUploads = process.env.UPLOAD_DIR || 'uploads'
  const storageDir = path.join(baseUploads, app.slug)

  const imagesRaw = await prisma.image.findMany({
    where: { applicationId: app.id },
    orderBy: { createdAt: 'desc' },
    include: { variants: true },
  })

  const activityRaw = await prisma.auditLog.findMany({
    where: { applicationId: app.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const application: ApplicationDTO = {
    id: app.id,
    name: app.name,
    slug: app.slug,
    createdAt: app.createdAt.toISOString(),
    storageDir,
    _count: app._count as any,
  }

  const images: ImageFileDTO[] = imagesRaw.map((img) => ({
    id: img.id,
    filename: img.filename,
    originalName: img.originalName,
    contentType: img.contentType,
    sizeBytes: img.sizeBytes,
    width: img.width ?? undefined,
    height: img.height ?? undefined,
    createdAt: img.createdAt.toISOString(),
    variants: img.variants.map((v) => ({
      id: v.id,
      label: v.label,
      filename: v.filename,
      width: v.width ?? undefined,
      height: v.height ?? undefined,
      sizeBytes: v.sizeBytes,
    })),
  }))

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
  }))

  const cacheData: CacheResponse | null = null

  return (
    <ApplicationDetailsClient
      application={application}
      images={images}
      activity={activity}
      cacheData={cacheData}
    />
  )
}
