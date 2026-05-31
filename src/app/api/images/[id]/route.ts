import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FileStorageService } from '@/lib/file-storage'
import { protect } from '@/features/auth/guard'
import path from 'path'
import { deleteBlobAndLegacyCacheByBase } from '@/lib/storage/read'
import { objectKey } from '@/lib/storage/keys'
import { getStorage } from '@/lib/storage/factory'
import {
  appIsLinkedToImage,
  formatImageResponse,
  getLegacyTenantKeys,
  getLinkedApplications,
  userOwnsLinkedImage,
} from '@/lib/image-response'
import { imageInclude } from '@/lib/image-upload'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await protect(request)
    if (auth instanceof NextResponse) return auth
    const { user, application: authApp } = auth

    const { id } = await context.params
    const image = await prisma.image.findUnique({
      where: { id },
      include: imageInclude,
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    if (authApp) {
      const linked = await appIsLinkedToImage(id, authApp.id)
      if (!linked) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    } else {
      const owns = await userOwnsLinkedImage(id, user.id)
      if (!owns) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    return NextResponse.json(formatImageResponse(image, authApp?.id))

  } catch (error) {
    console.error('Get image error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await protect(request)
    if (auth instanceof NextResponse) return auth
    const { user, application: authApp } = auth

    const { id } = await context.params
    const image = await prisma.image.findUnique({
      where: { id },
      include: imageInclude,
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    if (authApp) {
      const linked = await appIsLinkedToImage(id, authApp.id)
      if (!linked) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    } else {
      const owns = await userOwnsLinkedImage(id, user.id)
      if (!owns) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    const linkedApplications = getLinkedApplications(image)
    const legacyTenantKeys = getLegacyTenantKeys(image)
    const fileStorage = new FileStorageService()
    const storage = getStorage()

    await fileStorage.deleteBlobFile(image.filename)
    for (const tenantKey of legacyTenantKeys) {
      await storage.delete(objectKey(tenantKey, image.filename))
    }

    for (const variant of image.variants) {
      await fileStorage.deleteBlobFile(variant.filename)
      for (const tenantKey of legacyTenantKeys) {
        await storage.delete(objectKey(tenantKey, variant.filename))
      }
    }

    const base = path.parse(image.filename).name
    await deleteBlobAndLegacyCacheByBase(storage, base, legacyTenantKeys)

    await prisma.image.delete({
      where: { id }
    })

    try {
      const userAgent = request.headers.get('user-agent') || undefined
      const ip =
        (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
        (request.headers.get('x-real-ip') || undefined)
      await prisma.auditLog.create({
        data: {
          userId: user.id || null,
          applicationId: authApp?.id ?? image.applications[0]?.applicationId ?? null,
          action: 'DELETE',
          targetId: image.id,
          ip: ip || undefined,
          userAgent: userAgent || undefined,
          metadata: {
            filename: image.filename,
            linkedApplications,
            variants: image.variants?.length || 0
          } as any
        }
      })
    } catch (e) {
      console.error('Audit log (DELETE) error:', e)
    }

    return NextResponse.json({
      success: true,
      linkedApplications,
    })

  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
