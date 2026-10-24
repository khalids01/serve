# Framework integrations

These are integration modules, not servers that start on import. All consume the
built workspace exports. `bun run examples:check` typechecks and builds them.

Copy `.env.example` into your application's server configuration. Each factory
requires your application's existing session/RBAC authorization check. Do not
replace it with an unconditional `true`. Mount the token endpoint at
`/api/file-server/token`; it only mints the server-configured permissions and
origins. Pass only the public File Server URL to `shared/media.tsx`.

- **Next App Router:** call `makeRoutes` with your session check and export `token`
  as `POST` from `app/api/file-server/token/route.ts`, and `upload` from a separate
  server route. Render `MediaPage` in a page with the public URL.
- **TanStack Start:** connect `shared/auth.ts` to your auth system; call `upload` from a form with
  FormData and use `mintToken` as the React provider's `tokenProvider`. Both server
  functions run authorization before accessing File Server. Render `MediaPage`
  with `provideToken={() => mintToken()}` (memoize this provider in your app).
- **Express:** mount `fileServerRouter(checkSession, origin)` at
  `/api/file-server`. `/upload` accepts an octet-stream body; `/token` is protected
  by the middleware and handler. Use `MediaPage` in your React frontend.
- **Nest:** register `fileServerController(checkSession, origin)` in the module's
  controllers. `/upload` demonstrates a backend-generated text Blob; replace the
  input with your existing validated upload DTO/multipart interceptor. The
  factory requires authorization for both controller methods. Use `MediaPage` in
  the React frontend.
- **Elysia/Bun:** `.use(fileServerRoutes(checkSession, origin))`. The upload body
  contains a Bun/browser `File`. Mount `MediaPage` in the frontend.

The shared React page works with any framework. Import the package stylesheet
once. Keep token providers stable outside render or with `useMemo`. Never put
`FILE_SERVER_API_KEY` in public environment variables or browser bundles.
