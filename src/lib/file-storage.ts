import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { createHash } from 'crypto'

export interface FileUploadResult {
  id: string
  filename: string
  originalName: string
  contentType: string
  sizeBytes: number
  width?: number
  height?: number
  hash?: string
  variants: Array<{
    label: string
    filename: string
    width?: number
    height?: number
    sizeBytes: number
  }>
}

export class FileStorageService {
  private baseUploadDir: string

  constructor(baseUploadDir = process.env.UPLOAD_DIR || 'uploads') {
    const dir = baseUploadDir
    this.baseUploadDir = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir)
  }

  async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath)
    } catch {
      await fs.mkdir(dirPath, { recursive: true })
    }
  }

  async saveFile(
    buffer: Buffer,
    originalName: string,
    applicationId: string,
    contentType: string
  ): Promise<FileUploadResult> {
    const fileId = createHash('sha256').update(buffer).digest('hex').substring(0, 16)
    const ext = path.extname(originalName)
    const filename = `${fileId}${ext}`
    
    const appDir = path.join(this.baseUploadDir, applicationId)
    await this.ensureDirectoryExists(appDir)
    
    const filePath = path.join(appDir, filename)
    await fs.writeFile(filePath, buffer)

    const result: FileUploadResult = {
      id: fileId,
      filename,
      originalName,
      contentType,
      sizeBytes: buffer.length,
      variants: []
    }

    // Process image files
    if (contentType.startsWith('image/')) {
      try {
        const image = sharp(buffer)
        const metadata = await image.metadata()
        
        result.width = metadata.width
        result.height = metadata.height

        // Optionally downscale very large images to reduce file size
        const maxDimEnv = Number(process.env.ORIGINAL_MAX_DIM || '2560')
        const MAX_DIM = Number.isFinite(maxDimEnv) && maxDimEnv > 0 ? Math.floor(maxDimEnv) : 2560
        let processedBuffer = buffer
        if (
          (metadata.width && metadata.width > MAX_DIM) ||
          (metadata.height && metadata.height > MAX_DIM)
        ) {
          processedBuffer = await sharp(buffer)
            .resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
            .toBuffer()
          const resizedMeta = await sharp(processedBuffer).metadata()
          result.width = resizedMeta.width
          result.height = resizedMeta.height
        }

        // 1) Optimize the original in its native format (mobile-friendly)
        try {
          let optimizedBuffer: Buffer
          const format = (metadata.format || '').toLowerCase()
          if (format === 'jpeg' || format === 'jpg') {
            optimizedBuffer = await sharp(processedBuffer)
              .jpeg({
                quality: 80, // reduce size while preserving good visual quality
                mozjpeg: true,
                chromaSubsampling: '4:2:0',
                progressive: true
              })
              .toBuffer()
          } else if (format === 'png') {
            optimizedBuffer = await sharp(processedBuffer)
              .png({
                compressionLevel: 9,
                palette: true,
                quality: 80, // stronger quantization for smaller files
                colors: 128
              })
              .toBuffer()
          } else if (format === 'webp') {
            optimizedBuffer = await sharp(processedBuffer).webp({ quality: 80 }).toBuffer()
          } else {
            optimizedBuffer = await sharp(processedBuffer).toBuffer()
          }
          await fs.writeFile(filePath, optimizedBuffer)
          result.sizeBytes = optimizedBuffer.length

          // 2) Generate a same-dimensions WebP copy for the web (if not already WebP)
          if (format !== 'webp') {
            const webpBuffer = await sharp(processedBuffer).webp({ quality: 80 }).toBuffer()
            const webpFilename = `${fileId}.webp`
            const webpPath = path.join(appDir, webpFilename)
            await fs.writeFile(webpPath, webpBuffer)

            const webpMetadata = await sharp(webpBuffer).metadata()
            result.variants.push({
              label: 'webp',
              filename: webpFilename,
              width: webpMetadata.width,
              height: webpMetadata.height,
              sizeBytes: webpBuffer.length
            })
          }
        } catch (e) {
          console.error('Error optimizing original or generating WebP:', e)
        }

        // Skip generating preset size variants to reduce storage.
        // On-demand resizing is supported via `/api/img/:name?w=...&h=...`.
      } catch (error) {
        console.error('Error processing image:', error)
      }
    }

    return result
  }

  async deleteFile(filename: string, applicationId: string): Promise<void> {
    const appDir = path.join(this.baseUploadDir, applicationId)
    const filePath = path.join(appDir, filename)
    
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  getFileUrl(filename: string, applicationId: string): string {
    // Public serving is handled by the image route; application scoping is internal
    return `/api/img/${filename}`
  }
}
