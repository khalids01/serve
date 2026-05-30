import path from 'path'
import { prisma } from './prisma'
import { FileStorageService } from './file-storage'
import { maxFileSizeBytes } from '@/config'
import type { Image, ImageVariant } from '@/lib/prisma-types'

export async function uploadImage(file: File, applicationId: string, tags: string[] = []) {
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Only images are allowed.')
  }

  const maxSize = maxFileSizeBytes()
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size is ${Math.floor(maxSize / (1024 * 1024))}MB.`)
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileStorage = new FileStorageService()
  
  // Resolve human-readable directory (application slug)
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { id: true, slug: true }
  })
  if (!app) {
    throw new Error('Application not found')
  }

  const uploadResult = await fileStorage.saveFile(
    buffer,
    file.name,
    app.slug,
    file.type
  )

  // Save to database
  const image = await prisma.image.create({
    data: {
      applicationId,
      filename: uploadResult.filename,
      originalName: uploadResult.originalName,
      contentType: uploadResult.contentType,
      sizeBytes: uploadResult.sizeBytes,
      width: uploadResult.width,
      height: uploadResult.height,
      hash: uploadResult.id,
      tags: tags.length > 0 ? tags as any : null,
      variants: {
        create: uploadResult.variants.map(variant => ({
          label: variant.label,
          filename: variant.filename,
          width: variant.width,
          height: variant.height,
          sizeBytes: variant.sizeBytes
        }))
      }
    },
    include: {
      variants: true
    }
  })

  const imageWithVariants = image as Image & { variants: ImageVariant[] }
  const ext = path.extname(imageWithVariants.filename);
  const base = `/api/img/${imageWithVariants.id}${ext}`;
  
  return {
    ...imageWithVariants,
    // Serve via API to avoid direct public file paths
    url: base,
    variants: imageWithVariants.variants.map((variant: ImageVariant) => {
      const params = [
        variant.width ? `w=${variant.width}` : '',
        variant.height ? `h=${variant.height}` : ''
      ].filter(Boolean)
      return { ...variant, url: `${base}${params.length ? `?${params.join('&')}` : ''}` }
    })
  }
}
