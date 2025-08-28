import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, requireAuth } from '@/lib/auth-server'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const applications = await prisma.application.findMany({
      where: {
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

    // Normalize storageDir to reflect current UPLOAD_DIR and slug
    const baseUploads = process.env.UPLOAD_DIR || 'uploads'
    const appsWithComputedDir = applications.map((app) => ({
      ...app,
      storageDir: path.join(baseUploads, app.slug)
    }))

    return NextResponse.json({ applications: appsWithComputedDir })

  } catch (error) {
    console.error('List applications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { name, slug } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await prisma.application.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }

    const baseUploads = process.env.UPLOAD_DIR || 'uploads'
    const application = await prisma.application.create({
      data: {
        name,
        slug,
        ownerId: user.id,
        storageDir: path.join(baseUploads, slug)
      }
    })

    return NextResponse.json({ application })

  } catch (error) {
    console.error('Create application error:', error)
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}
