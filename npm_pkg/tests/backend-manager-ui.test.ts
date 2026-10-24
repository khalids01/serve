// @vitest-environment jsdom
import { createRequire } from "node:module";
import { resolve } from "node:path";
import type * as ReactRuntime from "react";
import type { Root } from "react-dom/client";

// The host UI and its Radix components use the host React installation.
const hostRequire = createRequire(resolve(process.cwd(), "../package.json"));
const { createElement, act } = hostRequire("react") as typeof ReactRuntime;
const { createRoot } = hostRequire(
  "react-dom/client",
) as typeof import("react-dom/client");

import {
  fireEvent as rawFireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: unknown; href: string }) =>
    createElement("a", props, children as never),
}));
vi.mock("@/features/storage/location-select", () => ({
  StorageLocationSelect: () => createElement("span", null, "Default storage"),
}));

import { FileManager } from "../../src/features/file-manager/file-manager";

let root: Root | undefined;
async function render(element: React.ReactNode) {
  const container = document.createElement("div");
  document.body.append(container);
  await act(async () => {
    root = createRoot(container);
    root.render(element);
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 250));
  });
}
const fireEvent = {
  click: async (
    element: Element,
    options?: Parameters<typeof rawFireEvent.click>[1],
  ) =>
    act(async () => {
      rawFireEvent.click(element, options);
    }),
  doubleClick: async (element: Element) =>
    act(async () => {
      rawFireEvent.doubleClick(element);
    }),
  change: async (
    element: Element,
    options: Parameters<typeof rawFireEvent.change>[1],
  ) =>
    act(async () => {
      rawFireEvent.change(element, options);
    }),
};
function cleanup() {
  act(() => root?.unmount());
  document.body.innerHTML = "";
}
const requests: { url: string; body: Record<string, unknown> | undefined }[] =
  [];
const listing = {
  files: [
    {
      id: "file",
      originalName: "note.txt",
      kind: "document",
      contentType: "text/plain",
      sizeBytes: 7,
      folderId: null,
      starred: false,
      storageLocationId: "local",
      urls: {
        content: "https://files.example/api/v1/files/file/content",
        image: null,
        placeholder: null,
      },
    },
  ],
  folders: [{ id: "folder", name: "Projects", parentId: null }],
  tree: [{ id: "folder", name: "Projects", parentId: null }],
  pagination: { page: 1, pages: 1, total: 1 },
  defaultStorageLocationId: "default",
};
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  requests.length = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      const target = String(url),
        body = init?.body ? JSON.parse(String(init.body)) : undefined;
      requests.push({ url: target, body });
      return new Response(
        JSON.stringify(
          target === "/api/applications"
            ? { applications: [{ id: "app", name: "Website" }] }
            : body
              ? { success: true }
              : target.includes("folderId=folder")
                ? {
                    ...listing,
                    folders: [],
                    files: [
                      {
                        ...listing.files[0],
                        id: "child-one",
                        originalName: "first.txt",
                      },
                      {
                        ...listing.files[0],
                        id: "child-two",
                        originalName: "second.txt",
                      },
                    ],
                  }
                : listing,
        ),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe("file-manager interactions", () => {
  it("selects files, renames them, and submits the logical entry ID", async () => {
    await render(createElement(FileManager));
    const file = await screen.findByRole("option", { name: "file: note.txt" });
    await fireEvent.click(file);
    await fireEvent.click(screen.getByRole("button", { name: "Rename" }));
    const input = await screen.findByRole("textbox", { name: "Name" });
    await fireEvent.change(input, { target: { value: "renamed.txt" } });
    await fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(
        requests.some(
          (value) =>
            value.body?.action === "rename" &&
            value.body.id === "file" &&
            value.body.name === "renamed.txt",
        ),
      ).toBe(true),
    );
  });
  it("navigates into a folder and back, and exposes a file preview", async () => {
    await render(createElement(FileManager));
    await fireEvent.doubleClick(
      await screen.findByRole("option", { name: "folder: Projects" }),
    );
    await waitFor(() =>
      expect(
        requests.some((value) => value.url.includes("folderId=folder")),
      ).toBe(true),
    );
    await fireEvent.click(screen.getByRole("button", { name: "Back" }));
    await fireEvent.doubleClick(
      await screen.findByRole("option", { name: "file: note.txt" }),
    );
    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Download" }).getAttribute("href"),
    ).toContain("/files/file/content?download=1");
  });
  it("starts a new shift selection when its previous anchor belongs to another folder", async () => {
    await render(createElement(FileManager));
    await fireEvent.click(
      screen.getByRole("option", { name: "file: note.txt" }),
    );
    await fireEvent.doubleClick(
      screen.getByRole("option", { name: "folder: Projects" }),
    );
    const child = await screen.findByRole("option", {
      name: "file: first.txt",
    });
    await fireEvent.click(child, { shiftKey: true });
    expect(child.getAttribute("aria-selected")).toBe("true");
  });
  it("moves a selected file to Trash through the application-scoped endpoint", async () => {
    await render(createElement(FileManager));
    await fireEvent.click(
      await screen.findByRole("option", { name: "file: note.txt" }),
    );
    const trash = screen.getAllByRole("button", { name: "Trash" }).at(-1);
    if (!trash) throw new Error("Trash action missing");
    await fireEvent.click(trash);
    await waitFor(() =>
      expect(
        requests.some(
          (value) =>
            value.url === "/api/file-manager/app" &&
            value.body?.action === "trash" &&
            JSON.stringify(value.body.fileIds) === '["file"]',
        ),
      ).toBe(true),
    );
  });
});
