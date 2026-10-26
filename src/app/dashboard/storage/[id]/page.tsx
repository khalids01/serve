import { notFound } from "next/navigation";
import { config } from "@/config";
import { StorageBrowser } from "@/features/storage/storage-browser";
import { requireAuth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export default async function StorageBrowserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ prefix?: string; cursor?: string; trash?: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const query = await searchParams;
  const name =
    id === "local"
      ? "Local storage"
      : id === "default"
        ? `Default storage (${config.storage.provider === "s3" ? "S3" : "Local"})`
        : (
            await prisma.storageConnection.findFirst({
              where: { id, ownerId: user.id },
              select: { name: true },
            })
          )?.name;
  if (!name) notFound();
  return (
    <StorageBrowser
      userId={user.id}
      id={id}
      name={name}
      prefix={query.prefix ?? ""}
      cursor={query.cursor}
      trash={query.trash === "1"}
    />
  );
}
