import { prisma } from './prisma'
import { FileStorageService } from './file-storage'
import type { Image, ImageVariant } from '@/lib/prisma-types'

export async function uploadImage(file: File, applicationId: string, tags: string[] = []) {
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Only images are allowed.')
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB.')
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileStorage = new FileStorageService()
  
  const uploadResult = await fileStorage.saveFile(
    buffer,
    file.name,
    applicationId,
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
    url: fileStorage.getFileUrl(imageWithVariants.filename, applicationId),
    variants: imageWithVariants.variants.map((variant: ImageVariant) => ({
      ...variant,
      url: fileStorage.getFileUrl(variant.filename, applicationId)
    }))
  }
}
