import type { ApiKey, Application } from "@/lib/prisma-types";
export interface DocsPageData {
  user: { id: string; name: string; email: string } | null;
  applications: (Application & { apiKeys: ApiKey[] })[];
}
