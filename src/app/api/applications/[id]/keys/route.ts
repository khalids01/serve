import { NextRequest, NextResponse } from 'next/server'
import { ApiKeyService } from '@/lib/api-keys'
import { requireAuth } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: applicationId } = await context.params

    // Verify user owns the application
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        ownerId: user.id,
      },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    const keys = await ApiKeyService.listKeys(applicationId, user.id)

    return NextResponse.json({ keys })
  } catch (error) {
    console.error('List API keys error:', error)
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: applicationId } = await context.params
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Key name is required' },
        { status: 400 }
      )
    }

    // Verify user owns the application
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        ownerId: user.id,
      },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    const apiKey = await ApiKeyService.createApiKey(applicationId, user.id, name)

    return NextResponse.json({
      success: true,
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key, // Only returned on creation
        createdAt: apiKey.createdAt,
      },
    })
  } catch (error) {
    console.error('Create API key error:', error)
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
}
