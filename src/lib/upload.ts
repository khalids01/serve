import { prisma } from './prisma'
import { maxFileSizeBytes } from '@/config'
import { processImageUpload } from '@/lib/image-upload'

export async function uploadImage(file: File, applicationId: string, tags: string[] = []) {
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Only images are allowed.')
  }

  const maxSize = maxFileSizeBytes()
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size is ${Math.floor(maxSize / (1024 * 1024))}MB.`)
  }

  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { id: true, slug: true }
  })
  if (!app) {
    throw new Error('Application not found')
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  return processImageUpload(
    buffer,
    file.name,
    file.type,
    applicationId,
    tags.length > 0 ? tags : null,
  )
}
