import { NextRequest, NextResponse } from 'next/server'
import { testEmailConfiguration, sendTestEmail } from '@/lib/email'
import { protect } from '@/features/auth/guard'
import { config } from '@/config'

export async function GET(request: NextRequest) {
  try {
    const auth = await protect(request)
    if (auth instanceof NextResponse) return auth

    const result = await testEmailConfiguration()
    const { host, port } = config.email
    const { email } = config.secrets

    return NextResponse.json({
      configured: result.success,
      error: result.error || null,
      timestamp: new Date().toISOString(),
      smtp: {
        host,
        port,
        emailConfigured: Boolean(email),
      },
    })
  } catch (error) {
    console.error('Email configuration test error:', error)

    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to test email configuration' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await protect(request)
    if (auth instanceof NextResponse) return auth

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    const result = await sendTestEmail(email)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully'
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Send test email error:', error)

    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}
