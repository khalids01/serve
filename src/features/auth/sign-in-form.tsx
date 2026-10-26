"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Github, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SignInForm({ signupEnabled = true, githubEnabled = false }: { signupEnabled?: boolean; githubEnabled?: boolean }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendAt, setResendAt] = useState(0)

  async function run(action: () => Promise<void>) {
    setLoading(true)
    setError(null)
    try { await action() }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in. Please try again.") }
    finally { setLoading(false) }
  }

  async function sendCode() {
    if (Date.now() < resendAt) {
      throw new Error("Please wait a minute before requesting another code.")
    }
    const result = await authClient.emailOtp.sendVerificationOtp({ email: email.trim(), type: "sign-in" })
    if (result.error) throw new Error(result.error.message || "Unable to send code.")
    setSent(true)
    setOtp("")
    setResendAt(Date.now() + 60_000)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>{sent ? "Check your email" : "Sign in to Serve"}</CardTitle>
        <CardDescription>
          {sent ? `Enter the 6-digit code sent to ${email.trim()}. It expires in 10 minutes.` : "Sign in with an email code or your GitHub account."}
        </CardDescription>
        {!signupEnabled && <p className="text-sm text-muted-foreground">Only existing users can sign in.</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault()
          void run(async () => {
            if (!sent) return sendCode()
            const result = await authClient.signIn.emailOtp({ email: email.trim(), otp })
            if (result.error) throw new Error(result.error.message || "Invalid or expired code.")
            router.replace("/dashboard")
            router.refresh()
          })
        }}>
          {sent ? (
            <div className="space-y-2">
              <Label htmlFor="otp">Sign-in code</Label>
              <Input id="otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required disabled={loading} autoFocus />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} placeholder="Enter your email" />
            </div>
          )}
          <Button className="w-full" type="submit" disabled={loading || (sent ? otp.length !== 6 : !email.trim())}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {sent ? "Verify and sign in" : "Send sign-in code"}
          </Button>
        </form>
        {sent && <>
          <Button variant="outline" className="w-full" disabled={loading} onClick={() => void run(sendCode)}>Resend code</Button>
          <Button variant="ghost" className="w-full" disabled={loading} onClick={() => { setSent(false); setOtp(""); setError(null) }}>Use a different email</Button>
        </>}
        {githubEnabled && <Button variant="outline" className="w-full" disabled={loading} onClick={() => void run(async () => {
          const result = await authClient.signIn.social({ provider: "github", callbackURL: "/dashboard", errorCallbackURL: "/auth/sign-in" })
          if (result.error) throw new Error(result.error.message || "Unable to sign in with GitHub.")
        })}><Github className="mr-2 h-4 w-4" />Continue with GitHub</Button>}
      </CardContent>
    </Card>
  )
}
