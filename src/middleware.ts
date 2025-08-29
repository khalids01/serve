import { NextRequest, NextResponse } from 'next/server'
import { ApiKeyService } from './lib/api-keys'
import { getCurrentUser } from './lib/auth-server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle dashboard routes - require session authentication
  if (pathname.startsWith('/dashboard')) {
    const user = await getCurrentUser(request.headers)
    if (!user) {
      const signInUrl = new URL('/auth/sign-in', request.url)
      signInUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Handle API routes
  const isApiRoute = pathname.startsWith('/api/')
  const isAuthRoute = pathname.startsWith('/api/auth/')
  const isUploadRoute = pathname.startsWith('/api/upload')
  const isImagesRoute = pathname.startsWith('/api/images')
  const isApplicationsRoute = pathname.startsWith('/api/applications')
  // Publicly accessible endpoint to serve image bytes (optionally resized)
  const isPublicImageContent = /^\/api\/images\/[^/]+\/content$/.test(pathname)
  
  // Skip auth routes
  if (isAuthRoute) {
    return NextResponse.next()
  }

  // For upload and images routes, check for API key authentication
  if (isUploadRoute || isImagesRoute) {
    // Allow public access for image content serving
    if (isPublicImageContent) {
      return NextResponse.next()
    }
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (apiKey) {
      try {
        const validation = await ApiKeyService.validateKey(apiKey)
        if (!validation) {
          return NextResponse.json(
            { error: 'Invalid or revoked API key' },
            { status: 401 }
          )
        }
        // API key is valid; forward context as request headers
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', validation.user.id)
        requestHeaders.set('x-application-id', validation.application.id)
        requestHeaders.set('x-api-key-id', validation.apiKey.id)
        return NextResponse.next({ request: { headers: requestHeaders } })
      } catch (error) {
        console.error('API key validation error:', error)
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 500 }
        )
      }
    }

    // Fallback to session-based authentication for dashboard-initiated requests
    const user = await getCurrentUser(request.headers)
    if (!user) {
      return NextResponse.json(
        { error: 'API key required or active session' },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  // For applications API routes, require session authentication
  if (isApplicationsRoute) {
    const user = await getCurrentUser(request.headers)
    if (!user) {
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
  ],
  runtime: 'nodejs'
}
