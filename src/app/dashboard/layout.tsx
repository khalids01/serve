import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { PublicHeader } from "@/components/core/public-header";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen">
      <PublicHeader />
      {children}
    </div>
  );
}
