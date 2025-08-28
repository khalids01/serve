import { prisma } from './prisma'
import { FileStorageService } from './file-storage'
import type { Image, ImageVariant } from '@/lib/prisma-types'

export async function uploadImage(file: File, applicationId: string, tags: string[] = []) {
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Only images are allowed.')
  }

  // Check file size (env-configurable, defaults to 10MB)
  const maxMb = Number(process.env.MAX_FILE_SIZE ?? '10')
  const maxSize = (Number.isFinite(maxMb) && maxMb > 0 ? maxMb : 10) * 1024 * 1024
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
      id: uploadResult.id,
      applicationId,
      filename: uploadResult.filename,
      originalName: uploadResult.originalName,
      contentType: uploadResult.contentType,
      sizeBytes: uploadResult.sizeBytes,
      width: uploadResult.width,
      height: uploadResult.height,
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
  
  return {
    ...imageWithVariants,
    // Serve via API to avoid direct public file paths
    url: `/api/images/${imageWithVariants.id}/content`,
    variants: imageWithVariants.variants.map((variant: ImageVariant) => {
      const base = `/api/images/${imageWithVariants.id}/content`
      // For the 'webp' variant, request webp explicitly, no resize params
      if ((variant as any).label === 'webp') {
        return { ...variant, url: `${base}?f=webp` }
      }
      const params = [
        variant.width ? `w=${variant.width}` : '',
        variant.height ? `h=${variant.height}` : ''
      ].filter(Boolean)
      return { ...variant, url: `${base}${params.length ? `?${params.join('&')}` : ''}` }
    })
  }
}
