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
    const { id: rawId } = await context.params
    const url = new URL(request.url)
    const wParam = url.searchParams.get('width') || url.searchParams.get('w')
    const hParam = url.searchParams.get('height') || url.searchParams.get('h')
    const fmtParam = url.searchParams.get('format') || url.searchParams.get('f')

    // Support both `/api/images/:id/content` and `/api/images/:id.ext/content`
    const [id, idExt] = rawId.includes('.') ? ((): [string, string | null] => {
      const dotIdx = rawId.indexOf('.')
      return [rawId.slice(0, dotIdx), rawId.slice(dotIdx + 1).toLowerCase()]
    })() : [rawId, null]

    const width = clamp(wParam ? parseInt(wParam, 10) : null)
    const height = clamp(hParam ? parseInt(hParam, 10) : null)

    // Fetch image metadata (by ID only)
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

    // Resolve paths using project-root uploads directory (slug-based)
    const baseUploads = process.env.UPLOAD_DIR || 'uploads'
    const uploadsRoot = path.isAbsolute(baseUploads) ? baseUploads : path.join(process.cwd(), baseUploads)
    const dirKey = image.application?.slug || image.applicationId
    const uploadsDir = path.join(uploadsRoot, dirKey)
    const legacyUploadsDir = path.join(uploadsRoot, image.applicationId)
    const originalPathPrimary = path.join(uploadsDir, image.filename)
    const originalPathLegacy = path.join(legacyUploadsDir, image.filename)

    // Determine target format: query param wins, otherwise use extension from path if provided
    const targetExt = getTargetExt((fmtParam || idExt) || undefined)
    const origExt = path.extname(image.filename).replace('.', '').toLowerCase()

    // If no resize requested and no transcode requested, stream original
    if (!width && !height && (!idExt || targetExt === origExt) && !fmtParam) {
      try {
        let buf: Buffer
        try {
          buf = await fs.readFile(originalPathPrimary)
        } catch {
          // Fallback to legacy applicationId-based directory
          buf = await fs.readFile(originalPathLegacy)
        }
        const body = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
        return new NextResponse(body as ArrayBuffer, {
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

    // Special-case: requesting the uploaded WebP copy without resize
    if (!width && !height && targetExt === 'webp') {
      const webpName = `${path.parse(image.filename).name}.webp`
      const webpPrimary = path.join(uploadsDir, webpName)
      const webpLegacy = path.join(legacyUploadsDir, webpName)
      try {
        let buf: Buffer
        try {
          buf = await fs.readFile(webpPrimary)
        } catch {
          buf = await fs.readFile(webpLegacy)
        }
        const body = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
        return new NextResponse(body as ArrayBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'image/webp',
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        })
      } catch {}
    }

    // Prepare cache (includes format in extension)
    const base = path.parse(image.filename).name
    const cacheDir = path.join(uploadsDir, '_cache')
    await fs.mkdir(cacheDir, { recursive: true })

    const cacheName = `${base}${width ? `_w${width}` : ''}${height ? `_h${height}` : ''}.${targetExt}`
    const cachePath = path.join(cacheDir, cacheName)

    // Serve from cache when available
    try {
      const cached = await fs.readFile(cachePath)
      const body = cached.buffer.slice(cached.byteOffset, cached.byteOffset + cached.byteLength)
      return new NextResponse(body as ArrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': getContentTypeByExt(targetExt),
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      })
    } catch {}

    // Generate on demand
    // Read original (with legacy fallback)
    let original: Buffer
    try {
      original = await fs.readFile(originalPathPrimary)
    } catch {
      original = await fs.readFile(originalPathLegacy)
    }
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

    const body = out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength)
    return new NextResponse(body as ArrayBuffer, {
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
