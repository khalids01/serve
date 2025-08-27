import { NextRequest, NextResponse } from 'next/server'
import { ApiKeyService } from '@/lib/api-keys'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/lib/prisma-types'

export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')
    const contentType = searchParams.get('contentType')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build search conditions
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

    // Content type filtering
    if (contentType) {
      searchConditions.push({
        contentType: { contains: contentType }
      })
    }

    const where: Prisma.ImageWhereInput = {
      applicationId: application.id,
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
    console.error('V1 List images error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}
