import { SettingsPage } from "@/features/settings/settings-page";
import { requireAuth } from "@/lib/auth-server";
import { getSignupEnabled } from "@/lib/auth-settings";

export default async function AdminSettingsPage() {
  const user = await requireAuth();
  return (
    <SettingsPage
      isAdmin={user.role === "admin"}
      initialSignupEnabled={
        user.role === "admin" ? await getSignupEnabled() : false
      }
    />
  );
}
