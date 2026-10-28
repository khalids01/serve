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
  const matches = await prisma.user.findMany({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, role: true },
    take: 2,
  });
  if (matches.length > 1)
    throw new Error(
      "Multiple accounts match ADMIN_EMAIL. Resolve the duplicate email addresses before continuing.",
    );
  const user = matches[0];
  if (!user)
    throw new Error(
      "No account matches ADMIN_EMAIL. Sign up with that email first, then run this command again.",
    );
  return user.role === "admin"
    ? user
    : prisma.user.update({
        where: { id: user.id },
        data: { role: "admin" },
        select: { id: true, email: true, role: true },
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
