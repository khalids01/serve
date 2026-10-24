// @vitest-environment jsdom
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { fireEvent as event, screen } from "@testing-library/react";
import type * as ReactRuntime from "react";
import type { Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

const hostRequire = createRequire(resolve(process.cwd(), "../package.json"));
const { createElement, act } = hostRequire("react") as typeof ReactRuntime;
const { createRoot } = hostRequire(
  "react-dom/client",
) as typeof import("react-dom/client");
const { QueryClient, QueryClientProvider } = hostRequire(
  "@tanstack/react-query",
) as typeof import("@tanstack/react-query");
const mocks = vi.hoisted(() => ({
  post: vi.fn(async () => ({ data: { application: { id: "app" } } })),
}));
vi.mock("@tanstack/react-query", async () => {
  const { createRequire } = await import("node:module");
  const { resolve } = await import("node:path");
  return createRequire(resolve(process.cwd(), "../package.json"))(
    "@tanstack/react-query",
  );
});
vi.mock("@/lib/api", () => ({ default: { post: mocks.post } }));
vi.mock("@/features/storage/location-select", () => ({
  StorageLocationSelect: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) =>
    createElement(
      "select",
      {
        "aria-label": "Storage location",
        value,
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
          onChange(event.target.value),
      },
      createElement("option", { value: "default" }, "Default"),
      createElement("option", { value: "local" }, "Local"),
    ),
}));

import { NewApplicationDialog } from "../../src/features/applications/components/NewApplicationDialog";

let root: Root | undefined;
afterEach(() => {
  act(() => root?.unmount());
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});
describe("application storage integration", () => {
  it("sends the chosen Local location through the real creation hook", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const container = document.createElement("div");
    document.body.append(container);
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    await act(async () => {
      root = createRoot(container);
      root.render(
        createElement(
          QueryClientProvider,
          { client },
          createElement(NewApplicationDialog),
        ),
      );
    });
    await act(async () => {
      event.click(screen.getByRole("button", { name: "New Application" }));
    });
    await act(async () => {
      event.change(screen.getByLabelText("Application Name"), {
        target: { value: "My website" },
      });
    });
    await act(async () => {
      event.change(screen.getByRole("combobox", { name: "Storage location" }), {
        target: { value: "local" },
      });
    });
    await act(async () => {
      event.click(
        screen.getByRole("button", {
          name: "Create Application",
          exact: false,
        } as never),
      );
    });
    expect(mocks.post).toHaveBeenCalledWith("/api/applications", {
      name: "My website",
      slug: "my-website",
      defaultStorageLocationId: "local",
    });
    client.clear();
  });
});
