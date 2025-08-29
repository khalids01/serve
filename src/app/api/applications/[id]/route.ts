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

    const application = await prisma.application.findFirst({
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

    if(!application){
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Normalize storageDir to reflect current UPLOAD_DIR and slug
    const baseUploads = process.env.UPLOAD_DIR || 'uploads'
    const appsWithComputedDir = path.join(baseUploads, application.slug)

    return NextResponse.json({ application: appsWithComputedDir })

  } catch (error) {
    console.error('List applications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
