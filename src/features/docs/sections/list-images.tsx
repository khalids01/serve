import { CodeBlock } from "@/features/docs/code-block";
import { DocsSectionLayout } from "@/features/docs/components/docs-section-layout";
import { ListImagesApiTester } from "../components/list-images-tester";

export function ListImagesSection() {
  return (
    <DocsSectionLayout
      title="List Images"
      description="Retrieve a paginated list of images with powerful filtering and sorting options."
      method="GET"
      path="/api/images"
      tester={<ListImagesApiTester />}
      reference={
        <>
          <div>
            <h4 className="mb-3 font-semibold">Request</h4>
            <CodeBlock
              code={`curl -X GET "https://your-domain.com/api/images?page=1&limit=20&search=avatar&sortBy=createdAt&sortOrder=desc" \\
  -H "Authorization: Bearer sk_live_your_api_key"`}
              language="bash"
              id="list-curl"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              With API key auth, <code>applicationId</code> is inferred from your
              key. You may include it explicitly if it matches your key&apos;s
              application.
            </p>
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
                      <code>page</code>
                    </td>
                    <td className="py-2">integer</td>
                    <td className="py-2">Page number (default: 1)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">
                      <code>limit</code>
                    </td>
                    <td className="py-2">integer</td>
                    <td className="py-2">Items per page (default: 20, max: 100)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">
                      <code>search</code>
                    </td>
                    <td className="py-2">string</td>
                    <td className="py-2">Search filename, original name, content type</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">
                      <code>sortBy</code>
                    </td>
                    <td className="py-2">string</td>
                    <td className="py-2">Sort field: createdAt, name, size, type</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <code>sortOrder</code>
                    </td>
                    <td className="py-2">string</td>
                    <td className="py-2">Sort order: asc, desc</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Response</h4>
            <CodeBlock
              code={`{\n  "images": [\n    {\n      "id": "img_123456789",\n      "filename": "img_123456789.jpg",\n      "originalName": "avatar.jpg",\n      "contentType": "image/jpeg",\n      "sizeBytes": 245760,\n      "width": 1920,\n      "height": 1080,\n      "tags": ["profile", "avatar"],\n      "variants": [\n        {\n          "id": "var_123",\n          "label": "webp",\n          "filename": "img_123456789.webp",\n          "width": 1920,\n          "height": 1080,\n          "sizeBytes": 180000\n        }\n      ],\n      "createdAt": "2024-01-01T00:00:00.000Z",\n      "updatedAt": "2024-01-01T00:00:00.000Z"\n    }\n  ],\n  "pagination": {\n    "page": 1,\n    "limit": 20,\n    "total": 150,\n    "pages": 8,\n    "hasNext": true,\n    "hasPrev": false\n  }\n}`}
              language="json"
              id="list-response"
            />
          </div>
        </>
      }
    />
  );
}
