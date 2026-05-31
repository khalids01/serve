import { NextRequest, NextResponse } from 'next/server'
import { protect } from '@/features/auth/guard'
import { prisma } from '@/lib/prisma'
import {
  clearApplicationCache,
  getApplicationImageHashes,
  listApplicationCache,
} from '@/lib/storage/cache-admin'
import { uniqueTenantKeys } from '@/lib/storage/keys'
import { getStorage } from '@/lib/storage/factory'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await protect(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth
    const { id: applicationId } = await context.params

    const app = await prisma.application.findFirst({
      where: { id: applicationId, ownerId: user.id },
      select: { id: true, slug: true },
    })

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const tenantKeys = uniqueTenantKeys(app.slug, app.id)
    const hashes = await getApplicationImageHashes(app.id)
    const summary = await listApplicationCache(getStorage(), tenantKeys, hashes)

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Cache list error:', error)
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to list cache' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await protect(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth
    const { id: applicationId } = await context.params

    const app = await prisma.application.findFirst({
      where: { id: applicationId, ownerId: user.id },
      select: { id: true, slug: true },
    })

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const tenantKeys = uniqueTenantKeys(app.slug, app.id)
    const hashes = await getApplicationImageHashes(app.id)
    const clearedBytes = await clearApplicationCache(getStorage(), tenantKeys, hashes)

    return NextResponse.json({ success: true, clearedBytes })
  } catch (error) {
    console.error('Cache clear error:', error)
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 })
  }
}
