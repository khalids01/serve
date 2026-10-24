"use client";
import Link from "next/link";
import { CodeBlock } from "@/features/docs/code-block";
import { sdkSnippets } from "@/features/docs/sdk-snippets";
export function GettingStartedSection({
  onSectionChange,
}: {
  onSectionChange?: (sectionId: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-3 text-2xl font-bold tracking-tight">
          Integrate Serve in three steps
        </h2>
        <p className="text-lg text-muted-foreground">
          Install the SDK, set two server environment variables, and upload a
          file. Your app never needs S3 credentials or storage paths.
        </p>
      </div>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">
          1. Create an application and install the SDK
        </h3>
        <p>
          In the{" "}
          <Link href="/dashboard" className="text-primary underline">
            Serve dashboard
          </Link>
          , create an application and generate an API key for it. Use Node.js
          20+ or Bun. The env-file command below requires Node.js 20.6+.
        </p>
        <CodeBlock code="npm install @skycanvasstudio/serve-server" language="bash" />
        <p className="text-sm text-muted-foreground">
          The 0.1.0 packages are prepared for release. Registry installation
          works after publication; before then, install the verified .tgz
          artifacts from npm_pkg/artifacts instead.
        </p>
      </section>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">
          2. Add these to your app&apos;s .env.local
        </h3>
        <CodeBlock code={sdkSnippets.consumerEnv} language="bash" />
        <p>
          Use the public origin of your Serve installation, for example{" "}
          <code>https://files.example.com</code> or{" "}
          <code>http://localhost:5000</code>. Do not append <code>/api</code> or
          a file path. Restart your app after changing env variables.
        </p>
        <p className="text-sm text-muted-foreground">
          These variables belong to the consuming app. Keep the API key
          server-only: never add NEXT_PUBLIC_, VITE_, or another public prefix.
        </p>
      </section>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">3. Save upload.mjs and run it</h3>
        <CodeBlock code={sdkSnippets.serverUpload} language="javascript" />
        <CodeBlock
          code="node --env-file=.env.local upload.mjs"
          language="bash"
        />
        <p>
          Expected result: a public file URL on your Serve domain. Open it to
          see <code>Hello from Serve</code>. A File supplies its filename; Blob
          and buffer uploads need an explicit filename.
        </p>
      </section>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">Use the returned URLs</h3>
        <p>
          Use <code>asset.urls.content</code> for downloads, video and audio.
          Use <code>asset.urls.image</code> or the React{" "}
          <code>AdvancedImage</code> component for images and resizing. Preserve
          the asset ID in your app when you need to retrieve or delete it later.
        </p>
        <p>
          Browsers request these URLs from Serve. Serve reads your configured
          local or S3 storage and handles byte ranges and image transformations.
          Do not construct bucket URLs or expose storage credentials. A CDN can
          sit in front of the Serve domain later.
        </p>
        <p className="text-sm text-muted-foreground">
          Delivered content is public. API keys and browser tokens protect
          upload and management operations, not access to a known file URL.
        </p>
      </section>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          onClick={() => onSectionChange?.("react-integration")}
        >
          Add React upload and media components
        </button>
        <button
          type="button"
          className="rounded-md border px-4 py-2"
          onClick={() => onSectionChange?.("hosting")}
        >
          Check deployment and troubleshoot
        </button>
      </div>
    </div>
  );
}
