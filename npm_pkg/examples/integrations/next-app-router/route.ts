import { createBrowserTokenHandler } from "@file-server/server/adapters/fetch";
import { type Authorize, createClient } from "../shared/server";
// In app/api/file-server/token/route.ts export makeRoutes(yourSessionAndRbacCheck, consumerOrigin).token as POST.
// In app/api/file-server/upload/route.ts export its upload as POST.
export function makeRoutes(authorize: Authorize, consumerOrigin: string) {
  const client = createClient();
  return {
    token: createBrowserTokenHandler({
      client,
      authorize,
      allowedOrigins: [consumerOrigin],
      scopes: ["files:read", "files:write", "files:delete"],
    }),
    upload: async (request: Request) => {
      if (!(await authorize(request)))
        return new Response(null, { status: 401 });
      const file = (await request.formData()).get("file");
      if (!(file instanceof File))
        return new Response("file is required", { status: 400 });
      return Response.json({ data: await client.files.upload({ file }) });
    },
  };
}
