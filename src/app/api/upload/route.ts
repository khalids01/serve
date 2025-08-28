import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FileStorageService } from '@/lib/file-storage'
import { getCurrentUser } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tags = formData.get('tags') as string

    // Try API-key-provided headers first
    let applicationId = request.headers.get('x-application-id') || undefined
    let userId = request.headers.get('x-user-id') || undefined

    // Fallback to session-based user when header missing
    if (!userId) {
      const user = await getCurrentUser(request.headers)
      if (user) {
        userId = user.id
      }
    }

    // Accept applicationId from formData when header not present (dashboard upload)
    if (!applicationId) {
      const appFromForm = formData.get('applicationId') as string | null
      if (appFromForm) applicationId = appFromForm
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!applicationId || !userId) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    }

    // Verify application exists (should always exist due to middleware validation)
    const application = await prisma.application.findUnique({
      where: { id: applicationId }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Validate max file size from env (defaults to 10MB)
    const maxMb = Number(process.env.MAX_FILE_SIZE ?? '10')
    const limitMb = (Number.isFinite(maxMb) && maxMb > 0 ? Math.floor(maxMb) : 10)
    const maxSize = limitMb * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${limitMb}MB.` },
        { status: 413 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileStorage = new FileStorageService()
    
    const uploadResult = await fileStorage.saveFile(
      buffer,
      file.name,
      application.slug, // use human-readable dir
      file.type
    )

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
        tags: tags ? JSON.parse(tags) : null,
        variants: {
          create: uploadResult.variants.map(variant => ({
            label: variant.label,
            filename: variant.filename,
            width: variant.width,
            height: variant.height,
            sizeBytes: variant.sizeBytes
          }))
        }
      },
      include: {
        variants: true
      }
    })

    // Create audit log
    try {
      const userAgent = request.headers.get('user-agent') || undefined
      const ip =
        (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
        (request.headers.get('x-real-ip') || undefined)
      await prisma.auditLog.create({
        data: {
          userId: userId || null,
          applicationId,
          action: 'UPLOAD',
          targetId: image.id,
          ip: ip || undefined,
          userAgent: userAgent || undefined,
          metadata: {
            originalName: file.name,
            size: file.size,
            contentType: file.type
          } as any
        }
      })
    } catch (e) {
      console.error('Audit log (UPLOAD) error:', e)
    }

    return NextResponse.json({
      success: true,
      image: {
        ...image,
        url: `/api/images/${image.id}/content`,
        variants: image.variants.map(variant => ({
          ...variant,
          url: `/api/images/${image.id}/content${variant.width || variant.height ? `?${[
            variant.width ? `w=${variant.width}` : '',
            variant.height ? `h=${variant.height}` : ''
          ].filter(Boolean).join('&')}` : ''}`
        }))
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
