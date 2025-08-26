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

  constructor(baseUploadDir = 'public/uploads') {
    this.baseUploadDir = baseUploadDir
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

        // Generate variants
        const variants = [
          { label: 'thumb', width: 150, height: 150 },
          { label: 'small', width: 400 },
          { label: 'medium', width: 800 },
          { label: 'large', width: 1200 }
        ]

        for (const variant of variants) {
          if (metadata.width && metadata.width > variant.width) {
            const variantBuffer = await image
              .resize(variant.width, variant.height, { 
                fit: variant.height ? 'cover' : 'inside',
                withoutEnlargement: true 
              })
              .jpeg({ quality: 85 })
              .toBuffer()

            const variantFilename = `${fileId}_${variant.label}.jpg`
            const variantPath = path.join(appDir, variantFilename)
            await fs.writeFile(variantPath, variantBuffer)

            const variantMetadata = await sharp(variantBuffer).metadata()
            result.variants.push({
              label: variant.label,
              filename: variantFilename,
              width: variantMetadata.width,
              height: variantMetadata.height,
              sizeBytes: variantBuffer.length
            })
          }
        }
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
    return `/uploads/${applicationId}/${filename}`
  }
}
