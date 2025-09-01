import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { headers } from "next/headers";
import DocsClient from "./docs-client";
import type { Application, ApiKey } from "@/lib/prisma-types";

export interface DocsPageData {
  user: { id: string; name: string; email: string } | null;
  applications: (Application & { apiKeys: ApiKey[] })[];
}

export default async function ApiDocsPage() {
  const headersList = await headers();
  const user = await getCurrentUser(headersList);
  
  let applications: (Application & { apiKeys: ApiKey[] })[] = [];
  
  if (user) {
    applications = await prisma.application.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          { members: { some: { id: user.id } } }
        ]
      },
      include: {
        apiKeys: {
          where: { revoked: false },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  const pageData: DocsPageData = {
    user: user ? { id: user.id, name: user.name || '', email: user.email } : null,
    applications
  };

  return <DocsClient data={pageData} />;
}
