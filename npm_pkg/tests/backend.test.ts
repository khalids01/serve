import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ validateKey: vi.fn() }));
vi.mock("@/lib/api-keys", () => ({
  ApiKeyService: { validateKey: mocks.validateKey },
}));

import {
  authenticate,
  createBrowserToken,
  preflight,
  withAuth,
} from "../../src/lib/v1-api";
import { browserTokenInputSchema } from "../packages/contracts/src";

const origin = "https://consumer.example";
beforeEach(() => {
  process.env.FILE_SERVER_BROWSER_TOKEN_SECRET =
    "a-test-secret-with-at-least-32-characters";
});
async function requestToken(
  scopes = ["files:read"] as Array<"files:read" | "files:write">,
  seconds = 300,
) {
  return createBrowserToken("app-a", {
    scopes,
    allowedOrigins: [origin],
    expiresInSeconds: seconds,
  });
}
function request(token: string, from: string | null = origin) {
  return new NextRequest("https://files.example/api/v1/files", {
    headers: {
      authorization: `Bearer ${token}`,
      ...(from ? { origin: from } : {}),
    },
  });
}
describe("browser token boundaries", () => {
  it("binds access to its application and scope", async () => {
    const { token } = await requestToken();
    await expect(
      authenticate(request(token), "files:read"),
    ).resolves.toMatchObject({ applicationId: "app-a", apiKey: false });
    const denied = await authenticate(request(token), "files:delete");
    expect(denied).toHaveProperty("status", 403);
  });
  it.each(["https://attacker.example", null])(
    "rejects wrong/missing origin %s",
    async (from) => {
      const { token } = await requestToken();
      expect(
        await authenticate(request(token, from), "files:read"),
      ).toHaveProperty("status", 403);
    },
  );
  it("rejects tampering and expired tokens", async () => {
    const { token } = await requestToken();
    expect(
      await authenticate(
        request(`${token.slice(0, -8)}tampered`),
        "files:read",
      ),
    ).toHaveProperty("status", 401);
    vi.useFakeTimers();
    try {
      const short = await requestToken(["files:read"], 1);
      vi.advanceTimersByTime(2000);
      const response = await authenticate(request(short.token), "files:read");
      expect(await (response as Response).json()).toMatchObject({
        error: { code: "TOKEN_EXPIRED" },
      });
    } finally {
      vi.useRealTimers();
    }
  });
  it("rejects invalid TTL, origins and application injection", () => {
    const valid = { scopes: ["files:read"], allowedOrigins: [origin] };
    for (const extra of [
      { expiresInSeconds: 901 },
      { allowedOrigins: ["https://consumer.example/path"] },
      { applicationId: "other" },
      { scopes: [] },
    ])
      expect(
        browserTokenInputSchema.safeParse({ ...valid, ...extra }).success,
      ).toBe(false);
  });
  it("never accepts browser API keys and adds CORS after validated auth", async () => {
    expect(
      await authenticate(request("sk_secret"), "files:read"),
    ).toHaveProperty("status", 403);
    const { token } = await requestToken();
    const handler = withAuth("files:read", async () =>
      Response.json({ ok: true }),
    );
    const response = await handler(request(token));
    expect(response.headers.get("access-control-allow-origin")).toBe(origin);
    const bad = await handler(request(token, "https://attacker.example"));
    expect(bad.status).toBe(403);
    expect(bad.headers.has("access-control-allow-origin")).toBe(false);
    expect(
      preflight(
        new NextRequest("https://files.example/api/v1/files", {
          method: "OPTIONS",
          headers: { origin },
        }),
      ).status,
    ).toBe(204);
  });
  it("authenticates before the handler reads a body", async () => {
    const handler = vi.fn(async () => Response.json({ ok: true }));
    expect(
      (
        await withAuth(
          "files:write",
          handler,
        )(
          new NextRequest("https://files.example/api/v1/files", {
            method: "POST",
            body: "invalid",
          }),
        )
      ).status,
    ).toBe(401);
    expect(handler).not.toHaveBeenCalled();
  });
});
