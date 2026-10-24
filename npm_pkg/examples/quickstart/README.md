# Exact examples used by /docs

The docs code blocks are generated from these files with `bun run docs:sync`.
`bun run docs:check` prevents drift. The verifier installs and executes upload.mjs
and check-serve.mjs from the packed packages in a clean consumer. Backend tests
also connect the upload example through actual API routes with in-memory
persistence/storage substitutes.

For a server-only app, install `@skycanvasstudio/serve-server`, set the two variables in
`.env.example`, then run `node --env-file=.env.local upload.mjs` (Node 20.6+).
Use check-serve.mjs to check deployment, credentials and returned URL origins.

For Next.js/React, also install `@skycanvasstudio/serve-react` and `server-only`. Copy
lib/file-server.ts and app/ into the equivalent paths in your app. Keep your own
real auth instance: **do not copy lib/auth.ts**, which is a deny-by-default fixture.
The token route shows Better Auth's session API and grants management to signed-in
users. For another provider or role policy, replace only `authorize`.
The route derives the consumer origin from its Request; configure your reverse
proxy so Request URLs reflect your actual public origin.

The API key stays in a server-only module. The server page passes only the public
base URL to the client component. No extra public env variable is required.
Before npm publication, use the verified tarball paths instead of registry names.
