import Link from "next/link";
import { PublicHeader } from "@/components/core/public-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SignInForm } from "@/features/auth/sign-in-form";
import { getSignupEnabled } from "@/lib/auth-settings";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const { error } = await searchParams;
  const signupEnabled = await getSignupEnabled();
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
                Only existing users can sign in. Contact your administrator to
                request access.
              </AlertDescription>
            </Alert>
          )}

          <SignInForm
            oauthError={typeof error === "string" ? error : undefined}
            signupEnabled={signupEnabled}
            githubEnabled={Boolean(
              process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
            )}
          />
          {signupEnabled && (
            <p className="text-sm text-muted-foreground">
              New to Serve?{" "}
              <Link
                href="/auth/sign-up"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Create an account
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
