import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireAuth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

const pageSize = 25;
export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const currentUser = await requireAuth();
  if (currentUser.role !== "admin") redirect("/dashboard");
  const query = await searchParams;
  const search = (typeof query.q === "string" ? query.q : "")
    .trim()
    .slice(0, 100);
  const page = Math.min(
    10000,
    Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1),
  );
  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize + 1,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      banned: true,
      createdAt: true,
    },
  });
  const hasNext = users.length > pageSize && page < 10000;
  const pageURL = (number: number) =>
    `/dashboard/users?${new URLSearchParams({ ...(search ? { q: search } : {}), page: String(number) })}`;
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 py-6 sm:py-8">
      <header className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
          <Users className="size-6" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Registered accounts and their access to Serve.
          </p>
        </div>
      </header>
      <form action="/dashboard/users" className="flex max-w-lg gap-2">
        <Input
          name="q"
          defaultValue={search}
          maxLength={100}
          placeholder="Search by name or email"
          aria-label="Search users by name or email"
        />
        <Button variant="outline">
          <Search className="mr-2 size-4" />
          Search
        </Button>
      </form>
      <Card className="overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">User</th>
                  <th className="px-5 py-4 font-medium">Role</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.slice(0, pageSize).map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {user.name || "Unnamed user"}
                        {user.id === currentUser.id && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            You
                          </span>
                        )}
                      </p>
                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role === "admin" ? "Admin" : "User"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {user.banned
                        ? "Banned"
                        : user.emailVerified
                          ? "Verified"
                          : "Unverified"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-muted-foreground">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!users.length && (
            <p className="p-12 text-center text-sm text-muted-foreground">
              {search
                ? "No users match your search."
                : "No users on this page."}
            </p>
          )}
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Page {page} · Up to {pageSize} users per page
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Button asChild size="sm" variant="outline">
                  <Link href={pageURL(page - 1)}>
                    <ChevronLeft className="mr-1 size-4" />
                    Previous
                  </Link>
                </Button>
              )}
              {hasNext && (
                <Button asChild size="sm" variant="outline">
                  <Link href={pageURL(page + 1)}>
                    Next
                    <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </footer>
        </CardContent>
      </Card>
    </main>
  );
}
