import { NextRequest, NextResponse } from 'next/server'
import { protect } from '@/features/auth/guard'
import { prisma } from '@/lib/prisma'
import { listTenantCache, clearTenantCache } from '@/lib/storage/read'
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
    const items = await listTenantCache(getStorage(), tenantKeys)
    const totalBytes = items.reduce((acc, it) => acc + (it.sizeBytes || 0), 0)

    return NextResponse.json({ items, totalBytes })
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
    const totalBytes = await clearTenantCache(getStorage(), tenantKeys)

    return NextResponse.json({ success: true, clearedBytes: totalBytes })
  } catch (error) {
    console.error('Cache clear error:', error)
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 })
  }
}
