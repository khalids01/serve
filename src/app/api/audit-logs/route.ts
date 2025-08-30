import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('applicationId')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limitRaw = parseInt(searchParams.get('limit') || '10', 10)
    const limit = Math.min(100, Math.max(1, Number.isNaN(limitRaw) ? 10 : limitRaw))

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID required' }, { status: 400 })
    }

    // Ensure the authenticated user owns this application
    const app = await prisma.application.findFirst({
      where: { id: applicationId, ownerId: user.id },
      select: { id: true }
    })

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const skip = (page - 1) * limit

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { applicationId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.auditLog.count({ where: { applicationId } })
    ])

    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('List audit logs error:', error)
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
  }
}
