import { CodeBlock } from "@/features/docs/code-block";
import { DocsSectionLayout } from "@/features/docs/components/docs-section-layout";
import { AuditLogsApiTester } from "../components/audit-logs-tester";

export function AuditLogsSection() {
  return (
    <DocsSectionLayout
      title="Audit Logs"
      description="Track all file upload and deletion activities for your applications with detailed audit logs."
      method="GET"
      path="/api/audit-logs"
      tester={<AuditLogsApiTester />}
      reference={
        <>
          <div>
            <h4 className="mb-3 font-semibold">Request</h4>
            <CodeBlock
              code={`curl -X GET "https://your-domain.com/api/audit-logs?applicationId=app_123456&page=1&limit=10" \\
  -H "Authorization: Bearer sk_live_your_api_key"`}
              language="bash"
              id="audit-curl"
            />
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Query Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium">Parameter</th>
                    <th className="py-2 text-left font-medium">Type</th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-2">
                      <code>applicationId</code>
                    </td>
                    <td className="py-2">string</td>
                    <td className="py-2">Required application ID</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">
                      <code>page</code>
                    </td>
                    <td className="py-2">integer</td>
                    <td className="py-2">Page number (default: 1)</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <code>limit</code>
                    </td>
                    <td className="py-2">integer</td>
                    <td className="py-2">Items per page (default: 10, max: 100)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Response</h4>
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
            <h4 className="mb-3 font-semibold">Action Types</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h5 className="mb-2 font-medium text-green-600">UPLOAD</h5>
                <p className="text-sm text-muted-foreground">
                  Logged when a file is successfully uploaded.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h5 className="mb-2 font-medium text-red-600">DELETE</h5>
                <p className="text-sm text-muted-foreground">
                  Logged when a file is deleted.
                </p>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}
