# Releasing 0.1.0

The scope owner confirmed the `@skycanvasstudio` organization and selected `serve-server` / `serve-react`. Registry availability and
publish credentials must still be checked at release time. Nothing in this
workspace automatically publishes.

1. Deploy the compatible `/api/v1` backend. Configure its public URL and dedicated
   browser-token secret. No schema migration is required.
2. From `npm_pkg/`, run `bun install --frozen-lockfile` then `bun run verify`.
   From the application root, run `npm run typecheck`.
3. Review READMEs, MIT licenses, version numbers and tarball contents. Both packages
   include repository/homepage/issue metadata, explicit conditional ESM/CJS types,
   file allowlists and public publish access. Runtime dependencies are Zod (MIT),
   with React/React DOM (MIT) as peers of the React package.
4. On a dedicated staging application, exercise upload/list/get/crop/delete, a
   blob shared by two applications, cross-origin token refresh and video seeking.
   Automated tests use mocks and clean consumers; they do not contact a live
   database/storage deployment. No staging server is started by verification.
5. Confirm `npm whoami` has access to the scope and that version 0.1.0 is not
   already published. Obtain explicit approval to publish.
6. Publish the **verified artifacts**, not a differently rebuilt working tree:

   ```sh
   npm publish ./artifacts/skycanvasstudio-serve-server-0.1.0.tgz --access public
   npm publish ./artifacts/skycanvasstudio-serve-react-0.1.0.tgz --access public
   ```

7. Give the organization's existing file-server team publish access:

   ```sh
   npm access grant read-write skycanvasstudio:file-server @skycanvasstudio/serve-server
   npm access grant read-write skycanvasstudio:file-server @skycanvasstudio/serve-react
   ```

8. Verify both registry versions and perform an install from npm in a new project.

`prepack` rebuilds source before a direct package pack. `prepublishOnly` runs
package-local checks when publishing a package directory. The release verifier
packs already-built output into `artifacts/` and checks strict ESM/CJS declarations,
Node/Bun imports, CSS exports and React 18/19 SSR in temporary projects. Publishing
a tarball uses those exact bytes; always run the workspace verifier first.

The framework examples are integration modules, not full deployed applications.
Their builds/typechecks validate framework and package APIs. Authentication is
supplied by the host application; the TanStack sample denies access until wired
up. Private delivery, resumable uploads, transcoding and malware scanning are
outside 0.1.0.
