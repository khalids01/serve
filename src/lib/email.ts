import nodemailer from 'nodemailer'

// Email configuration validation
function validateEmailConfig() {
  const required = ['SMTP_HOST', 'EMAIL', 'EMAIL_PASSWORD']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing email configuration: ${missing.join(', ')}`)
  }
}

// Create transporter with fallback configuration
function createEmailTransporter() {
  try {
    validateEmailConfig()
    
    const port = parseInt(process.env.SMTP_PORT || '465')
    const secure = port === 465 // true for 465, false for other ports
    
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      // Add connection timeout and retry options
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
      socketTimeout: 10000, // 10 seconds
    })
  } catch (error) {
    console.warn('Email configuration not available:', error.message)
    return null
  }
}

const transporter = createEmailTransporter()

export async function sendMagicLinkEmail(email: string, magicLinkUrl: string) {
  // Check if email is configured
  if (!transporter) {
    console.warn('Email not configured - magic link cannot be sent')
    throw new Error('Email service not configured. Please set up SMTP settings.')
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM || 'Serve'}" <${process.env.EMAIL}>`,
    to: email,
    subject: 'Sign in to Serve - File Storage Server',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sign in to Serve</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">🚀 Serve</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0;">Open Source File Storage Server</p>
          </div>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Sign in to your account</h2>
            <p style="color: #4b5563; margin-bottom: 25px;">
              Click the button below to securely sign in to your Serve account. This link will expire in 10 minutes.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLinkUrl}" 
                 style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                Sign In to Serve
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
              If you didn't request this email, you can safely ignore it.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This email was sent from Serve File Storage Server
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      Sign in to Serve - File Storage Server
      
      Click the link below to sign in to your account:
      ${magicLinkUrl}
      
      This link will expire in 10 minutes.
      
      If you didn't request this email, you can safely ignore it.
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Magic link email sent successfully to:', email)
    console.log('Message ID:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send magic link email:', error)
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your email credentials.')
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Cannot connect to email server. Please check your SMTP settings.')
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Email sending timed out. Please try again.')
    } else {
      throw new Error(`Failed to send email: ${error.message}`)
    }
  }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<{ success: boolean; error?: string }> {
  if (!transporter) {
    return { success: false, error: 'Email not configured' }
  }

  try {
    await transporter.verify()
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Send test email
export async function sendTestEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (!transporter) {
    return { success: false, error: 'Email not configured' }
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM || 'Serve'}" <${process.env.EMAIL}>`,
    to: email,
    subject: 'Serve Email Configuration Test',
    html: `
      <h2>Email Configuration Test</h2>
      <p>If you received this email, your Serve email configuration is working correctly!</p>
      <p><strong>Server:</strong> ${process.env.SMTP_HOST}</p>
      <p><strong>Port:</strong> ${process.env.SMTP_PORT || '465'}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    `,
    text: `
      Email Configuration Test
      
      If you received this email, your Serve email configuration is working correctly!
      
      Server: ${process.env.SMTP_HOST}
      Port: ${process.env.SMTP_PORT || '465'}
      Time: ${new Date().toISOString()}
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
