import "reflect-metadata";
import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { createBrowserTokenHandler } from "@skycanvasstudio/serve-server/adapters/fetch";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { createClient } from "../shared/server";
// Register the returned controller in your Nest module. Pass your session/RBAC
// check; production apps can put the same check in their existing Nest guard.
export function fileServerController(
  authorize: (request: ExpressRequest) => Promise<boolean>,
  consumerOrigin: string,
) {
  const client = createClient();
  @Controller("api/file-server")
  class FileServerController {
    @Post("upload")
    async upload(
      @Req() request: ExpressRequest,
      @Body() body: { text?: string },
    ) {
      if (!(await authorize(request))) throw new ForbiddenException();
      if (typeof body?.text !== "string")
        throw new ForbiddenException("text is required");
      return {
        data: await client.files.upload({
          file: new Blob([body.text], { type: "text/plain" }),
          filename: "note.txt",
        }),
      };
    }
    @Post("token")
    async token(
      @Req() request: ExpressRequest,
      @Res() response: ExpressResponse,
    ) {
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
    }
  }
  return FileServerController;
}
