import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FileStorageService } from '@/lib/file-storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tags = formData.get('tags') as string

    // Get application ID from middleware (API key validation)
    const applicationId = request.headers.get('x-application-id')
    const userId = request.headers.get('x-user-id')

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

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileStorage = new FileStorageService()
    
    const uploadResult = await fileStorage.saveFile(
      buffer,
      file.name,
      applicationId,
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

    return NextResponse.json({
      success: true,
      image: {
        ...image,
        url: fileStorage.getFileUrl(image.filename, applicationId),
        variants: image.variants.map(variant => ({
          ...variant,
          url: fileStorage.getFileUrl(variant.filename, applicationId)
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
