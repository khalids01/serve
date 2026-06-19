"use client";

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
import { useSession } from "@/lib/auth-client";
import { Shield, User } from "lucide-react";

export function ProfilePageClient() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Your account details and security settings
          </p>
        </div>

        <div className="space-y-6 max-w-2xl">
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
                  value={session?.user?.email || ""}
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
                  value={session?.user?.name || ""}
                  placeholder="Enter your display name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Account Role</Label>
                <div className="mt-1">
                  <Badge
                    variant={
                      session?.user?.role === "admin" ? "default" : "secondary"
                    }
                  >
                    {session?.user?.role || "user"}
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
                  You&apos;re using magic link authentication. No password
                  required.
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
        </div>
      </main>
    </div>
  );
}
