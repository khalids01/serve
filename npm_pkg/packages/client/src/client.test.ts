import { describe, expect, it } from "vitest";
import { BrowserFileServerClient } from "./client";
import { createBrowserClient, imageUrl } from "./index";

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

it("works without React, shares a token cache, and sends uploads to Serve only", async () => {
  let tokens = 0;
  const client = createBrowserClient({
    baseUrl: "https://files.example",
    tokenProvider: async () => {
      tokens++;
      return {
        token: "short-lived",
        expiresAt: new Date(Date.now() + 300000).toISOString(),
      };
    },
    fetch: async (input, init) => {
      expect(String(input)).toBe("https://files.example/api/v1/files");
      expect(init?.redirect).toBe("error");
      expect(new Headers(init?.headers).get("authorization")).toBe(
        "Bearer short-lived",
      );
      const form = init?.body as FormData;
      expect((form.get("file") as File).name).toBe("note.txt");
      expect(form.get("tags")).toBe('["notes"]');
      return Response.json({
        data: {
          id: "one",
          filename: "hash.txt",
          originalName: "note.txt",
          contentType: "text/plain",
          kind: "document",
          sizeBytes: 2,
          width: null,
          height: null,
          tags: ["notes"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          urls: {
            content: "https://files.example/api/v1/files/one/content",
            image: null,
            placeholder: null,
          },
          variants: [],
        },
      });
    },
  });
  const file = new File(["hi"], "note.txt", { type: "text/plain" });
  await Promise.all([
    client.upload(file, { tags: ["notes"] }),
    client.upload(file, { tags: ["notes"] }),
  ]);
  expect(tokens).toBe(1);
  expect(
    imageUrl(
      {
        urls: {
          image: "https://files.example/api/img/one",
          content: "https://files.example/content",
          placeholder: null,
        },
      },
      { width: 640, format: "webp", quality: 75 },
    ),
  ).toBe("https://files.example/api/img/one?w=640&q=75&f=webp");
});
