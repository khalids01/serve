import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
