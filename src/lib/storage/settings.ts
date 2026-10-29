import { z } from "zod";
import { prisma } from "@/lib/prisma";
export const deliveryMode = z.enum(["proxy", "direct"]);
export const storageSettingsInput = z
  .object({
    defaultUploadDestinationId: z.enum(["default", "local"]),
    defaultDeliveryMode: deliveryMode,
  })
  .strict();
export async function getStorageSettings() {
  return (
    (await prisma.storageSettings.findUnique({ where: { id: "default" } })) ?? {
      defaultUploadDestinationId: "default",
      defaultDeliveryMode: "proxy",
    }
  );
}
export function getStoragePreference(ownerId: string) {
  return prisma.storagePreference.findUnique({ where: { ownerId } });
}
