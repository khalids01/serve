import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FileStorageService } from '@/lib/file-storage'
import { protect } from '@/features/auth/guard'
import { withImageUrls } from '@/lib/image-urls'
import path from 'path'
import { deleteTenantCacheByBase } from '@/lib/storage/read'
import { uniqueTenantKeys } from '@/lib/storage/keys'
import { getStorage } from '@/lib/storage/factory'

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
      include: {
        variants: true,
        application: true
      }
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    if (authApp && image.applicationId !== authApp.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    if (!authApp && image.application.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json(withImageUrls(image, image.id))

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
      include: {
        variants: true,
        application: true
      }
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    if (authApp && image.applicationId !== authApp.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    if (!authApp && image.application.ownerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const fileStorage = new FileStorageService()
    const dirKey = image.application?.slug || image.applicationId
    const tenantKeys = uniqueTenantKeys(image.application?.slug, image.applicationId)

    await fileStorage.deleteFile(image.filename, dirKey)
    await fileStorage.deleteFile(image.filename, image.applicationId)

    for (const variant of image.variants) {
      await fileStorage.deleteFile(variant.filename, dirKey)
      await fileStorage.deleteFile(variant.filename, image.applicationId)
    }

    const base = path.parse(image.filename).name
    await deleteTenantCacheByBase(getStorage(), tenantKeys, base)

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
          applicationId: image.applicationId,
          action: 'DELETE',
          targetId: image.id,
          ip: ip || undefined,
          userAgent: userAgent || undefined,
          metadata: {
            filename: image.filename,
            originalName: image.originalName,
            variants: image.variants?.length || 0
          } as any
        }
      })
    } catch (e) {
      console.error('Audit log (DELETE) error:', e)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
