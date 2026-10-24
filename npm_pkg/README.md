# File Server packages

Isolated Bun workspace for `@skycanvasstudio/serve-server` and `@skycanvasstudio/serve-react` 0.1.0.
The root Next.js application stays in place. `@file-server/contracts` is private
source bundled into both public packages; generated backend schemas live in
`src/lib/v1-contracts.ts`. No public tarball imports the private workspace.

```sh
cd npm_pkg
bun install --frozen-lockfile
bun run verify
```

Verification checks schema drift, lint, types, unit/security tests, builds, all
five framework integration modules and clean tarball consumers with React 18/19,
Node/Bun, ESM/CommonJS and SSR. Tarballs are written to `artifacts/` (ignored).
`bun run contracts:sync` regenerates backend schemas after contract edits.
`bun run clean` removes build/release artifacts. No command above starts a server,
changes the database or publishes packages.

- [Exact /docs quickstart examples](examples/quickstart/README.md)
- [Server SDK](packages/server/README.md)
- [React components and hooks](packages/react/README.md)
- [Versioned API contract](API.md)
- [Framework integrations](examples/integrations/README.md)
- [Release procedure](RELEASING.md)

The deployment needs a configured public URL (`NEXT_PUBLIC_APP_URL`) and a
separate `FILE_SERVER_BROWSER_TOKEN_SECRET` of at least 32 characters. Apply the
backend changes alongside the packages; these packages use `/api/v1`, not legacy
API shapes. Browser tokens authorize management; asset delivery is public.

`bun run docs:sync` generates the website code blocks and Markdown integration guide from the checked quickstart files. `bun run docs:check` rejects drift.
