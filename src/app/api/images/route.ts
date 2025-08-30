import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/lib/prisma-types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryApplicationId = searchParams.get('applicationId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')
    const contentType = searchParams.get('contentType')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Get application ID from authenticated context (set by middleware)
    const authenticatedApplicationId = request.headers.get('x-application-id')
    
    // Use authenticated application ID if available, otherwise require it in query
    const applicationId = authenticatedApplicationId || queryApplicationId

    if (!applicationId) {
      return NextResponse.json({ 
        error: 'Application ID required. Provide either a valid API key or applicationId query parameter.',
        details: 'When using API key authentication, the application ID is automatically determined from your key.'
      }, { status: 400 })
    }

    // If both are provided, ensure they match for security
    if (authenticatedApplicationId && queryApplicationId && authenticatedApplicationId !== queryApplicationId) {
      return NextResponse.json({ 
        error: 'Application ID mismatch',
        details: 'The applicationId in your query does not match your API key\'s application.'
      }, { status: 403 })
    }

    const skip = (page - 1) * limit

    // Build advanced search conditions
    const searchConditions: Prisma.ImageWhereInput[] = []

    // Text search across multiple fields
    if (search) {
      searchConditions.push({
        OR: [
          { originalName: { contains: search } },
          { filename: { contains: search } },
          { contentType: { contains: search } },
        ],
      })
    }

    // Tag filtering - TODO: Implement proper JSON array search
    // For now, tag filtering is disabled due to SQLite JSON limitations
    // This will be enhanced in a future update with raw SQL queries

    // Content type filtering
    if (contentType) {
      searchConditions.push({
        contentType: { contains: contentType }
      })
    }

    const where: Prisma.ImageWhereInput = {
      applicationId,
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
          variants: true
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
        pages: Math.ceil(total / limit)
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
