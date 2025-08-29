import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { requireAuth } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { resolveBaseUploadDir, getAppDir } from '@/lib/storage/paths'

interface CacheItemDto {
  name: string
  sizeBytes: number
  mtimeMs?: number
}

async function listCacheDir(dir: string): Promise<CacheItemDto[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = entries.filter(e => e.isFile())
    const items: CacheItemDto[] = []
    for (const f of files) {
      const p = path.join(dir, f.name)
      try {
        const st = await fs.stat(p)
        items.push({ name: f.name, sizeBytes: st.size, mtimeMs: st.mtimeMs })
      } catch {}
    }
    return items
  } catch (e: any) {
    // If directory doesn't exist, return empty list
    if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return []
    throw e
  }
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id: applicationId } = await context.params

    const app = await prisma.application.findFirst({
      where: { id: applicationId, ownerId: user.id },
      select: { id: true, slug: true },
    })

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const base = resolveBaseUploadDir()
    const slugDir = getAppDir(base, app.slug)
    const legacyDir = getAppDir(base, app.id)

    const slugCache = path.join(slugDir, '_cache')
    const legacyCache = path.join(legacyDir, '_cache')

    const [a, b] = await Promise.all([listCacheDir(slugCache), listCacheDir(legacyCache)])
    const items = [...a, ...b]
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

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id: applicationId } = await context.params

    const app = await prisma.application.findFirst({
      where: { id: applicationId, ownerId: user.id },
      select: { id: true, slug: true },
    })

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const base = resolveBaseUploadDir()
    const slugDir = getAppDir(base, app.slug)
    const legacyDir = getAppDir(base, app.id)

    const slugCache = path.join(slugDir, '_cache')
    const legacyCache = path.join(legacyDir, '_cache')

    // Compute current bytes before removal
    const [a, b] = await Promise.all([listCacheDir(slugCache), listCacheDir(legacyCache)])
    const totalBytes = [...a, ...b].reduce((acc, it) => acc + (it.sizeBytes || 0), 0)

    // Remove both caches if present
    await Promise.all([
      fs.rm(slugCache, { recursive: true, force: true }).catch(() => {}),
      fs.rm(legacyCache, { recursive: true, force: true }).catch(() => {}),
    ])

    return NextResponse.json({ success: true, clearedBytes: totalBytes })
  } catch (error) {
    console.error('Cache clear error:', error)
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 })
  }
}
