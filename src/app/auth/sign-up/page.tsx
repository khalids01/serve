import Link from "next/link";
import { PublicHeader } from "@/components/core/public-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SignInForm } from "@/features/auth/sign-in-form";
import { getSignupEnabled } from "@/lib/auth-settings";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const signupEnabled = await getSignupEnabled();
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Join Serve</h1>
            <p className="text-muted-foreground">
              {signupEnabled
                ? "Registration is open. Create an account to manage your files."
                : "New account registration is currently closed."}
            </p>
          </div>
          {signupEnabled ? (
            <SignInForm
              mode="sign-up"
              signupEnabled={signupEnabled}
              githubEnabled={Boolean(
                process.env.GITHUB_CLIENT_ID &&
                  process.env.GITHUB_CLIENT_SECRET,
              )}
            />
          ) : (
            <Alert className="max-w-md">
              <AlertTitle>Signups are disabled</AlertTitle>
              <AlertDescription>
                Contact your administrator to request access. Existing users can
                still sign in.
              </AlertDescription>
            </Alert>
          )}
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
