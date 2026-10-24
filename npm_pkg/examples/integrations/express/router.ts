import { createBrowserTokenHandler } from "@skycanvasstudio/serve-server/adapters/fetch";
import express, { type Request as ExpressRequest } from "express";
import { createClient } from "../shared/server";
export function fileServerRouter(
  authorize: (request: ExpressRequest) => Promise<boolean>,
  consumerOrigin: string,
) {
  const router = express.Router();
  const client = createClient();
  router.use(async (request, response, next) => {
    if (!(await authorize(request))) {
      response.sendStatus(401);
      return;
    }
    next();
  });
  router.post("/token", async (request, response) => {
    const handler = createBrowserTokenHandler({
      client,
      authorize: () => authorize(request),
      allowedOrigins: [consumerOrigin],
      scopes: ["files:read", "files:write", "files:delete"],
    });
    const headers = new Headers();
    if (request.headers.origin) headers.set("origin", request.headers.origin);
    const result = await handler(
      new Request(new URL("/api/file-server/token", consumerOrigin), {
        method: "POST",
        headers,
      }),
    );
    response.status(result.status);
    result.headers.forEach((value, key) => {
      response.setHeader(key, value);
    });
    response.send(await result.text());
  });
  router.post(
    "/upload",
    express.raw({ type: "application/octet-stream", limit: "50mb" }),
    async (request, response) => {
      if (!Buffer.isBuffer(request.body)) {
        response.status(400).json({ error: "Send a binary request body" });
        return;
      }
      response.json({
        data: await client.files.upload({
          file: new Uint8Array(request.body),
          filename: "upload.bin",
          contentType: "application/octet-stream",
        }),
      });
    },
  );
  return router;
}
