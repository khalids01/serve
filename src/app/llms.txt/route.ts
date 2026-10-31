export function GET() {
  return new Response(
    `# Serve file server

> Official integration documentation for the published Serve server, framework-independent JavaScript, and React packages.

- [Complete integration guide](/docs.md): Read this entire document for setup, working examples, authentication, destinations, delivery, API reference, and acceptance checks.
- [Rendered guide](/docs): The same complete guide rendered as HTML, readable without JavaScript or login.

Use the package version stated in the guide. Keep application API keys on the consuming application's server. Ask the operator for the Serve origin and application key; never invent credentials or weaken authorization.
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
