import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import sharp from 'sharp'
import { prisma } from '@/lib/prisma'

// Hard cap to avoid extreme CPU usage
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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const url = new URL(request.url)
    const wParam = url.searchParams.get('width') || url.searchParams.get('w')
    const hParam = url.searchParams.get('height') || url.searchParams.get('h')
    const fmtParam = url.searchParams.get('format') || url.searchParams.get('f')

    const width = clamp(wParam ? parseInt(wParam, 10) : null)
    const height = clamp(hParam ? parseInt(hParam, 10) : null)

    // Fetch image metadata
    const image = await prisma.image.findUnique({
      where: { id },
      select: { id: true, filename: true, applicationId: true, contentType: true }
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Resolve paths
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', image.applicationId)
    const originalPath = path.join(uploadsDir, image.filename)

    // If no resize requested, just stream original
    if (!width && !height) {
      try {
        const buf = await fs.readFile(originalPath)
        return new NextResponse(buf, {
          status: 200,
          headers: {
            'Content-Type': image.contentType || 'application/octet-stream',
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        })
      } catch (e) {
        return NextResponse.json({ error: 'Original file not found' }, { status: 404 })
      }
    }

    // Prepare cache
    const targetExt = getTargetExt(fmtParam || undefined)
    const base = path.parse(image.filename).name
    const cacheDir = path.join(uploadsDir, '_cache')
    await fs.mkdir(cacheDir, { recursive: true })

    const cacheName = `${base}${width ? `_w${width}` : ''}${height ? `_h${height}` : ''}.${targetExt}`
    const cachePath = path.join(cacheDir, cacheName)

    // Serve from cache when available
    try {
      const cached = await fs.readFile(cachePath)
      return new NextResponse(cached, {
        status: 200,
        headers: {
          'Content-Type': getContentTypeByExt(targetExt),
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      })
    } catch {}

    // Generate on demand
    const original = await fs.readFile(originalPath)
    let pipeline = sharp(original)

    // Maintain aspect ratio automatically if one dimension missing
    pipeline = pipeline.resize(width || undefined, height || undefined, {
      fit: 'inside',
      withoutEnlargement: true
    })

    // Encode to target
    if (targetExt === 'webp') pipeline = pipeline.webp({ quality: 80 })
    else if (targetExt === 'png') pipeline = pipeline.png({ compressionLevel: 9, palette: true })
    else if (targetExt === 'avif') pipeline = pipeline.avif({ quality: 50 })
    else pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true })

    const out = await pipeline.toBuffer()
    await fs.writeFile(cachePath, out)

    return new NextResponse(out, {
      status: 200,
      headers: {
        'Content-Type': getContentTypeByExt(targetExt),
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (error) {
    console.error('Resize serve error:', error)
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
  }
}
