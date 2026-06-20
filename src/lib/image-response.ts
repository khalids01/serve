import { uniqueTenantKeys } from "@/lib/storage/keys";
import { withImageUrls } from "@/lib/image-urls";
import type { Prisma } from "@/lib/prisma-types";

export const imageInclude = {
  variants: true,
  applications: {
    include: {
      application: { select: { id: true, name: true, slug: true } },
    },
  },
} satisfies Prisma.ImageInclude;

type LinkedApplication = {
  id: string;
  name: string;
  slug: string;
};

type ImageApplicationWithApp = {
  applicationId: string;
  originalName: string;
  tags: Prisma.JsonValue;
  application: LinkedApplication;
};

type ImageForResponse = {
  id: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
  variants: Array<{
    id: string;
    label: string;
    filename: string;
    width: number | null;
    height: number | null;
    sizeBytes: number;
  }>;
  applications: ImageApplicationWithApp[];
};

export function getLinkedApplications(
  image: Pick<ImageForResponse, "applications">,
): LinkedApplication[] {
  return image.applications.map((row) => ({
    id: row.application.id,
    name: row.application.name,
    slug: row.application.slug,
  }));
}

export function getLegacyTenantKeys(
  image: Pick<ImageForResponse, "applications">,
): string[] {
  const keys = new Set<string>();
  for (const row of image.applications) {
    for (const key of uniqueTenantKeys(row.application.slug, row.applicationId)) {
      keys.add(key);
    }
  }
  return [...keys];
}

export function getJunctionForApp(
  image: Pick<ImageForResponse, "applications">,
  applicationId?: string,
) {
  if (!applicationId) {
    return image.applications[0];
  }
  return image.applications.find((row) => row.applicationId === applicationId);
}

export function formatImageResponse(
  image: ImageForResponse,
  contextApplicationId?: string,
) {
  const linkedApplications = getLinkedApplications(image);
  const junction = getJunctionForApp(image, contextApplicationId);
  const withUrls = withImageUrls(image, image.id);

  return {
    ...withUrls,
    linkedApplications,
    applicationId: contextApplicationId ?? junction?.applicationId,
    applicationName: junction?.application.name,
    originalName: junction?.originalName ?? image.filename,
    tags: junction?.tags ?? null,
  };
}

export async function userOwnsLinkedImage(
  imageId: string,
  userId: string,
): Promise<boolean> {
  const { prisma } = await import("@/lib/prisma");
  const count = await prisma.imageApplication.count({
    where: {
      imageId,
      application: { ownerId: userId },
    },
  });
  return count > 0;
}

export async function appIsLinkedToImage(
  imageId: string,
  applicationId: string,
): Promise<boolean> {
  const { prisma } = await import("@/lib/prisma");
  const count = await prisma.imageApplication.count({
    where: { imageId, applicationId },
  });
  return count > 0;
}
