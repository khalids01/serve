import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Protection is now handled inside individual route handlers or layouts
  // using the protect() guard in features/auth/guard.ts for API routes
  // and direct session checks in dashboard layouts.
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
