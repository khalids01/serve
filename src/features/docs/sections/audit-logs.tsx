import { CodeBlock } from "@/features/docs/code-block";

export function AuditLogsSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Audit Logs</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Track all file upload and deletion activities for your applications with detailed audit logs.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="bg-muted text-foreground text-xs font-medium px-2.5 py-0.5 rounded mr-3">GET</span>
            <code className="text-lg font-mono">/api/audit-logs</code>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Request</h4>
            <CodeBlock
              code={`curl -X GET "https://your-domain.com/api/audit-logs?applicationId=app_123456&page=1&limit=10" \\
  -H "Authorization: Bearer sk_live_your_api_key"`}
              language="bash"
              id="audit-curl"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Postman</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="mb-1 font-medium">URL</p>
                <CodeBlock code="https://your-domain.com/api/audit-logs" language="text" id="audit-postman-url" />
              </div>
              <div>
                <p className="mb-1 font-medium">Method</p>
                <CodeBlock code="GET" language="text" id="audit-postman-method" />
              </div>
              <div>
                <p className="mb-1 font-medium">Headers</p>
                <CodeBlock code={`Authorization: Bearer sk_live_your_api_key`} language="text" id="audit-postman-headers" />
              </div>
              <div>
                <p className="mb-1 font-medium">Query Params</p>
                <CodeBlock
                  code={`applicationId=app_123456\npage=1\nlimit=10`}
                  language="text"
                  id="audit-postman-params"
                />
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
                    <td className="py-2"><code>applicationId</code></td>
                    <td className="py-2">string</td>
                    <td className="py-2">Required application ID</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2"><code>page</code></td>
                    <td className="py-2">integer</td>
                    <td className="py-2">Page number (default: 1)</td>
                  </tr>
                  <tr>
                    <td className="py-2"><code>limit</code></td>
                    <td className="py-2">integer</td>
                    <td className="py-2">Items per page (default: 10, max: 100)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Response</h4>
            <CodeBlock
              code={`{
  "logs": [
    {
      "id": "log_123456789",
      "action": "UPLOAD",
      "targetId": "img_987654321",
      "metadata": {
        "filename": "img_987654321.jpg",
        "originalName": "photo.jpg",
        "size": 245760,
        "contentType": "image/jpeg"
      },
      "createdAt": "2024-01-01T12:00:00.000Z",
      "ip": "192.168.1.1",
      "userAgent": "curl/7.68.0"
    },
    {
      "id": "log_123456788",
      "action": "DELETE",
      "targetId": "img_555666777",
      "metadata": {
        "filename": "img_555666777.jpg",
        "originalName": "old-photo.jpg",
        "variants": 1
      },
      "createdAt": "2024-01-01T11:30:00.000Z",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}`}
              language="json"
              id="audit-response"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Action Types</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h5 className="font-medium text-green-600 mb-2">UPLOAD</h5>
                <p className="text-sm text-muted-foreground">
                  Logged when a file is successfully uploaded. Metadata includes original filename, size, and content type.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h5 className="font-medium text-red-600 mb-2">DELETE</h5>
                <p className="text-sm text-muted-foreground">
                  Logged when a file is deleted. Metadata includes filename, original name, and variant count.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
