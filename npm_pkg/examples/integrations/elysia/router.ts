import { createBrowserTokenHandler } from "@skycanvasstudio/serve-server/adapters/fetch";
import { Elysia, t } from "elysia";
import { type Authorize, createClient } from "../shared/server";
export function fileServerRoutes(authorize: Authorize, consumerOrigin: string) {
  const client = createClient();
  const token = createBrowserTokenHandler({
    client,
    authorize,
    allowedOrigins: [consumerOrigin],
    scopes: ["files:read", "files:write", "files:delete"],
  });
  return new Elysia({ prefix: "/api/file-server" })
    .post("/token", ({ request }) => token(request))
    .post(
      "/upload",
      async ({ request, body, status }) => {
        if (!(await authorize(request)))
          return status(401, "Authentication required");
        return { data: await client.files.upload({ file: body.file }) };
      },
      { body: t.Object({ file: t.File({ maxSize: "50m" }) }) },
    );
}
