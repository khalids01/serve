import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-server'

export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Find all application IDs owned by this user
    const apps = await prisma.application.findMany({
      where: { ownerId: user.id },
      select: { id: true },
    })

    const appIds = apps.map((a) => a.id)

    if (appIds.length === 0) {
      return NextResponse.json({
        storageBytes: 0,
        totals: { files: 0, applications: 0, apiKeys: 0 },
      })
    }

    const [imageAgg, variantAgg, fileCount, apiKeyCount] = await Promise.all([
      prisma.image.aggregate({
        where: { applicationId: { in: appIds } },
        _sum: { sizeBytes: true },
      }),
      prisma.imageVariant.aggregate({
        where: { image: { applicationId: { in: appIds } } },
        _sum: { sizeBytes: true },
      }),
      prisma.image.count({ where: { applicationId: { in: appIds } } }),
      prisma.apiKey.count({ where: { applicationId: { in: appIds }, revoked: false } }),
    ])

    const storageBytes = (imageAgg._sum.sizeBytes || 0) + (variantAgg._sum.sizeBytes || 0)

    return NextResponse.json({
      storageBytes,
      totals: {
        files: fileCount,
        applications: appIds.length,
        apiKeys: apiKeyCount,
      },
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to compute stats' }, { status: 500 })
  }
}
