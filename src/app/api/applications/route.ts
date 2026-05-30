import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { protect } from '@/features/auth/guard'
import { tenantStoragePath } from '@/config'

export async function GET(request: NextRequest) {
  try {
    const auth = await protect(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

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

    const appsWithComputedDir = applications.map((app) => ({
      ...app,
      storageDir: tenantStoragePath(app.slug)
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
    const auth = await protect(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth
    const { name, slug } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const existing = await prisma.application.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }

    const application = await prisma.application.create({
      data: {
        name,
        slug,
        ownerId: user.id,
        storageDir: tenantStoragePath(slug)
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
