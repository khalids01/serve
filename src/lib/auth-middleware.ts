import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from './auth-server'

export async function requireSessionAuth(request: NextRequest): Promise<NextResponse | null> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      // Redirect to sign-in page for dashboard routes
      const signInUrl = new URL('/auth/sign-in', request.url)
      signInUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(signInUrl)
    }

    return null // Continue to the route
  } catch (error) {
    console.error('Session auth error:', error)
    const signInUrl = new URL('/auth/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(signInUrl)
  }
}

export async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      const signInUrl = new URL('/auth/sign-in', request.url)
      signInUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(signInUrl)
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return null // Continue to the route
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
