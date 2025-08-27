import { NextRequest, NextResponse } from 'next/server'
import { ApiKeyService } from './lib/api-keys'

export async function middleware(request: NextRequest) {
  // Only apply middleware to API routes that need API key authentication
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth/')
  const isUploadRoute = request.nextUrl.pathname.startsWith('/api/upload')
  const isImagesRoute = request.nextUrl.pathname.startsWith('/api/images')
  
  // Skip auth routes and non-API routes
  if (!isApiRoute || isAuthRoute) {
    return NextResponse.next()
  }

  // For upload and images routes, check for API key authentication
  if (isUploadRoute || isImagesRoute) {
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 401 }
      )
    }

    try {
      const validation = await ApiKeyService.validateKey(apiKey)
      
      if (!validation) {
        return NextResponse.json(
          { error: 'Invalid or revoked API key' },
          { status: 401 }
        )
      }

      // Add user and application info to headers for the API route
      const response = NextResponse.next()
      response.headers.set('x-user-id', validation.user.id)
      response.headers.set('x-application-id', validation.application.id)
      response.headers.set('x-api-key-id', validation.apiKey.id)
      
      return response
    } catch (error) {
      console.error('API key validation error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/upload/:path*',
    '/api/images/:path*',
  ]
}
