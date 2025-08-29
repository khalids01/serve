import { CodeBlock } from "@/features/docs/code-block";

export function ListImagesSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">List Images</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Retrieve a paginated list of images with powerful filtering and sorting options.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="bg-muted text-foreground text-xs font-medium px-2.5 py-0.5 rounded mr-3">GET</span>
            <code className="text-lg font-mono">/api/images</code>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Request</h4>
            <CodeBlock
              code={`curl -X GET "https://your-domain.com/api/images?applicationId=app_123456&page=1&limit=20&search=avatar&sortBy=createdAt&sortOrder=desc" \\
  -H "Authorization: Bearer sk_live_your_api_key"`}
              language="bash"
              id="list-curl"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Postman</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="mb-1 font-medium">URL</p>
                <CodeBlock code="https://your-domain.com/api/images" language="text" id="list-postman-url" />
              </div>
              <div>
                <p className="mb-1 font-medium">Method</p>
                <CodeBlock code="GET" language="text" id="list-postman-method" />
              </div>
              <div>
                <p className="mb-1 font-medium">Headers</p>
                <CodeBlock code={`Authorization: Bearer sk_live_your_api_key`} language="text" id="list-postman-headers" />
              </div>
              <div>
                <p className="mb-1 font-medium">Query Params</p>
                <CodeBlock
                  code={`applicationId=app_123456\npage=1\nlimit=20\nsearch=avatar\ncontentType=image/jpeg\nsortBy=createdAt\nsortOrder=desc`}
                  language="text"
                  id="list-postman-params"
                />
                <p className="text-muted-foreground mt-1">Tip: Use the Params tab in Postman to add key/value pairs.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Query Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Parameter</th>
                    <th className="text-left py-2 font-medium">Type</th>
                    <th className="text-left py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-2"><code>page</code></td>
                    <td className="py-2">integer</td>
                    <td className="py-2">Page number (default: 1)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2"><code>limit</code></td>
                    <td className="py-2">integer</td>
                    <td className="py-2">Items per page (default: 20, max: 100)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2"><code>search</code></td>
                    <td className="py-2">string</td>
                    <td className="py-2">Search in filename, original name, content type</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2"><code>contentType</code></td>
                    <td className="py-2">string</td>
                    <td className="py-2">Filter by MIME type (e.g., "image/jpeg")</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2"><code>sortBy</code></td>
                    <td className="py-2">string</td>
                    <td className="py-2">Sort field: createdAt, name, size, type</td>
                  </tr>
                  <tr>
                    <td className="py-2"><code>sortOrder</code></td>
                    <td className="py-2">string</td>
                    <td className="py-2">Sort order: asc, desc</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Response</h4>
            <CodeBlock
              code={`{\n  "images": [\n    {\n      "id": "img_123456789",\n      "filename": "image_processed.jpg",\n      "originalName": "avatar.jpg",\n      "contentType": "image/jpeg",\n      "sizeBytes": 245760,\n      "width": 1920,\n      "height": 1080,\n      "variants": [...],\n      "createdAt": "2024-01-01T00:00:00.000Z"\n    }\n  ],\n  "pagination": {\n    "page": 1,\n    "limit": 20,\n    "total": 150,\n    "pages": 8\n  }\n}`}
              language="json"
              id="list-response"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
