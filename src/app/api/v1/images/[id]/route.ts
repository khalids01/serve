import { NextRequest, NextResponse } from 'next/server'
import { ApiKeyService } from '@/lib/api-keys'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Validate API key
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header. Use: Bearer sk_live_...' },
        { status: 401 }
      )
    }

    const apiKey = authHeader.substring(7) // Remove 'Bearer '
    const validation = await ApiKeyService.validateKey(apiKey)
    
    if (!validation) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    const { application } = validation
    const { id } = await context.params

    // Find the image
    const image = await prisma.image.findFirst({
      where: {
        id,
        applicationId: application.id,
      },
      include: {
        variants: true
      }
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(image)

  } catch (error) {
    console.error('V1 Get image error:', error)
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
    // Validate API key
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header. Use: Bearer sk_live_...' },
        { status: 401 }
      )
    }

    const apiKey = authHeader.substring(7) // Remove 'Bearer '
    const validation = await ApiKeyService.validateKey(apiKey)
    
    if (!validation) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    const { application } = validation
    const { id } = await context.params

    // Find the image with variants
    const image = await prisma.image.findFirst({
      where: {
        id,
        applicationId: application.id,
      },
      include: {
        variants: true
      }
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete files from filesystem
    const baseDir = join(process.cwd(), 'public', application.storageDir)
    
    try {
      // Delete main image file
      await unlink(join(baseDir, image.filename))
      
      // Delete variant files
      for (const variant of image.variants) {
        try {
          await unlink(join(baseDir, variant.filename))
        } catch (err) {
          console.warn(`Failed to delete variant file ${variant.filename}:`, err)
        }
      }
    } catch (err) {
      console.warn(`Failed to delete main image file ${image.filename}:`, err)
    }

    // Delete from database (cascades to variants)
    await prisma.image.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error) {
    console.error('V1 Delete image error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
