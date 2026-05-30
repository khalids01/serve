import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { protect } from '@/features/auth/guard'
import { tenantStoragePath } from '@/config'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await protect(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

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

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      application: {
        ...application,
        storageDir: tenantStoragePath(application.slug)
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
    const auth = await protect(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const { id } = await context.params
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Application name is required' },
        { status: 400 }
      )
    }

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

    return NextResponse.json({
      application: {
        ...updatedApplication,
        storageDir: tenantStoragePath(updatedApplication.slug)
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
