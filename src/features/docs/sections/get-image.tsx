import { CodeBlock } from "@/features/docs/code-block";
import { DocsSectionLayout } from "@/features/docs/components/docs-section-layout";
import { GetImageApiTester } from "../components/get-image-tester";

export function GetImageSection() {
  return (
    <DocsSectionLayout
      title="Get Image"
      description="Retrieve detailed information about a specific image including all variants."
      method="GET"
      path="/api/images/{id}"
      tester={<GetImageApiTester />}
      reference={
        <>
          <div>
            <h4 className="mb-3 font-semibold">Request</h4>
            <CodeBlock
              code={`curl -X GET "https://your-domain.com/api/images/img_123456789" \\
  -H "Authorization: Bearer sk_live_your_api_key"`}
              language="bash"
              id="get-curl"
            />
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Response</h4>
            <CodeBlock
              code={`{\n  "id": "img_123456789",\n  "filename": "img_123456789.jpg",\n  "originalName": "avatar.jpg",\n  "contentType": "image/jpeg",\n  "sizeBytes": 245760,\n  "width": 1920,\n  "height": 1080,\n  "tags": ["profile", "avatar"],\n  "applicationId": "app_123456",\n  "url": "/api/img/img_123456789.jpg",\n  "variants": [\n    {\n      "id": "var_123",\n      "label": "webp",\n      "filename": "img_123456789.webp",\n      "width": 1920,\n      "height": 1080,\n      "sizeBytes": 180000,\n      "url": "/api/img/img_123456789.webp"\n    }\n  ],\n  "application": {\n    "id": "app_123456",\n    "name": "My App",\n    "slug": "my-app"\n  },\n  "createdAt": "2024-01-01T00:00:00.000Z",\n  "updatedAt": "2024-01-01T00:00:00.000Z"\n}`}
              language="json"
              id="get-response"
            />
          </div>
        </>
      }
    />
  );
}
