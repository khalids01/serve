// @vitest-environment jsdom

import { createRequire } from "node:module";
import { resolve } from "node:path";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import type * as ReactRuntime from "react";
import type { Root } from "react-dom/client";

const hostRequire = createRequire(resolve(process.cwd(), "../package.json"));
const { createElement, act } = hostRequire("react") as typeof ReactRuntime;
const { createRoot } = hostRequire(
  "react-dom/client",
) as typeof import("react-dom/client");
let root: Root | undefined;
async function render(element: React.ReactNode) {
  const container = document.createElement("div");
  document.body.append(container);
  await act(async () => {
    root = createRoot(container);
    root.render(element);
  });
  return { container };
}

import { afterEach, beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ admin: true, fetch: vi.fn() }));
vi.mock("@/features/settings/hooks/use-email-config", () => ({
  useEmailConfig: () => ({
    emailConfig: { configured: false },
    testingEmail: false,
    testEmail: "",
    setTestEmail: vi.fn(),
    sendTestEmail: vi.fn(),
  }),
}));

import { SettingsPage } from "../../src/features/settings/settings-page";
import { StorageConnections } from "../../src/features/storage/storage-connections";

beforeEach(() => {
  mocks.admin = true;
  vi.stubGlobal("fetch", mocks.fetch);
  mocks.fetch.mockImplementation(async (url: string, init?: RequestInit) => {
    if (url === "/api/storage-connections")
      return Response.json({
        canManageDefaults: mocks.admin,
        encryptionReady: true,
        defaultProvider: "s3",
        storageSettings: {
          defaultUploadDestinationId: "default",
          defaultDeliveryMode: "proxy",
        },
        builtins: [
          { id: "default", name: "Default S3", enabled: true },
          { id: "local", name: "Local storage", enabled: true },
        ],
        connections: [],
      });
    if (url === "/api/storage-preferences")
      return Response.json({ localBackupConnectionId: null });
    if (url === "/api/admin/storage-settings")
      return Response.json(JSON.parse(String(init?.body)));
    throw new Error(`Unexpected request ${url}`);
  });
});
afterEach(async () => {
  await act(async () => root?.unmount());
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});
it("keeps configuration on Settings and uses shared controls", async () => {
  const { container } = await render(
    createElement(SettingsPage, { isAdmin: true, initialSignupEnabled: true }),
  );
  const destination = await screen.findByRole("combobox", {
    name: "Default upload destination",
  });
  expect(destination.getAttribute("data-slot")).toBe("select-trigger");
  expect(
    (
      await screen.findByRole("combobox", { name: "S3 backup destination" })
    ).getAttribute("data-slot"),
  ).toBe("select-trigger");
  expect(
    screen.getByRole("button", { name: "Add S3 connection" }),
  ).toBeTruthy();
  expect(container.querySelector("select")).toBeNull();
  await act(async () => {
    fireEvent.click(
      screen.getByRole("button", { name: "Save storage defaults" }),
    );
  });
  await waitFor(() =>
    expect(mocks.fetch).toHaveBeenCalledWith(
      "/api/admin/storage-settings",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          defaultUploadDestinationId: "default",
          defaultDeliveryMode: "proxy",
        }),
      }),
    ),
  );
});
it("shows user storage preferences without admin registration or email settings", async () => {
  mocks.admin = false;
  render(
    createElement(SettingsPage, {
      isAdmin: false,
      initialSignupEnabled: false,
    }),
  );
  await screen.findByRole("combobox", { name: "S3 backup destination" });
  expect(
    screen.queryByRole("combobox", { name: "Default upload destination" }),
  ).toBeNull();
  expect(screen.queryByText("Account registration")).toBeNull();
  expect(screen.queryByText("Email configuration")).toBeNull();
});
it("keeps the Storage page focused on browsing drives", async () => {
  await render(createElement(StorageConnections));
  expect(
    (await screen.findAllByRole("link", { name: "Browse files" })).length,
  ).toBe(2);
  expect(screen.queryByRole("combobox")).toBeNull();
  expect(
    screen.queryByRole("button", { name: "Add S3 connection" }),
  ).toBeNull();
  expect(
    screen.getByRole("link", { name: "Storage settings" }).getAttribute("href"),
  ).toBe("/dashboard/settings#storage");
});
