import { describe, expect, it, vi } from "vitest";
import { createFileServer } from "./client";

describe("FileServerClient", () => {
  it("uses the v1 endpoint and keeps the API key server-side", async () => {
    const fetch = vi.fn(
      async (input: URL | RequestInfo, init?: RequestInit) => {
        expect(String(input)).toBe("https://files.example/api/v1/files?page=2");
        expect(new Headers(init?.headers).get("authorization")).toBe(
          "Bearer sk_live_test",
        );
        return Response.json({
          data: [],
          pagination: {
            page: 2,
            limit: 20,
            total: 0,
            pages: 0,
            hasNext: false,
            hasPrev: false,
          },
        });
      },
    );
    const client = createFileServer({
      baseUrl: "https://files.example",
      apiKey: "sk_live_test",
      fetch,
    });
    await expect(client.files.list({ page: 2 })).resolves.toMatchObject({
      data: [],
    });
  });
});

it("uploads binary data with tags, filename and inferred HTTP errors", async () => {
  const fetch = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    expect(init?.body).toBeInstanceOf(FormData);
    const form = init?.body as FormData;
    expect((form.get("file") as File).name).toBe("a.txt");
    expect(form.get("tags")).toBe('["a"]');
    return Response.json(
      {
        error: {
          code: "FILE_TOO_LARGE",
          message: "Too large",
          requestId: "request-a",
        },
      },
      { status: 413 },
    );
  });
  const client = createFileServer({
    baseUrl: "https://files.example",
    apiKey: "sk_test",
    fetch,
  });
  await expect(
    client.files.upload({
      file: new Uint8Array([1]),
      filename: "a.txt",
      tags: ["a"],
    }),
  ).rejects.toMatchObject({
    code: "FILE_TOO_LARGE",
    status: 413,
    requestId: "request-a",
  });
});
it("respects an already-aborted caller signal even with a timeout", async () => {
  const controller = new AbortController();
  controller.abort();
  const fetch = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    expect(init?.signal?.aborted).toBe(true);
    throw new DOMException("Cancelled", "AbortError");
  });
  const client = createFileServer({
    baseUrl: "https://files.example",
    apiKey: "sk_test",
    timeoutMs: 1000,
    fetch,
  });
  await expect(
    client.files.list({ signal: controller.signal }),
  ).rejects.toHaveProperty("name", "AbortError");
});
it("does not retry writes after a network failure", async () => {
  const fetch = vi.fn(async () => {
    throw new TypeError("offline");
  });
  const client = createFileServer({
    baseUrl: "https://files.example",
    apiKey: "sk_test",
    fetch,
  });
  await expect(client.files.delete("a")).rejects.toMatchObject({
    code: "NETWORK_ERROR",
  });
  expect(fetch).toHaveBeenCalledTimes(1);
});

it.each([401, 403, 404, 409, 413, 429, 500])(
  "normalizes HTTP %s and retains the request ID",
  async (status) => {
    const client = createFileServer({
      baseUrl: "https://files.example/",
      apiKey: "sk_test",
      fetch: async () =>
        new Response("upstream failure", {
          status,
          headers: { "x-request-id": "request-b" },
        }),
    });
    await expect(client.files.get("a")).rejects.toMatchObject({
      status,
      code: "HTTP_ERROR",
      requestId: "request-b",
    });
  },
);
it("retains an API error's request ID header when its body omits it", async () => {
  const client = createFileServer({
    baseUrl: "https://files.example",
    apiKey: "sk_test",
    fetch: async () =>
      Response.json(
        { error: { code: "FILE_NOT_FOUND", message: "Not found" } },
        { status: 404, headers: { "x-request-id": "request-c" } },
      ),
  });
  await expect(client.files.get("a")).rejects.toHaveProperty(
    "requestId",
    "request-c",
  );
});
it("aborts timed-out requests and rejects malformed success responses", async () => {
  vi.useFakeTimers();
  try {
    const client = createFileServer({
      baseUrl: "https://files.example",
      apiKey: "sk_test",
      timeoutMs: 10,
      fetch: async (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => reject(new DOMException("Timeout", "AbortError")),
            { once: true },
          );
        }),
    });
    const assertion = expect(client.files.list()).rejects.toHaveProperty(
      "name",
      "AbortError",
    );
    await vi.advanceTimersByTimeAsync(11);
    await assertion;
  } finally {
    vi.useRealTimers();
  }
  const malformed = createFileServer({
    baseUrl: "https://files.example",
    apiKey: "sk_test",
    fetch: async () => Response.json({ wrong: "shape" }),
  });
  await expect(malformed.files.list()).rejects.toHaveProperty(
    "name",
    "ZodError",
  );
});
