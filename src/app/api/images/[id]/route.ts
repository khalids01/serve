import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FileStorageService } from '@/lib/file-storage'
import { getCurrentUser } from '@/lib/auth-server'
import path from 'path'
import fs from 'fs/promises'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
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

    return NextResponse.json({
      ...image,
      url: `/api/img/${image.filename}`,
      variants: image.variants.map(variant => ({
        ...variant,
        url: `/api/img/${image.filename}${variant.width || variant.height ? `?${[
          variant.width ? `w=${variant.width}` : '',
          variant.height ? `h=${variant.height}` : ''
        ].filter(Boolean).join('&')}` : ''}`
      }))
    })

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
    const { id } = await context.params
    const image = await prisma.image.findUnique({
      where: { id },
      include: {
        variants: true,
        application: { select: { slug: true } }
      }
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const fileStorage = new FileStorageService()
    const dirKey = image.application?.slug || image.applicationId
    
    // Delete physical files
    await fileStorage.deleteFile(image.filename, dirKey)
    // Legacy directory cleanup
    await fileStorage.deleteFile(image.filename, image.applicationId)
    
    // Delete variant files (only webp now, but loop remains safe)
    for (const variant of image.variants) {
      await fileStorage.deleteFile(variant.filename, dirKey)
      await fileStorage.deleteFile(variant.filename, image.applicationId)
    }

    // Delete cached resized files (created by /api/img/:name or legacy /api/images/:id/content)
    try {
      const baseUploads = process.env.UPLOAD_DIR || 'uploads'
      const uploadsRoot = path.isAbsolute(baseUploads) ? baseUploads : path.join(process.cwd(), baseUploads)
      const base = path.parse(image.filename).name
      const cacheDirs = [
        path.join(uploadsRoot, dirKey, '_cache'),
        path.join(uploadsRoot, image.applicationId, '_cache') // legacy fallback
      ]
      for (const cacheDir of cacheDirs) {
        const entries = await fs.readdir(cacheDir).catch(() => [])
        await Promise.all(
          entries
            .filter((name) => name.startsWith(base))
            .map((name) => fs.unlink(path.join(cacheDir, name)).catch(() => {}))
        )
      }
    } catch {}

    // Delete from database
    await prisma.image.delete({
      where: { id }
    })

    // Create audit log (best-effort)
    try {
      // Try API-key-provided headers first, fallback to session
      let userId = request.headers.get('x-user-id') || undefined
      if (!userId) {
        const user = await getCurrentUser(request.headers)
        if (user) userId = user.id
      }
      const userAgent = request.headers.get('user-agent') || undefined
      const ip =
        (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
        (request.headers.get('x-real-ip') || undefined)
      await prisma.auditLog.create({
        data: {
          userId: userId || null,
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
