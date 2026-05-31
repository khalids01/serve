import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { protect } from '@/features/auth/guard'

export async function GET(request: NextRequest) {
  try {
    const auth = await protect(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

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

    const linkedImages = await prisma.image.findMany({
      where: {
        applications: { some: { applicationId: { in: appIds } } },
      },
      select: {
        id: true,
        sizeBytes: true,
        variants: { select: { sizeBytes: true } },
      },
    })

    const storageBytes = linkedImages.reduce((total, image) => {
      const variantBytes = image.variants.reduce((sum, v) => sum + v.sizeBytes, 0)
      return total + image.sizeBytes + variantBytes
    }, 0)

    const [apiKeyCount] = await Promise.all([
      prisma.apiKey.count({ where: { applicationId: { in: appIds }, revoked: false } }),
    ])

    return NextResponse.json({
      storageBytes,
      totals: {
        files: linkedImages.length,
        applications: appIds.length,
        apiKeys: apiKeyCount,
      },
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to compute stats' }, { status: 500 })
  }
}
