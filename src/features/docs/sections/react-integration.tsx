"use client";
import { CodeBlock } from "@/features/docs/code-block";
import { sdkSnippets } from "@/features/docs/sdk-snippets";
export function ReactIntegrationSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-3 text-2xl font-bold">React / Next.js integration</h2>
        <p className="text-lg text-muted-foreground">
          Use the same two env variables from Getting Started. Add one
          authenticated token route and a provider; the browser receives a
          short-lived token instead of your API key.
        </p>
      </div>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">Install</h3>
        <CodeBlock
          code="npm install @skycanvasstudio/serve-server @skycanvasstudio/serve-react server-only"
          language="bash"
        />
        <p>
          React 18.2 and 19 are supported. The examples below use Next.js App
          Router with Better Auth already set up in your consuming app. The only
          app-specific change is the authorization callback; use your existing
          session and permission check if you use another auth provider.
        </p>
        <p>
          On the Serve host, configure{" "}
          <code>FILE_SERVER_BROWSER_TOKEN_SECRET</code> once. Your consuming app
          does not need that secret or any S3 settings.
        </p>
      </section>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">
          lib/file-server.ts — server-only client
        </h3>
        <CodeBlock code={sdkSnippets.nextServerClient} language="typescript" />
      </section>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">
          app/api/file-server/token/route.ts
        </h3>
        <CodeBlock code={sdkSnippets.nextTokenRoute} language="typescript" />
        <p>
          This example allows every signed-in user of your app to read, upload
          and delete files in this Serve application. Apply your role/tenant
          rules in <code>authorize</code> when permissions differ. Keep your
          real auth instance at <code>@/lib/auth</code>; do not use a callback
          that always returns true.
        </p>
        <p>
          The allowed origin is derived from the consuming app&apos;s request,
          so no third integration env variable is needed. Behind a proxy,
          preserve the public host and protocol in Request URLs. Token requests
          must be same-origin POSTs.
        </p>
      </section>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">app/files/files-client.tsx</h3>
        <CodeBlock code={sdkSnippets.nextFilesClient} language="tsx" />
        <p>
          Import the stylesheet once. Keep the token provider outside render.
          The library includes upload progress, cancellation/retry, search,
          pagination, previews, selection and confirmed deletion.
        </p>
      </section>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">app/files/page.tsx</h3>
        <CodeBlock code={sdkSnippets.nextFilesPage} language="tsx" />
        <p>
          The server page passes only the public base URL into the client. After
          signing in, open <code>/files</code>, upload an image or text file,
          preview it, then delete it.
        </p>
        <p className="text-sm text-muted-foreground">
          Server-only uploads need neither a token route nor a React provider.
          For Express, Nest, Elysia or TanStack Start, use the typed integration
          modules in npm_pkg/examples/integrations; all use the same server SDK
          and browser-token model.
        </p>
      </section>
    </div>
  );
}
