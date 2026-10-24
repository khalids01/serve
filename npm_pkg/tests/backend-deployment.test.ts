import { afterEach, beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ findFirst: vi.fn(), startBackup: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { application: { findFirst: mocks.findFirst } },
}));
vi.mock("@/lib/backup-scheduler", () => ({
  startBackupScheduler: mocks.startBackup,
}));

import { GET } from "../../src/app/api/health/route";
import { register } from "../../src/instrumentation";

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.unstubAllEnvs());
it("health checks the migrated table without exposing application data", async () => {
  mocks.findFirst.mockResolvedValue({ id: "private-id" });
  vi.stubEnv("SERVE_COMMIT", "release-sha");
  const response = await GET();
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(await response.json()).toEqual({
    status: "ok",
    commit: "release-sha",
  });
  expect(mocks.findFirst).toHaveBeenCalledWith({ select: { id: true } });
});
it("health fails closed without leaking database errors", async () => {
  mocks.findFirst.mockRejectedValue(
    new Error("private database connection details"),
  );
  const response = await GET();
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({ status: "unavailable" });
});
it("production builds do not start the backup scheduler", async () => {
  vi.stubEnv("NEXT_RUNTIME", "nodejs");
  vi.stubEnv("NEXT_PHASE", "phase-production-build");
  await register();
  expect(mocks.startBackup).not.toHaveBeenCalled();
});
it("the Node server still starts its backup scheduler at runtime", async () => {
  vi.stubEnv("NEXT_RUNTIME", "nodejs");
  vi.stubEnv("NEXT_PHASE", "phase-production-server");
  await register();
  expect(mocks.startBackup).toHaveBeenCalledTimes(1);
});
