import { CodeBlock } from "@/features/docs/code-block";
export function SdkReferenceSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-3 text-2xl font-bold">SDK and API v1 reference</h2>
        <p className="text-lg text-muted-foreground">
          The SDK adds /api/v1 paths and authorization headers for you.
          Management operations stay scoped to the application that owns the
          credential.
        </p>
      </div>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">Server operations</h3>
        <CodeBlock
          language="typescript"
          code={
            'const asset = await files.files.upload({ file, filename: "photo.png" });\nconst { data, pagination } = await files.files.list({\n  page: 1, limit: 20, kind: "image", search: "photo",\n});\nconst saved = await files.files.get(asset.id);\nconst resized = files.images.url(asset, { width: 640, format: "webp" });\nconst result = await files.files.delete(asset.id);'
          }
        />
        <p>
          Delete returns <code>unlinked</code> and <code>storageDeleted</code>.
          Shared files keep working for other applications. Crop accepts a
          client-cropped raster file through{" "}
          <code>files.files.crop(id, input)</code> and always saves as new. Do
          not assume deletion revokes cached public URLs.
        </p>
      </section>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">Routes</h3>
        <CodeBlock
          language="text"
          code={
            "POST   /api/v1/files                   upload one file\nGET    /api/v1/files                   list application files\nGET    /api/v1/files/:id               get one asset\nDELETE /api/v1/files/:id               safely unlink/delete\nPOST   /api/v1/files/:id/crops         save crop as new\nGET    /api/v1/files/:id/content       public bytes; supports Range\nHEAD   /api/v1/files/:id/content       public metadata\nPOST   /api/v1/browser-tokens          API key only\nGET    /api/v1/capabilities            public limits and readiness"
          }
        />
        <p>
          Uploads use multipart <code>file</code> and optional <code>tags</code>{" "}
          as a JSON string array. Responses are{" "}
          <code>{"{ data: FileAsset }"}</code>; lists add pagination. Errors are{" "}
          <code>{"{ error: { code, message } }"}</code>. The server SDK throws
          FileServerError with status/code/details/requestId. Legacy routes
          below retain their earlier response shapes and are separate from SDK
          v1.
        </p>
      </section>
    </div>
  );
}
