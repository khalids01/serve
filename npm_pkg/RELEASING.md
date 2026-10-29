# Release record and procedure

## 0.1.0 — published 2026-10-24

- [@skycanvasstudio/serve-server](https://www.npmjs.com/package/@skycanvasstudio/serve-server): released as 0.1.0.
- [@skycanvasstudio/serve-react](https://www.npmjs.com/package/@skycanvasstudio/serve-react): released as 0.1.0.
- The skycanvasstudio:file-server team has read-write access to both packages.
- Registry tarball integrity matches the locally verified artifacts. A clean install from npm passes ESM/CommonJS imports, the Fetch adapter, CSS resolution and React SSR.

0.1.0 is already published. For future releases, increment the package versions
and update the artifact filenames below before publishing; npm versions are immutable.

## Next release (unpublished)

Server and React are 0.3.0; the framework-independent client is 0.2.0.
These add upload destinations and destination discovery. The previous published release was server/React 0.2.0 and client 0.1.0.
Publish the verified serve-client artifact before serve-react, which depends on it.
Run the verifier with all three tarballs. No packages are published automatically.

## Release procedure

The scope owner confirmed the `@skycanvasstudio` organization and selected `serve-server` / `serve-react`. Registry availability and
publish credentials must still be checked at release time. Nothing in this
workspace automatically publishes.

1. Deploy the compatible `/api/v1` backend. Configure its public URL and dedicated
   browser-token secret. Apply the storage delivery/jobs migration before deployment.
2. From `npm_pkg/`, run `bun install --frozen-lockfile` then `bun run verify`.
   From the application root, run `npm run typecheck`.
3. Review READMEs, MIT licenses, version numbers and tarball contents. All three packages
   include repository/homepage/issue metadata, explicit conditional ESM/CJS types,
   file allowlists and public publish access. Runtime dependencies are Zod (MIT),
   with React/React DOM (MIT) as peers of the React package.
4. On a dedicated staging application, exercise upload/list/get/crop/delete, a
   blob shared by two applications, cross-origin token refresh and video seeking.
   Automated tests use mocks and clean consumers; they do not contact a live
   database/storage deployment. No staging server is started by verification.
5. Confirm `npm whoami` has access to the scope and that the intended package version is not
   already published. Obtain explicit approval to publish.
6. Publish the **verified artifacts**, not a differently rebuilt working tree:

   ```sh
   npm publish ./artifacts/skycanvasstudio-serve-server-0.3.0.tgz --access public
   npm publish ./artifacts/skycanvasstudio-serve-client-0.2.0.tgz --access public
   npm publish ./artifacts/skycanvasstudio-serve-react-0.3.0.tgz --access public
   ```

7. Give the organization's existing file-server team publish access:

   ```sh
   npm access grant read-write skycanvasstudio:file-server @skycanvasstudio/serve-server
   npm access grant read-write skycanvasstudio:file-server @skycanvasstudio/serve-client
   npm access grant read-write skycanvasstudio:file-server @skycanvasstudio/serve-react
   ```

8. Verify all three registry versions and perform an install from npm in a new project.

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

During publication, npm may require separate browser approvals for each package
and each team-access change. Complete the matching approval while its command is
waiting. A successful publish can enter npm processing before the public registry
serves the new version; confirm registry availability and a clean install before
announcing the release. Do not republish a successfully accepted version while
waiting for processing.
