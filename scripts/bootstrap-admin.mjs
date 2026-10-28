import { pathToFileURL } from "node:url";
import { PrismaClient } from "../prisma/generated/prisma/index.js";

export async function bootstrapAdmin(prisma, adminEmail) {
  const email = adminEmail?.trim().toLowerCase();
  if (
    !email ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw new Error("Set ADMIN_EMAIL to a valid administrator email address.");
  }
  return prisma.$transaction(async (tx) => {
    // Serialize startup across replicas; never create a second account for a case variant.
    await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(hashtextextended(${`bootstrap-admin:${email}`}, 0))`;
    const matches = await tx.user.findMany({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true, email: true, role: true },
      take: 2,
    });
    if (matches.length > 1)
      throw new Error(
        "Multiple accounts match ADMIN_EMAIL. Resolve the duplicate email addresses before continuing.",
      );
    if (matches[0]) {
      return matches[0].role === "admin" && matches[0].email === email
        ? matches[0]
        : tx.user.update({
            where: { id: matches[0].id },
            data: { role: "admin", email },
            select: { id: true, email: true, role: true },
          });
    }
    return tx.user.upsert({
      where: { email },
      update: { role: "admin" },
      create: {
        email,
        name: email.split("@")[0],
        role: "admin",
        emailVerified: false,
      },
      select: { id: true, email: true, role: true },
    });
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    process.loadEnvFile();
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const prisma = new PrismaClient();
  try {
    const user = await bootstrapAdmin(prisma, process.env.ADMIN_EMAIL);
    console.info(`Admin account ready: ${user.email}`);
  } catch (error) {
    console.error(`Admin setup failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}
