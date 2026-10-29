"use client";

import { AlertTriangle, Database, Mail, Server } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard";
import { useEmailConfig } from "@/features/settings/hooks/use-email-config";
import { StorageDefaultsForm } from "@/features/storage/storage-policies";

export function SettingsPage({
  initialSignupEnabled,
}: {
  initialSignupEnabled: boolean;
}) {
  const [signupEnabled, setSignupEnabled] = useState(initialSignupEnabled);
  const [savingSignup, setSavingSignup] = useState(false);
  const [signupError, setSignupError] = useState("");
  async function changeSignup(value: boolean) {
    setSavingSignup(true);
    setSignupError("");
    try {
      const response = await fetch("/api/admin/auth-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupEnabled: value }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error ?? "Unable to update signup settings.");
      setSignupEnabled(data.signupEnabled);
      toast.success(
        data.signupEnabled ? "New signups enabled" : "New signups disabled",
      );
    } catch (error) {
      setSignupError(
        error instanceof Error
          ? error.message
          : "Unable to update signup settings.",
      );
    } finally {
      setSavingSignup(false);
    }
  }
  const { stats, isLoading } = useDashboardData();
  const { emailConfig, testingEmail, testEmail, setTestEmail, sendTestEmail } =
    useEmailConfig();

  const databaseLabel = "PostgreSQL";

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            System configuration and storage information
          </p>
        </div>

        <div className="space-y-6">
          <StorageDefaultsForm />
          <Card>
            <CardHeader>
              <CardTitle>Account registration</CardTitle>
              <CardDescription>
                Control who can create a new Serve account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-6">
                <div className="space-y-1">
                  <Label htmlFor="allow-signup">Allow new signups</Label>
                  <p className="text-sm text-muted-foreground">
                    Applies to email codes and GitHub. Existing users can always
                    sign in.
                  </p>
                </div>
                <Switch
                  id="allow-signup"
                  checked={signupEnabled}
                  onCheckedChange={(value) => void changeSignup(value)}
                  disabled={savingSignup}
                  aria-describedby="signup-status"
                />
              </div>
              <p
                id="signup-status"
                aria-live="polite"
                className="text-xs text-muted-foreground"
              >
                {savingSignup
                  ? "Saving…"
                  : signupEnabled
                    ? "New account registration is enabled."
                    : "New account registration is disabled."}{" "}
                Changes take effect immediately.
              </p>
              {signupError && (
                <p role="alert" className="text-sm text-destructive">
                  {signupError}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Storage Information
              </CardTitle>
              <CardDescription>
                Your current storage usage across all applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Storage Used</p>
                  <p className="text-2xl font-bold">
                    {isLoading ? "—" : stats.storageUsed}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Files Uploaded</p>
                  <p className="text-2xl font-bold">
                    {isLoading ? "—" : stats.totalFiles.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Includes original files and upload-time variants (WebP,
                placeholders). Resize cache is managed separately on the Cache
                page.
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Test the SMTP connection used to send sign-in codes.
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
                    <p className="text-sm font-medium text-destructive">
                      Configuration Error
                    </p>
                    <p className="text-xs text-destructive/80">
                      {emailConfig.error}
                    </p>
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
                    {testingEmail ? "Sending..." : "Send Test"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Send a test email to verify your SMTP configuration
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">SMTP Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>SMTP_HOST:</span>
                    <span className="font-mono">
                      {emailConfig.smtp?.host || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SMTP_PORT:</span>
                    <span className="font-mono">
                      {emailConfig.smtp?.port ?? "465"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>EMAIL:</span>
                    <span className="font-mono">
                      {emailConfig.smtp?.emailConfigured
                        ? "***@***.***"
                        : "Not set"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Server and application details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Version:</span>
                <span className="font-mono">0.1.0</span>
              </div>
              <div className="flex justify-between">
                <span>Environment:</span>
                <span className="font-mono">
                  {process.env.NODE_ENV || "development"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Database:</span>
                <span className="font-mono">{databaseLabel}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
