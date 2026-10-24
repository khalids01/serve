import { createBrowserTokenHandler } from "@file-server/server/adapters/fetch";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { authorizeRequest } from "../shared/auth";
import { createClient } from "../shared/server";
export const upload = createServerFn({ method: "POST" })
  .validator((data: FormData) => data)
  .handler(async ({ data }) => {
    if (!(await authorizeRequest(getRequest())))
      throw new Error("Authentication required");
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("file is required");
    return createClient().files.upload({ file });
  });
export const mintToken = createServerFn({ method: "POST" }).handler(
  async () => {
    const consumerOrigin = process.env.CONSUMER_ORIGIN;
    if (!consumerOrigin) throw new Error("Set CONSUMER_ORIGIN on the server");
    const handler = createBrowserTokenHandler({
      client: createClient(),
      authorize: authorizeRequest,
      allowedOrigins: [consumerOrigin],
      scopes: ["files:read", "files:write", "files:delete"],
    });
    const response = await handler(getRequest());
    if (!response.ok) throw new Error("Unable to mint token");
    const body = (await response.json()) as {
      data: { token: string; expiresAt: string };
    };
    return body.data;
  },
);
