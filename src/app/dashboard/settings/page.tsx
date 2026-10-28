import { redirect } from "next/navigation";
import { SettingsPage } from "@/features/settings/settings-page";
import { requireAuth } from "@/lib/auth-server";
import { getSignupEnabled } from "@/lib/auth-settings";

export default async function AdminSettingsPage() {
  const user = await requireAuth();
  if (user.role !== "admin") redirect("/dashboard");
  return <SettingsPage initialSignupEnabled={await getSignupEnabled()} />;
}
