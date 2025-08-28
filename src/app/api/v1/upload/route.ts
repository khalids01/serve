import { NextRequest, NextResponse } from 'next/server'
import { ApiKeyService } from '@/lib/api-keys'
import { uploadImage } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header. Use: Bearer sk_live_...' },
        { status: 401 }
      )
    }

    const apiKey = authHeader.substring(7) // Remove 'Bearer '
    const validation = await ApiKeyService.validateKey(apiKey)
    
    if (!validation) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    const { application } = validation

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tagsString = formData.get('tags') as string

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    // Parse tags
    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : []

    // Upload the image
    const result = await uploadImage(file, application.id, tags)

    return NextResponse.json({
      success: true,
      image: result
    })

  } catch (error) {
    console.error('V1 Upload error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('File too large')) {
        const maxMb = Number(process.env.MAX_FILE_SIZE ?? '10')
        const limit = Number.isFinite(maxMb) && maxMb > 0 ? Math.floor(maxMb) : 10
        return NextResponse.json(
          { error: `File too large. Maximum size is ${limit}MB.` },
          { status: 413 }
        )
      }
      
      if (error.message.includes('Invalid file type')) {
        return NextResponse.json(
          { error: 'Invalid file type. Only images are allowed.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
