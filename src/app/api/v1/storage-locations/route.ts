import { config } from "@/config";
import { prisma } from "@/lib/prisma";
import { defaultLocationReady } from "@/lib/storage/locations";
import { getStorageSettings } from "@/lib/storage/settings";
import { preflight, withAuth } from "@/lib/v1-api";
export const OPTIONS = preflight;
export const GET = withAuth("files:read", async (_request, auth) => {
  const app = await prisma.application.findUniqueOrThrow({
    where: { id: auth.applicationId },
    select: { ownerId: true, defaultStorageLocationId: true },
  });
  const settings = await getStorageSettings();
  const rows = await prisma.storageConnection.findMany({
    where: { ownerId: app.ownerId },
    select: { id: true, name: true, enabled: true, deliveryMode: true },
    orderBy: { name: "asc" },
    take: 100,
  });
  return Response.json({
    data: [
      {
        id: "default",
        name: "Default storage",
        kind: config.storage.provider,
        enabled: defaultLocationReady(),
        deliveryMode:
          config.storage.provider === "local"
            ? "proxy"
            : settings.defaultDeliveryMode,
      },
      {
        id: "local",
        name: "Local storage",
        kind: "local",
        enabled: true,
        deliveryMode: "proxy",
      },
      ...rows.map((row) => ({ ...row, kind: "s3" })),
    ],
    defaultStorageLocationId:
      app.defaultStorageLocationId === "default"
        ? settings.defaultUploadDestinationId
        : app.defaultStorageLocationId,
  });
});
