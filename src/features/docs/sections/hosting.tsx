import { CodeBlock } from "@/features/docs/code-block";
import { sdkSnippets } from "@/features/docs/sdk-snippets";
export function HostingSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-3 text-2xl font-bold">
          Deployment and connection checks
        </h2>
        <p className="text-lg text-muted-foreground">
          Configure the Serve host once. Each consuming app only needs its Serve
          URL and its own application API key.
        </p>
      </div>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">On the Serve host</h3>
        <CodeBlock
          code={
            "NEXT_PUBLIC_APP_URL=https://files.example.com\n# Generate a separate signing secret: openssl rand -base64 32\nFILE_SERVER_BROWSER_TOKEN_SECRET=replace_with_generated_random_value"
          }
          language="bash"
        />
        <p>
          Set NEXT_PUBLIC_APP_URL to the externally reachable Serve origin,
          including HTTPS in production. It determines every returned file URL;
          it must match the consumer&apos;s FILE_SERVER_URL. Browser tokens
          require at least 32 random secret characters. Restart or redeploy
          after env changes.
        </p>
        <p>
          Serve also needs its existing PostgreSQL, auth and storage
          configuration. Select local storage or configure the S3 bucket and
          credentials on this host. Private S3 buckets work: delivery goes
          through Serve, so consumers need no S3 CORS setup, endpoint or access
          key.
        </p>
        <p>
          For uploads, allow your configured maximum file size at the reverse
          proxy and hosting platform as well as in Serve. Forward the public
          host/protocol for authentication, and preserve Range headers for video
          seeking. Deploy the v1 API code before using the SDK.
        </p>
      </section>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">Check from your consuming app</h3>
        <p>
          Save this as <code>check-serve.mjs</code> next to your env file. It
          checks the deployed API, credentials, public URL configuration and
          browser-token readiness without uploading or deleting anything.
        </p>
        <CodeBlock code={sdkSnippets.connectionCheck} language="javascript" />
        <CodeBlock
          code="node --env-file=.env.local check-serve.mjs"
          language="bash"
        />
      </section>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">Troubleshooting</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-2">Symptom</th>
                <th className="p-2">What to check</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">npm package not found</td>
                <td className="p-2">
                  Use the exact @skycanvasstudio package names and the public
                  npm registry. Use verified tarballs for unreleased local
                  builds.
                </td>
              </tr>
              <tr>
                <td className="p-2">404 on /api/v1/*</td>
                <td className="p-2">
                  Deploy the matching Serve v1 backend. Use the Serve origin as
                  the base URL.
                </td>
              </tr>
              <tr>
                <td className="p-2">401 INVALID_API_KEY</td>
                <td className="p-2">
                  Use a non-revoked key from the correct Serve application.
                </td>
              </tr>
              <tr>
                <td className="p-2">503 BROWSER_TOKENS_NOT_CONFIGURED</td>
                <td className="p-2">
                  Generate and set FILE_SERVER_BROWSER_TOKEN_SECRET on the Serve
                  host.
                </td>
              </tr>
              <tr>
                <td className="p-2">Token route returns 401</td>
                <td className="p-2">
                  Sign in to the consuming app and connect its real
                  authorization callback.
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  403 ORIGIN_DENIED or browser CORS failure
                </td>
                <td className="p-2">
                  Use browser tokens, verify exact origins including
                  scheme/port, and check proxy host/protocol forwarding.
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  URLs point to localhost or the wrong site
                </td>
                <td className="p-2">
                  Correct NEXT_PUBLIC_APP_URL on the Serve host and restart it.
                </td>
              </tr>
              <tr>
                <td className="p-2">413 upload rejected</td>
                <td className="p-2">
                  Align proxy/platform request limits and Serve
                  MAX_FILE_SIZE_MB.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
