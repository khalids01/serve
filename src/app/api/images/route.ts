import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/lib/prisma-types'
import { protect } from '@/features/auth/guard'
import { formatImageResponse, imageInclude } from '@/lib/image-response'

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

    const imageSearchConditions: Prisma.ImageWhereInput[] = []
    if (search) {
      imageSearchConditions.push({
        OR: [
          { filename: { contains: search } },
          { contentType: { contains: search } },
          {
            applications: {
              some: { originalName: { contains: search } },
            },
          },
        ],
      })
    }
    if (contentType) {
      imageSearchConditions.push({ contentType: { contains: contentType } })
    }

    if (applicationId) {
      const linkWhere: Prisma.ImageApplicationWhereInput = {
        applicationId,
        ...(imageSearchConditions.length > 0
          ? { image: { AND: imageSearchConditions } }
          : {}),
      }

      const linkOrderBy: Prisma.ImageApplicationOrderByWithRelationInput =
        sortBy === 'name'
          ? { originalName: sortOrder as 'asc' | 'desc' }
          : sortBy === 'size'
            ? { image: { sizeBytes: sortOrder as 'asc' | 'desc' } }
            : sortBy === 'type'
              ? { image: { contentType: sortOrder as 'asc' | 'desc' } }
              : { updatedAt: sortOrder as 'asc' | 'desc' }

      const [links, total] = await Promise.all([
        prisma.imageApplication.findMany({
          where: linkWhere,
          include: {
            image: { include: imageInclude },
          },
          orderBy: linkOrderBy,
          skip,
          take: limit,
        }),
        prisma.imageApplication.count({ where: linkWhere }),
      ])

      return NextResponse.json({
        images: links.map((link) => formatImageResponse(link.image, applicationId)),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      })
    }

    const where: Prisma.ImageWhereInput = {
      applications: { some: { application: { ownerId: user.id } } },
      ...(imageSearchConditions.length > 0 ? { AND: imageSearchConditions } : {}),
    }

    const orderBy: Prisma.ImageOrderByWithRelationInput =
      sortBy === 'size'
        ? { sizeBytes: sortOrder as 'asc' | 'desc' }
        : sortBy === 'type'
          ? { contentType: sortOrder as 'asc' | 'desc' }
          : { updatedAt: sortOrder as 'asc' | 'desc' }

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        where,
        include: imageInclude,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.image.count({ where }),
    ])

    return NextResponse.json({
      images: images.map((image) => formatImageResponse(image)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    })

  } catch (error) {
    console.error('List images error:', error)

    if (error instanceof Error) {
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
