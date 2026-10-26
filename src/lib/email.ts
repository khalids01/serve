import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { config } from '@/config'

// Types for better error handling
interface EmailError extends Error {
  code?: string // SMTP error codes like 'EAUTH', 'ECONNECTION', 'ETIMEDOUT'
  response?: string // SMTP server response
}

function isEmailError(e: unknown): e is EmailError {
  return (
    typeof e === 'object' &&
    e !== null &&
    'message' in e
  )
}

interface EmailResult {
  success: boolean
  messageId?: string // Nodemailer message ID for tracking
}

// Email configuration validation
function validateEmailConfig(): void {
  const { email, emailPassword } = config.secrets
  const missing: string[] = []
  if (!email) missing.push('EMAIL')
  if (!emailPassword) missing.push('EMAIL_PASSWORD')

  if (missing.length > 0) {
    throw new Error(`Missing email configuration: ${missing.join(', ')}`)
  }
}

// Create transporter with fallback configuration
function createEmailTransporter(): Transporter | null {
  try {
    validateEmailConfig()
    
    const { host, port } = config.email
    const { email, emailPassword } = config.secrets
    const secure = port === 465

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: email,
        pass: emailPassword,
      },
      // Add connection timeout and retry options
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
      socketTimeout: 10000, // 10 seconds
    })
  } catch (error: unknown) {
    const msg = isEmailError(error) ? error.message : 'Unknown error'
    console.warn('Email configuration not available:', msg)
    return null
  }
}

const transporter = createEmailTransporter()

export async function sendSignInOTPEmail(email: string, otp: string): Promise<EmailResult> {
  if (!transporter) {
    throw new Error('Email service not configured. Please set up SMTP settings.')
  }
  const info = await transporter.sendMail({
    from: `"${config.email.from}" <${config.secrets.email}>`,
    to: email,
    subject: 'Your Serve sign-in code',
    text: `Your Serve sign-in code is ${otp}. It expires in 10 minutes. If you did not request this code, ignore this email.`,
    html: `<h2>Sign in to Serve</h2><p>Your sign-in code is:</p><p style="font-size:32px;letter-spacing:6px;font-weight:bold">${otp}</p><p>This code expires in 10 minutes. If you did not request it, ignore this email.</p>`,
  })
  return { success: true, messageId: info.messageId }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<{ success: boolean; error?: string }> {
  if (!transporter) {
    return { success: false, error: 'Email not configured' }
  }

  try {
    await transporter.verify()
    return { success: true }
  } catch (error: unknown) {
    const msg = isEmailError(error) ? error.message : 'Unknown verification error'
    return { success: false, error: msg }
  }
}

// Send test email
export async function sendTestEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (!transporter) {
    return { success: false, error: 'Email not configured' }
  }

  const mailOptions = {
    from: `"${config.email.from}" <${config.secrets.email}>`,
    to: email,
    subject: 'Serve Email Configuration Test',
    html: `
      <h2>Email Configuration Test</h2>
      <p>If you received this email, your Serve email configuration is working correctly!</p>
      <p><strong>Server:</strong> ${config.email.host}</p>
      <p><strong>Port:</strong> ${config.email.port}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    `,
    text: `
      Email Configuration Test
      
      If you received this email, your Serve email configuration is working correctly!
      
      Server: ${config.email.host}
      Port: ${config.email.port}
      Time: ${new Date().toISOString()}
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error: unknown) {
    const msg = isEmailError(error) ? error.message : 'Unknown email sending error'
    return { success: false, error: msg }
  }
}
