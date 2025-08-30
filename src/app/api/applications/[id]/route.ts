import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, requireAuth } from '@/lib/auth-server'
import path from 'path'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const application = await prisma.application.findFirst({
      where: {
        id,
        ownerId: user.id
      },
      include: {
        _count: {
          select: {
            images: true,
            apiKeys: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if(!application){
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Normalize storageDir to reflect current UPLOAD_DIR and slug
    const baseUploads = process.env.UPLOAD_DIR || 'uploads'
    const storageDir = path.join(baseUploads, application.slug)

    return NextResponse.json({ 
      application: {
        ...application,
        storageDir
      }
    })

  } catch (error) {
    console.error('List applications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const body = await request.json()
    const { name } = body

    // Validate input
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Application name is required' },
        { status: 400 }
      )
    }

    // Check if application exists and user owns it
    const existingApplication = await prisma.application.findFirst({
      where: {
        id,
        ownerId: user.id
      }
    })

    if (!existingApplication) {
      return NextResponse.json(
        { error: 'Application not found or access denied' },
        { status: 404 }
      )
    }

    // Update the application
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        name: name.trim(),
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: {
            images: true,
            apiKeys: true
          }
        }
      }
    })

    // Normalize storageDir
    const baseUploads = process.env.UPLOAD_DIR || 'uploads'
    const storageDir = path.join(baseUploads, updatedApplication.slug)

    return NextResponse.json({
      application: {
        ...updatedApplication,
        storageDir
      }
    })

  } catch (error) {
    console.error('Update application error:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}
