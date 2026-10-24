import { describe, expect, it, vi } from "vitest";
import { createFileServer } from "../client";
import { createBrowserTokenHandler } from "./fetch";

describe("browser token handler", () => {
  it("requires an authorization callback and allowed origins", () => {
    const client = createFileServer({
      baseUrl: "https://files.example",
      apiKey: "sk_test",
    });
    expect(() =>
      createBrowserTokenHandler({
        client,
        authorize: async () => true,
        allowedOrigins: [],
        scopes: ["files:read"],
      }),
    ).toThrow();
  });
  it("rejects unauthorized and cross-origin requests before minting", async () => {
    const fetch = vi.fn();
    const client = createFileServer({
      baseUrl: "https://files.example",
      apiKey: "sk_test",
      fetch,
    });
    const handler = createBrowserTokenHandler({
      client,
      authorize: async () => false,
      allowedOrigins: ["https://consumer.example"],
      scopes: ["files:read"],
    });
    expect(
      (
        await handler(
          new Request("https://consumer.example/api/token", { method: "POST" }),
        )
      ).status,
    ).toBe(401);
    expect(
      (
        await handler(
          new Request("https://consumer.example/api/token", {
            method: "POST",
            headers: { origin: "https://attacker.example" },
          }),
        )
      ).status,
    ).toBe(403);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("mints with server-owned policy and keeps responses uncached", async () => {
    const fetch = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        Response.json({
          data: {
            token: "short-lived",
            expiresAt: new Date(Date.now() + 300_000).toISOString(),
          },
        }),
    );
    const client = createFileServer({
      baseUrl: "https://files.example",
      apiKey: "sk_test",
      fetch,
    });
    const handler = createBrowserTokenHandler({
      client,
      authorize: async () => true,
      allowedOrigins: ["https://consumer.example"],
      scopes: ["files:read"],
    });
    const response = await handler(
      new Request("https://consumer.example/api/token", {
        method: "POST",
        body: JSON.stringify({ scopes: ["files:delete"] }),
      }),
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toHaveProperty("data.token", "short-lived");
    expect(JSON.parse(String(fetch.mock.calls[0]?.[1]?.body)).scopes).toEqual([
      "files:read",
    ]);
  });
});

it("accepts a preserved public host behind a proxy without allowing a foreign origin", async () => {
  const client = createFileServer({
    baseUrl: "https://files.example",
    apiKey: "sk_test",
    fetch: async () =>
      Response.json({
        data: {
          token: "browser-token",
          expiresAt: new Date(Date.now() + 300_000).toISOString(),
        },
      }),
  });
  const handler = createBrowserTokenHandler({
    client,
    authorize: async () => true,
    allowedOrigins: ["https://consumer.example"],
    scopes: ["files:read"],
  });
  const request = (origin: string) =>
    new Request("https://0.0.0.0:3000/api/token", {
      method: "POST",
      headers: { host: "consumer.example", origin },
    });
  expect((await handler(request("https://consumer.example"))).status).toBe(200);
  expect((await handler(request("https://attacker.example"))).status).toBe(403);
});
