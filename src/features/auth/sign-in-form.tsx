"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Loader2 } from "lucide-react"
import { signIn } from "@/lib/auth-client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SignInForm({ signupEnabled = true }: { signupEnabled?: boolean }) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError(null)
    try {
      const result: any = await signIn.magicLink({ 
        email,
        callbackURL: "/dashboard"
      })

      // better-auth client may not throw on 4xx; it can return a response-like object
      const errMsg =
        (result && (result.error?.message || result.error)) ||
        (result && result.status && result.status >= 400 && (result.message || result.statusText))

      if (errMsg) {
        throw new Error(typeof errMsg === "string" ? errMsg : String(errMsg))
      }

      setIsEmailSent(true)
    } catch (error: any) {
      console.error("Failed to send magic link:", error)
      const serverMessage = typeof error?.message === "string" ? error.message : null
      // Show specific server message when available (e.g., "User not found")
      setError(
        serverMessage ||
          (signupEnabled
            ? "We couldn't send a magic link. Please try again."
            : "New signups are disabled. If your email is not already registered, contact your administrator.")
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We've sent a magic link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Click the link in the email to sign in. The link will expire in 10 minutes.
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setIsEmailSent(false)
              setEmail("")
            }}
          >
            Use different email
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Sign in to Serve</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a magic link to sign in
        </CardDescription>
        {!signupEnabled && (
          <div className="mt-3">
            <Alert>
              <AlertTitle>New signups are disabled</AlertTitle>
              <AlertDescription>
                Only existing users can sign in.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Unable to send magic link</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading || !email}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending magic link...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send magic link
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
