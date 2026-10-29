import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ upload: vi.fn(), linked: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: {} }));
vi.mock("@/lib/api-keys", () => ({
  ApiKeyService: {
    validateKey: async () => ({ application: { id: "app-a" } }),
  },
}));
vi.mock("@/lib/image-upload", () => ({ processImageUpload: mocks.upload }));
vi.mock("@/lib/v1-files", () => ({
  linkedFile: mocks.linked,
  serializeFile: (value: unknown) => value,
}));

import { POST as crop } from "../../src/app/api/v1/files/[id]/crops/route";
import { parseUpload } from "../../src/lib/v1-upload";

function request(form: FormData) {
  return new NextRequest("https://files.example/api/v1/files", {
    method: "POST",
    body: form,
    headers: { authorization: "Bearer sk_test" },
  });
}
beforeEach(() => vi.clearAllMocks());
describe("multipart safety", () => {
  it("sanitizes filenames and rejects application injection and invalid tags", async () => {
    const form = new FormData();
    form.set(
      "file",
      new Blob(["text"], { type: "text/plain" }),
      "../../note.txt",
    );
    expect((await parseUpload(request(form))).filename).toBe("note.txt");
    form.set("applicationId", "app-b");
    await expect(parseUpload(request(form))).rejects.toHaveProperty(
      "code",
      "INVALID_UPLOAD",
    );
    form.delete("applicationId");
    form.set("tags", "[123]");
    await expect(parseUpload(request(form))).rejects.toHaveProperty(
      "code",
      "INVALID_UPLOAD",
    );
  });
  it("rejects files claiming to be a raster image without valid image bytes", async () => {
    const form = new FormData();
    form.set(
      "file",
      new Blob(["not a png"], { type: "image/png" }),
      "fake.png",
    );
    await expect(parseUpload(request(form))).rejects.toHaveProperty(
      "code",
      "FILE_TYPE_NOT_ALLOWED",
    );
  });
  it("checks crop ownership before parsing its multipart body", async () => {
    mocks.linked.mockResolvedValue(null);
    const req = new NextRequest(
      "https://files.example/api/v1/files/other/crops",
      {
        method: "POST",
        headers: { authorization: "Bearer sk_test" },
        body: "invalid multipart",
      },
    );
    const parse = vi.spyOn(req, "formData");
    expect(
      (await crop(req, { params: Promise.resolve({ id: "other" }) })).status,
    ).toBe(404);
    expect(parse).not.toHaveBeenCalled();
    expect(mocks.upload).not.toHaveBeenCalled();
  });
});

it("accepts a destination override but rejects ambiguous duplicate fields", async () => {
  const form = new FormData();
  form.set("file", new Blob(["text"], { type: "text/plain" }), "a.txt");
  form.set("storageLocationId", "local");
  expect((await parseUpload(request(form))).storageLocationId).toBe("local");
  form.append("storageLocationId", "foreign");
  await expect(parseUpload(request(form))).rejects.toHaveProperty(
    "code",
    "INVALID_UPLOAD",
  );
});
