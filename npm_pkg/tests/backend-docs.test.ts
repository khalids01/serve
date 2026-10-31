import { createRequire } from "node:module";
import { resolve } from "node:path";
import { expect, it } from "vitest";
import { GET as markdown } from "../../src/app/docs.md/route";
import { GET as discovery } from "../../src/app/llms.txt/route";
import { GuideContent } from "../../src/features/docs/guide-content";
import {
  integrationGuide,
  integrationSections,
} from "../../src/features/docs/integration-guide";

const hostRequire = createRequire(resolve(process.cwd(), "../package.json"));
const { createElement } = hostRequire("react") as typeof import("react");
const { renderToStaticMarkup } = hostRequire(
  "react-dom/server",
) as typeof import("react-dom/server");

it("serves the complete anonymous guide as Markdown without a session", async () => {
  const response = markdown();
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toContain("text/markdown");
  expect(await response.text()).toBe(integrationGuide);
  for (const feature of [
    "createFileServer",
    "createBrowserClient",
    "createBrowserTokenHandler",
    "FileServerProvider",
    "AdvancedImage",
    "useStorageLocations",
    "storageLocationId",
    "SCOPE_DENIED",
    "Proxy is the default",
    "Integration acceptance checklist",
  ]) {
    expect(integrationGuide).toContain(feature);
  }
  expect(integrationGuide).not.toContain("{{snippet:");
  expect(await discovery().text()).toContain("/docs.md");
});
it("renders every guide section and runnable code into initial HTML without browser JavaScript", () => {
  const html = renderToStaticMarkup(createElement(GuideContent));
  for (const section of integrationSections)
    expect(html).toContain(`id="${section.id}"`);
  for (const code of [
    "createFileServer",
    "createBrowserClient",
    "makeTokenHandler",
    "CustomFiles",
    "storageLocationId",
  ]) {
    expect(html).toContain(code);
  }
  expect(html).toContain("<pre");
  expect(html).toContain("<table");
  expect(html).not.toContain("{{sdkVersion}}");
});
