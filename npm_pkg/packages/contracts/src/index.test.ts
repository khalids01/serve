import { describe, expect, it } from "vitest";
import { getFileKind, imageUrl, joinUrl } from "./index";

describe("File Server contracts", () => {
  it("classifies files and builds stable absolute URLs", () => {
    expect(getFileKind("image/png")).toBe("image");
    expect(getFileKind("application/pdf")).toBe("document");
    expect(joinUrl("https://files.example/", "/api/v1/files/a")).toBe(
      "https://files.example/api/v1/files/a",
    );
    expect(
      imageUrl(
        {
          urls: {
            image: "https://files.example/image",
            content: "https://files.example/content",
            placeholder: null,
          },
        },
        { width: 320, format: "webp" },
      ),
    ).toBe("https://files.example/image?w=320&f=webp");
  });
});
