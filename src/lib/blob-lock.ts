import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/prisma-types";

// Every dedupe link/upload and v1 deletion takes the same PostgreSQL transaction
// lock. Unlike an in-process mutex this also serializes multiple server workers.
export function withBlobLock<T>(
  hash: string,
  work: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  return prisma.$transaction(
    async (tx) => {
      await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(hashtextextended(${hash}, 0))`;
      return work(tx);
    },
    { maxWait: 30_000, timeout: 120_000 },
  );
}
