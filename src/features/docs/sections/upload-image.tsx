import { CodeBlock } from "@/features/docs/code-block";
import { DocsSectionLayout } from "@/features/docs/components/docs-section-layout";
import { UploadApiTester } from "../components/upload-api-tester";

export function UploadImageSection() {
  return (
    <DocsSectionLayout
      title="Upload Image"
      description="Upload image files to your application storage with automatic processing and variant generation. When using API key authentication, the application ID is automatically determined from your key."
      method="POST"
      path="/api/upload"
      tester={<UploadApiTester />}
      reference={
        <>
          <div>
            <h4 className="mb-3 font-semibold">Request</h4>
            <CodeBlock
              code={`curl -X POST https://your-domain.com/api/upload \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -F "file=@image.jpg" \\
  -F "tags=profile,avatar"`}
              language="bash"
              id="upload-curl"
            />
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Postman</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="mb-1 font-medium">URL</p>
                <CodeBlock
                  code="https://your-domain.com/api/upload"
                  language="text"
                  id="upload-postman-url"
                />
              </div>
              <div>
                <p className="mb-1 font-medium">Headers</p>
                <CodeBlock
                  code={`Authorization: Bearer sk_live_your_api_key`}
                  language="text"
                  id="upload-postman-headers"
                />
              </div>
              <div>
                <p className="mb-1 font-medium">Body (form-data)</p>
                <CodeBlock
                  code={`file: [Choose File]\ntags: profile,avatar`}
                  language="text"
                  id="upload-postman-body"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">JavaScript Example</h4>
            <CodeBlock
              code={`const formData = new FormData();\nformData.append('file', fileInput.files[0]);\nformData.append('tags', 'profile,avatar');\n\nconst response = await fetch('/api/upload', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer sk_live_your_api_key'\n  },\n  body: formData\n});\n\nconst result = await response.json();`}
              language="javascript"
              id="upload-js"
            />
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Response</h4>
            <CodeBlock
              code={`{\n  "success": true,\n  "image": {\n    "id": "img_123456789",\n    "filename": "img_123456789.jpg",\n    "originalName": "image.jpg",\n    "contentType": "image/jpeg",\n    "sizeBytes": 245760,\n    "width": 1920,\n    "height": 1080,\n    "tags": ["profile", "avatar"],\n    "url": "/api/img/img_123456789.jpg",\n    "variants": [\n      {\n        "id": "var_123",\n        "label": "webp",\n        "filename": "img_123456789.webp",\n        "width": 1920,\n        "height": 1080,\n        "sizeBytes": 180000,\n        "url": "/api/img/img_123456789.webp"\n      }\n    ],\n    "createdAt": "2024-01-01T00:00:00.000Z",\n    "updatedAt": "2024-01-01T00:00:00.000Z"\n  }\n}`}
              language="json"
              id="upload-response"
            />
          </div>
        </>
      }
    />
  );
}
