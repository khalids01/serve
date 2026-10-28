"use client";

import { Loader2, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { authClient, useSession } from "@/lib/auth-client";

export function ProfilePageClient() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [draftName, setDraftName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const name = draftName ?? session?.user.name ?? "";
  const admin = session?.user.role === "admin";

  if (isPending)
    return (
      <output className="block p-8 text-muted-foreground">
        Loading profile…
      </output>
    );
  if (!session) return null;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 py-6 sm:py-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Your profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage how you appear in Serve and review your account.
        </p>
      </header>
      <div className="grid items-start gap-6 md:grid-cols-[260px_1fr]">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
            <Avatar className="size-20">
              <AvatarFallback className="bg-blue-500/10 text-2xl text-blue-500">
                {(session.user.name || session.user.email)
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 w-full">
              <h2 className="break-words font-semibold">
                {session.user.name || "Your account"}
              </h2>
              <p className="mt-1 break-all text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>
            <Badge variant={admin ? "default" : "secondary"}>
              {admin ? "Administrator" : "Regular user"}
            </Badge>
            <p className="text-xs text-muted-foreground">
              {admin
                ? "You can view users and manage site settings."
                : "You can manage your applications and files."}
            </p>
          </CardContent>
        </Card>
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="size-4" />
                Profile details
              </CardTitle>
              <CardDescription>
                Your display name appears throughout the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-5"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const nextName = name.trim();
                  if (!nextName || nextName.length > 80) {
                    setError(
                      "Enter a display name between 1 and 80 characters.",
                    );
                    return;
                  }
                  setSaving(true);
                  setError("");
                  try {
                    const result = await authClient.updateUser({
                      name: nextName,
                    });
                    if (result.error)
                      throw new Error(
                        result.error.message || "Unable to save your profile.",
                      );
                    await refetch();
                    setDraftName(null);
                    router.refresh();
                    toast.success("Profile updated");
                  } catch (cause) {
                    setError(
                      cause instanceof Error
                        ? cause.message
                        : "Unable to save your profile.",
                    );
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Display name</Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setDraftName(event.target.value)}
                    maxLength={80}
                    required
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={session.user.email}
                    readOnly
                    className="bg-muted/40"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your email identifies your account and cannot be edited
                    here.
                  </p>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="flex justify-end gap-2 border-t pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={saving || draftName === null}
                    onClick={() => {
                      setDraftName(null);
                      setError("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      saving ||
                      !name.trim() ||
                      name.trim() === (session.user.name ?? "")
                    }
                  >
                    {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Save changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-4" />
                Account security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {session.user.emailVerified
                      ? "Email verified"
                      : "Email not yet verified"}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Sign in securely with an emailed code or a linked GitHub
                    account.
                  </p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <dt className="text-muted-foreground">Member since</dt>
                  <dd className="mt-1">
                    {new Date(session.user.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    Current session started
                  </dt>
                  <dd className="mt-1">
                    {new Date(session.session.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
