import { NextRequest, NextResponse } from 'next/server'
import { ApiKeyService } from '@/lib/api-keys'
import { requireAuth } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: { id: string; keyId: string }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth()
    const { id: applicationId, keyId } = params
    const { action } = await request.json()

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

    if (action === 'revoke') {
      const success = await ApiKeyService.revokeKey(keyId, user.id)
      
      if (!success) {
        return NextResponse.json(
          { error: 'API key not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, message: 'API key revoked' })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Update API key error:', error)
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth()
    const { id: applicationId, keyId } = params

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

    const success = await ApiKeyService.deleteKey(keyId, user.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'API key deleted' })
  } catch (error) {
    console.error('Delete API key error:', error)
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    )
  }
}
