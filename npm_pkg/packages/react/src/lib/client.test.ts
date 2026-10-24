import { describe, expect, it } from "vitest";
import { BrowserFileServerClient } from "./client";

describe("BrowserFileServerClient", () => {
  it("uses a short-lived bearer token without accepting an API key", async () => {
    const client = new BrowserFileServerClient(
      "https://files.example",
      async () => "browser-token",
      async (_input, init) => {
        expect(new Headers(init?.headers).get("authorization")).toBe(
          "Bearer browser-token",
        );
        return Response.json({
          data: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0,
            hasNext: false,
            hasPrev: false,
          },
        });
      },
    );
    await expect(client.list()).resolves.toMatchObject({ data: [] });
  });
});
it("forces a fresh token once after TOKEN_EXPIRED", async () => {
  const calls: Array<boolean | undefined> = [];
  let attempts = 0;
  const client = new BrowserFileServerClient(
    "https://files.example",
    async (force) => {
      calls.push(force);
      return force ? "fresh" : "old";
    },
    async (_input, init) => {
      attempts++;
      if (attempts === 1)
        return Response.json(
          { error: { code: "TOKEN_EXPIRED", message: "Expired" } },
          { status: 401 },
        );
      expect(new Headers(init?.headers).get("authorization")).toBe(
        "Bearer fresh",
      );
      return Response.json({
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
          hasNext: false,
          hasPrev: false,
        },
      });
    },
  );
  await client.list();
  expect(calls).toEqual([false, true]);
});
it("does not retry an ordinary authorization failure", async () => {
  let attempts = 0;
  const client = new BrowserFileServerClient(
    "https://files.example",
    async () => "token",
    async () => {
      attempts++;
      return Response.json(
        { error: { code: "SCOPE_DENIED", message: "Denied" } },
        { status: 403 },
      );
    },
  );
  await expect(client.remove("a")).rejects.toMatchObject({
    code: "SCOPE_DENIED",
  });
  expect(attempts).toBe(1);
});
