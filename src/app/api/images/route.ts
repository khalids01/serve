import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/lib/prisma-types'
import { protect } from '@/features/auth/guard'

export async function GET(request: NextRequest) {
  try {
    const auth = await protect(request)
    if (auth instanceof NextResponse) return auth
    const { user, application } = auth

    const { searchParams } = new URL(request.url)
    const queryApplicationId = searchParams.get('applicationId')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const search = searchParams.get('search')
    const contentType = searchParams.get('contentType')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const authenticatedApplicationId = application?.id
    const isSessionAuth = auth.authType === 'session'

    let applicationId = authenticatedApplicationId || queryApplicationId || undefined

    if (authenticatedApplicationId && queryApplicationId && authenticatedApplicationId !== queryApplicationId) {
      return NextResponse.json({
        error: 'Application ID mismatch',
        details: 'The applicationId in your query does not match your API key\'s application.'
      }, { status: 403 })
    }

    if (!isSessionAuth && !applicationId) {
      return NextResponse.json({
        error: 'Application ID required. Provide either a valid API key or applicationId query parameter.',
        details: 'When using API key authentication, the application ID is automatically determined from your key.'
      }, { status: 400 })
    }

    if (isSessionAuth && applicationId) {
      const ownedApp = await prisma.application.findFirst({
        where: { id: applicationId, ownerId: user.id },
        select: { id: true },
      })
      if (!ownedApp) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 })
      }
    }

    const skip = (page - 1) * limit

    const searchConditions: Prisma.ImageWhereInput[] = []

    if (search) {
      searchConditions.push({
        OR: [
          { originalName: { contains: search } },
          { filename: { contains: search } },
          { contentType: { contains: search } },
        ],
      })
    }

    if (contentType) {
      searchConditions.push({
        contentType: { contains: contentType }
      })
    }

    const where: Prisma.ImageWhereInput = isSessionAuth && !applicationId
      ? {
          application: { ownerId: user.id },
          ...(searchConditions.length > 0 ? { AND: searchConditions } : {}),
        }
      : {
          applicationId: applicationId!,
          ...(searchConditions.length > 0 ? { AND: searchConditions } : {}),
        }

    // Dynamic sorting
    const orderBy: Prisma.ImageOrderByWithRelationInput = {}
    if (sortBy === 'name') {
      orderBy.originalName = sortOrder as 'asc' | 'desc'
    } else if (sortBy === 'size') {
      orderBy.sizeBytes = sortOrder as 'asc' | 'desc'
    } else if (sortBy === 'type') {
      orderBy.contentType = sortOrder as 'asc' | 'desc'
    } else {
      orderBy.createdAt = sortOrder as 'asc' | 'desc'
    }

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        where,
        include: {
          variants: true,
          application: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.image.count({ where })
    ])

    return NextResponse.json({
      images,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('List images error:', error)

    // Provide more specific error messages
    if (error instanceof Error) {
      // Check for common database errors
      if (error.message.includes('Invalid `prisma.image.findMany()` invocation')) {
        return NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: 'Please check your search parameters and try again.'
          },
          { status: 400 }
        )
      }

      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          {
            error: 'Application not found',
            details: 'The specified application ID does not exist or you do not have access to it.'
          },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch images',
        details: 'An unexpected error occurred while retrieving images. Please try again later.'
      },
      { status: 500 }
    )
  }
}
