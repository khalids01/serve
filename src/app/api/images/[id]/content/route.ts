import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import sharp from 'sharp'
import { prisma } from '@/lib/prisma'
import {
  readTenantFile,
  readTenantCache,
  writeTenantCache,
} from '@/lib/storage/read'
import { uniqueTenantKeys } from '@/lib/storage/keys'
import { getStorage } from '@/lib/storage/factory'

const MAX_DIMENSION = 4096

function clamp(n: number | null): number | null {
  if (n == null) return null
  if (Number.isNaN(n)) return null
  return Math.max(1, Math.min(MAX_DIMENSION, Math.floor(n)))
}

function getTargetExt(format?: string | null): 'jpg' | 'png' | 'webp' | 'avif' {
  const f = (format || '').toLowerCase()
  if (f === 'webp') return 'webp'
  if (f === 'png') return 'png'
  if (f === 'avif') return 'avif'
  return 'jpg'
}

function getContentTypeByExt(ext: string): string {
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'avif':
      return 'image/avif'
    default:
      return 'application/octet-stream'
  }
}

function bufferResponse(buf: Buffer, contentType: string): NextResponse {
  const body = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  return new NextResponse(body as ArrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  })
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await context.params
    const url = new URL(request.url)
    const storage = getStorage()
    const wParam = url.searchParams.get('width') || url.searchParams.get('w')
    const hParam = url.searchParams.get('height') || url.searchParams.get('h')
    const fmtParam = url.searchParams.get('format') || url.searchParams.get('f')

    const [id, idExt] = rawId.includes('.') ? ((): [string, string | null] => {
      const dotIdx = rawId.indexOf('.')
      return [rawId.slice(0, dotIdx), rawId.slice(dotIdx + 1).toLowerCase()]
    })() : [rawId, null]

    const width = clamp(wParam ? parseInt(wParam, 10) : null)
    const height = clamp(hParam ? parseInt(hParam, 10) : null)

    const image = await prisma.image.findUnique({
      where: { id },
      select: {
        id: true,
        filename: true,
        applicationId: true,
        contentType: true,
        application: { select: { slug: true } }
      }
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const tenantKeys = uniqueTenantKeys(image.application?.slug, image.applicationId)
    const primaryTenantKey = tenantKeys[0] ?? image.applicationId

    const targetExt = getTargetExt((fmtParam || idExt) || undefined)
    const origExt = path.extname(image.filename).replace('.', '').toLowerCase()

    if (!width && !height && (!idExt || targetExt === origExt) && !fmtParam) {
      const buf = await readTenantFile(storage, tenantKeys, image.filename)
      if (!buf) {
        return NextResponse.json({ error: 'Original file not found' }, { status: 404 })
      }
      return bufferResponse(buf, image.contentType || 'application/octet-stream')
    }

    if (!width && !height && targetExt === 'webp') {
      const webpName = `${path.parse(image.filename).name}.webp`
      const buf = await readTenantFile(storage, tenantKeys, webpName)
      if (buf) {
        return bufferResponse(buf, 'image/webp')
      }
    }

    const base = path.parse(image.filename).name
    const cacheName = `${base}${width ? `_w${width}` : ''}${height ? `_h${height}` : ''}.${targetExt}`

    const cached = await readTenantCache(storage, tenantKeys, cacheName)
    if (cached) {
      return bufferResponse(cached, getContentTypeByExt(targetExt))
    }

    const original = await readTenantFile(storage, tenantKeys, image.filename)
    if (!original) {
      return NextResponse.json({ error: 'Original file not found' }, { status: 404 })
    }

    let pipeline = sharp(original)
    pipeline = pipeline.resize(width || undefined, height || undefined, {
      fit: 'inside',
      withoutEnlargement: true
    })

    if (targetExt === 'webp') pipeline = pipeline.webp({ quality: 80 })
    else if (targetExt === 'png') pipeline = pipeline.png({ compressionLevel: 9, palette: true })
    else if (targetExt === 'avif') pipeline = pipeline.avif({ quality: 50 })
    else pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true })

    const out = await pipeline.toBuffer()
    await writeTenantCache(storage, primaryTenantKey, cacheName, out, getContentTypeByExt(targetExt))

    return bufferResponse(out, getContentTypeByExt(targetExt))
  } catch (error) {
    console.error('Resize serve error:', error)
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
  }
}
