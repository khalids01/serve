import { NextRequest, NextResponse } from 'next/server'
import { ApiKeyService } from './lib/api-keys'
import { requireSessionAuth } from './lib/auth-middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle dashboard routes - require session authentication
  if (pathname.startsWith('/dashboard')) {
    const authResult = await requireSessionAuth(request)
    if (authResult) return authResult
  }

  // Handle API routes
  const isApiRoute = pathname.startsWith('/api/')
  const isAuthRoute = pathname.startsWith('/api/auth/')
  const isUploadRoute = pathname.startsWith('/api/upload')
  const isImagesRoute = pathname.startsWith('/api/images')
  const isApplicationsRoute = pathname.startsWith('/api/applications')
  
  // Skip auth routes
  if (isAuthRoute) {
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

  // For applications API routes, require session authentication
  if (isApplicationsRoute) {
    const authResult = await requireSessionAuth(request)
    if (authResult) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/upload/:path*',
    '/api/images/:path*',
    '/api/applications/:path*',
  ]
}
