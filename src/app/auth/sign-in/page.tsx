import { SignInForm } from "@/components/auth/sign-in-form"
import { SiteHeader } from "@/components/core/site-header"

export default function SignInPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      
      <main className="container mx-auto py-24">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to access your file storage dashboard
            </p>
          </div>
          
          <SignInForm />
        </div>
      </main>
    </div>
  )
}
