'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { toast } from 'sonner'

export type EmailConfig = { configured: boolean; error: string | null }

export function useEmailConfig() {
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({ configured: false, error: null })
  const [testingEmail, setTestingEmail] = useState(false)
  const [testEmail, setTestEmail] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get<EmailConfig>('/api/admin/email/test')
        setEmailConfig({ configured: data.configured, error: data.error })
      } catch (e) {
        // silent
      }
    })()
  }, [])

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address')
      return
    }
    setTestingEmail(true)
    try {
      await api.post('/api/admin/email/test', { email: testEmail })
      toast.success('Test email sent successfully')
      setTestEmail('')
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to send test email')
    } finally {
      setTestingEmail(false)
    }
  }

  return { emailConfig, testingEmail, testEmail, setTestEmail, sendTestEmail }
}
