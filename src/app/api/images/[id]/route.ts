import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FileStorageService } from '@/lib/file-storage'

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

    const fileStorage = new FileStorageService()
    
    return NextResponse.json({
      ...image,
      url: fileStorage.getFileUrl(image.filename, image.applicationId),
      variants: image.variants.map(variant => ({
        ...variant,
        url: fileStorage.getFileUrl(variant.filename, image.applicationId)
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
      include: { variants: true }
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const fileStorage = new FileStorageService()
    
    // Delete physical files
    await fileStorage.deleteFile(image.filename, image.applicationId)
    
    // Delete variant files
    for (const variant of image.variants) {
      await fileStorage.deleteFile(variant.filename, image.applicationId)
    }

    // Delete from database
    await prisma.image.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
