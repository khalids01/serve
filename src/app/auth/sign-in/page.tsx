import { SignInForm } from "@/features/auth/sign-in-form"
import { PublicHeader } from "@/components/core/public-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SignInPage() {
  const signupEnabled = process.env.ENABLE_SIGNUP !== 'false'
  return (
    <div className="min-h-screen">
      <PublicHeader />
      
      <main className="container mx-auto py-24">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to access your file storage dashboard
            </p>
          </div>
          {!signupEnabled && (
            <Alert className="max-w-md">
              <AlertTitle>New signups are disabled</AlertTitle>
              <AlertDescription>
                Only existing users can sign in. Contact your administrator to request access.
              </AlertDescription>
            </Alert>
          )}
          
          <SignInForm signupEnabled={signupEnabled} />
        </div>
      </main>
    </div>
  )
}
