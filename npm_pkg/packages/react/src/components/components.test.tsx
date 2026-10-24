// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createTokenCache,
  FileServerProvider,
} from "../context/file-server-provider";
import type { FileAsset } from "../contracts";
import { type UploadTransport, useUpload } from "../hooks/use-upload";
import { AdvancedImage } from "./advanced-image";
import { FilePicker } from "./file-picker";
import { FilePreview } from "./file-preview";
import { ImagePicker } from "./image-picker";
import { MediaLibrary } from "./media-library";

const asset: FileAsset = {
  id: "a",
  filename: "a.png",
  originalName: "a.png",
  contentType: "image/png",
  kind: "image",
  sizeBytes: 1,
  width: 10,
  height: 10,
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  urls: {
    content: "https://files.example/a",
    image: "https://files.example/image/a",
    placeholder: "https://files.example/placeholder/a",
  },
  variants: [],
};
const tokenProvider = async () => ({
  token: "token",
  expiresAt: new Date(Date.now() + 300_000).toISOString(),
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
describe("React primitives", () => {
  it("deduplicates token requests and supports forced refresh", async () => {
    const provider = vi.fn(tokenProvider);
    const cache = createTokenCache(provider);
    await Promise.all([cache(), cache(), cache()]);
    expect(provider).toHaveBeenCalledTimes(1);
    await cache(true);
    expect(provider).toHaveBeenCalledTimes(2);
  });
  it("resets failed image state when its asset changes and bypasses SVG transforms", () => {
    const { rerender, container } = render(
      <AdvancedImage
        asset={asset}
        alt="Asset"
        width={100}
        responsiveWidths={[200, 100, 100]}
      />,
    );
    const image = screen.getByAltText("Asset");
    expect(image.getAttribute("srcset")).toContain("100w");
    fireEvent.error(image);
    expect(screen.getByRole("img").textContent).toBe("Image unavailable");
    rerender(
      <AdvancedImage
        asset={{
          ...asset,
          contentType: "image/svg+xml",
          urls: { ...asset.urls, image: "https://files.example/b.svg" },
        }}
        alt="New"
      />,
    );
    expect(screen.getByAltText("New").getAttribute("src")).toBe(
      "https://files.example/b.svg",
    );
    expect(screen.getByAltText("New").hasAttribute("srcset")).toBe(false);
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
  it("rejects duplicates, invalid types, size and count", () => {
    const onFiles = vi.fn(),
      onReject = vi.fn();
    const { container } = render(
      <FilePicker
        multiple
        maxFiles={2}
        maxSizeBytes={2}
        accept="image/*"
        onFiles={onFiles}
        onReject={onReject}
      />,
    );
    const a = new File(["a"], "a.png", { type: "image/png", lastModified: 1 });
    fireEvent.change(container.querySelector("input") as HTMLInputElement, {
      target: {
        files: [
          a,
          a,
          new File(["big"], "big.png", { type: "image/png" }),
          new File(["t"], "a.txt", { type: "text/plain" }),
        ],
      },
    });
    expect(onFiles.mock.calls[0][0]).toHaveLength(1);
    expect(
      onReject.mock.calls[0][0].map((r: { code: string }) => r.code),
    ).toEqual(["duplicate-file", "file-too-large", "file-type-not-allowed"]);
  });
  it("enforces concurrency across overlapping batches and reports final results", async () => {
    const waiting: Array<() => void> = [];
    let active = 0,
      maximum = 0;
    const transport: UploadTransport = vi.fn(async () => {
      active++;
      maximum = Math.max(active, maximum);
      await new Promise<void>((resolve) => waiting.push(resolve));
      active--;
      return asset;
    });
    const onBatchComplete = vi.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FileServerProvider
        baseUrl="https://files.example"
        tokenProvider={tokenProvider}
      >
        {children}
      </FileServerProvider>
    );
    const { result } = renderHook(
      () => useUpload({ parallel: 2, onBatchComplete }, transport),
      { wrapper },
    );
    let first: Promise<unknown>, second: Promise<unknown>;
    act(() => {
      first = result.current.upload([
        new File(["a"], "a"),
        new File(["b"], "b"),
      ]);
      second = result.current.upload([new File(["c"], "c")]);
    });
    await waitFor(() => expect(waiting.length).toBe(2));
    await act(async () => {
      waiting.shift()?.();
      waiting.shift()?.();
    });
    await waitFor(() => expect(waiting.length).toBe(1));
    await act(async () => {
      waiting.shift()?.();
      await Promise.all([first, second]);
    });
    expect(maximum).toBe(2);
    expect(
      result.current.items.every((item) => item.status === "success"),
    ).toBe(true);
    expect(onBatchComplete.mock.calls[0][0][0].status).toBe("success");
  });
  it("hides forbidden controls and requests the next page", async () => {
    const fetch = vi.fn(async (url: RequestInfo | URL) => {
      const page = new URL(String(url)).searchParams.get("page");
      return Response.json({
        data: [asset],
        pagination: {
          page: Number(page),
          limit: 20,
          total: 21,
          pages: 2,
          hasNext: page === "1",
          hasPrev: page === "2",
        },
      });
    });
    render(
      <FileServerProvider
        baseUrl="https://files.example"
        tokenProvider={tokenProvider}
        fetch={fetch}
      >
        <MediaLibrary canUpload={false} canDelete={false} canSelect={false} />
      </FileServerProvider>,
    );
    await screen.findByText("a.png");
    expect(screen.queryByText("Delete")).toBeNull();
    expect(screen.queryByText("Select")).toBeNull();
    fireEvent.click(screen.getByText("Next"));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(String(fetch.mock.calls[1][0])).toContain("page=2");
  });
});

it("cancels queued work, preserves partial failures and retries explicitly", async () => {
  let rejectFirst: (error: Error) => void = () => {};
  let attempts = 0;
  const transport: UploadTransport = vi.fn(async () => {
    attempts++;
    if (attempts === 1)
      await new Promise<void>((_resolve, reject) => {
        rejectFirst = reject;
      });
    return asset;
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FileServerProvider
      baseUrl="https://files.example"
      tokenProvider={tokenProvider}
    >
      {children}
    </FileServerProvider>
  );
  const { result } = renderHook(() => useUpload({ parallel: 1 }, transport), {
    wrapper,
  });
  let batch: Promise<unknown>;
  act(() => {
    batch = result.current.upload([new File(["a"], "a"), new File(["b"], "b")]);
  });
  await waitFor(() => expect(transport).toHaveBeenCalledTimes(1));
  act(() => result.current.cancel(result.current.items[1].id));
  await act(async () => {
    rejectFirst(new Error("offline"));
    await batch;
  });
  expect(result.current.items.map((item) => item.status)).toEqual([
    "error",
    "cancelled",
  ]);
  expect(transport).toHaveBeenCalledTimes(1);
  act(() => result.current.retry(result.current.items[0].id));
  await waitFor(() => expect(result.current.items[0].status).toBe("success"));
  expect(transport).toHaveBeenCalledTimes(2);
});
it("aborts active uploads on unmount", async () => {
  let observed: AbortSignal | undefined;
  const completed = vi.fn();
  const transport: UploadTransport = async (
    _url,
    _file,
    _tags,
    _token,
    signal,
  ) => {
    observed = signal;
    await new Promise<void>((_resolve, reject) =>
      signal.addEventListener(
        "abort",
        () => reject(new DOMException("Cancelled", "AbortError")),
        { once: true },
      ),
    );
    return asset;
  };
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FileServerProvider
      baseUrl="https://files.example"
      tokenProvider={tokenProvider}
    >
      {children}
    </FileServerProvider>
  );
  const { result, unmount } = renderHook(
    () => useUpload({ onUploadComplete: completed }, transport),
    { wrapper },
  );
  act(() => {
    void result.current.upload([new File(["a"], "a")]);
  });
  await waitFor(() => expect(observed).toBeDefined());
  unmount();
  expect(observed?.aborted).toBe(true);
  expect(completed).not.toHaveBeenCalled();
});
it("selects an existing image in a modal and restores focus", async () => {
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
  const user = userEvent.setup();
  const onChange = vi.fn();
  const fetch = vi.fn(async (_url: RequestInfo | URL) =>
    Response.json({
      data: [asset],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        pages: 1,
        hasNext: false,
        hasPrev: false,
      },
    }),
  );
  render(
    <FileServerProvider
      baseUrl="https://files.example"
      tokenProvider={tokenProvider}
      fetch={fetch}
    >
      <ImagePicker onChange={onChange} />
    </FileServerProvider>,
  );
  const browse = screen.getByText("Browse images");
  await user.click(browse);
  await screen.findByText("a.png");
  await user.click(screen.getByText("Select"));
  expect(onChange).toHaveBeenCalledWith(asset);
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(browse);
  expect(String(fetch.mock.calls[0]?.[0])).toContain("kind=image");
});
it("renders bounded text as escaped content", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("<script>alert(1)</script>")),
  );
  const { container } = render(
    <FilePreview
      asset={{ ...asset, kind: "document", contentType: "text/html" }}
      textPreviewBytes={8}
    />,
  );
  await screen.findByText("<script>");
  expect(container.querySelector("script")).toBeNull();
});
