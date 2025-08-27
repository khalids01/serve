'use client'

import { useState, useEffect } from 'react'
import { SiteHeader } from '@/components/core/site-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Shield, Database, Server, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from '@/lib/auth-client'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [emailConfig, setEmailConfig] = useState<{ configured: boolean; error: string | null }>({ configured: false, error: null })
  const [testingEmail, setTestingEmail] = useState(false)
  const [testEmail, setTestEmail] = useState('')

  useEffect(() => {
    checkEmailConfiguration()
  }, [])

  const checkEmailConfiguration = async () => {
    try {
      const response = await fetch('/api/admin/email/test')
      if (response.ok) {
        const data: { configured: boolean; error: string | null } = await response.json()
        setEmailConfig({ configured: data.configured, error: data.error })
      }
    } catch (error) {
      console.error('Error checking email config:', error)
    }
  }

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address')
      return
    }

    setTestingEmail(true)
    try {
      const response = await fetch('/api/admin/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      })

      if (response.ok) {
        toast.success('Test email sent successfully')
        setTestEmail('')
      } else {
        const errorData: { error?: string } = await response.json()
        toast.error(errorData.error || 'Failed to send test email')
      }
    } catch (error) {
      toast.error('Error sending test email')
    } finally {
      setTestingEmail(false)
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and system configuration
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            {session?.user?.role === 'admin' && (
              <TabsTrigger value="admin">Admin</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={session?.user?.email || ''}
                    disabled
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={session?.user?.name || ''}
                    placeholder="Enter your display name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Account Role</Label>
                  <div className="mt-1">
                    <Badge variant={session?.user?.role === 'admin' ? 'default' : 'secondary'}>
                      {session?.user?.role || 'user'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Authentication Method</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    You're using magic link authentication. No password required.
                  </p>
                  <Badge variant="outline">Magic Link</Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Account Activity</h4>
                  <p className="text-sm text-muted-foreground">
                    Last signed in: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Storage Information
                </CardTitle>
                <CardDescription>
                  Your current storage usage and limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Storage Used</p>
                    <p className="text-2xl font-bold">2.4 GB</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Files Uploaded</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  24% of available storage used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  API Usage
                </CardTitle>
                <CardDescription>
                  Your API key usage and rate limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  API usage tracking coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {session?.user?.role === 'admin' && (
            <TabsContent value="admin" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Configuration
                  </CardTitle>
                  <CardDescription>
                    Test and manage email settings for magic link authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    {emailConfig.configured ? (
                      <Badge variant="default">Configured</Badge>
                    ) : (
                      <Badge variant="destructive">Not Configured</Badge>
                    )}
                  </div>

                  {emailConfig.error && (
                    <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-destructive">Configuration Error</p>
                        <p className="text-xs text-destructive/80">{emailConfig.error}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="testEmail">Test Email Address</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="testEmail"
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="Enter email to test"
                        disabled={!emailConfig.configured}
                      />
                      <Button
                        onClick={sendTestEmail}
                        disabled={testingEmail || !emailConfig.configured}
                      >
                        {testingEmail ? 'Sending...' : 'Send Test'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Send a test email to verify your SMTP configuration
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Environment Variables</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>SMTP_HOST:</span>
                        <span className="font-mono">{process.env.SMTP_HOST || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SMTP_PORT:</span>
                        <span className="font-mono">{process.env.SMTP_PORT || '465'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EMAIL:</span>
                        <span className="font-mono">{process.env.EMAIL ? '***@***.***' : 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>
                    Server and application details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="font-mono">0.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Environment:</span>
                    <span className="font-mono">{process.env.NODE_ENV || 'development'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database:</span>
                    <span className="font-mono">SQLite</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}

