import { CodeBlock } from "@/features/docs/code-block";

export function UploadImageSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Upload Image</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Upload image files to your application storage with automatic processing and variant generation.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">POST</span>
            <code className="text-lg font-mono">/api/upload</code>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Request</h4>
            <CodeBlock
              code={`curl -X POST https://your-domain.com/api/upload \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "X-Application-Id: app_123456" \
  -F "file=@image.jpg" \
  -F "tags=profile,avatar"`}
              language="bash"
              id="upload-curl"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Postman</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="mb-1 font-medium">URL</p>
                <CodeBlock code="https://your-domain.com/api/upload" language="text" id="upload-postman-url" />
              </div>
              <div>
                <p className="mb-1 font-medium">Method</p>
                <CodeBlock code="POST" language="text" id="upload-postman-method" />
              </div>
              <div>
                <p className="mb-1 font-medium">Headers</p>
                <CodeBlock code={`Authorization: Bearer sk_live_your_api_key\nX-Application-Id: app_123456`} language="text" id="upload-postman-headers" />
              </div>
              <div>
                <p className="mb-1 font-medium">Body (form-data)</p>
                <CodeBlock
                  code={`file: [Choose File]\napplicationId: app_123456\ntags: profile,avatar`}
                  language="text"
                  id="upload-postman-body"
                />
                <p className="text-muted-foreground mt-1">Tip: Select "form-data" in Postman. Content-Type is set automatically.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">JavaScript Example</h4>
            <CodeBlock
              code={`const formData = new FormData();\nformData.append('file', fileInput.files[0]);\nformData.append('tags', 'profile,avatar');\n\nconst response = await fetch('/api/upload', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer sk_live_your_api_key'\n  },\n  body: formData\n});\n\nconst result = await response.json();`}
              language="javascript"
              id="upload-js"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Response</h4>
            <CodeBlock
              code={`{\n  "success": true,\n  "image": {\n    "id": "img_123456789",\n    "filename": "image_processed.jpg",\n    "originalName": "image.jpg",\n    "contentType": "image/jpeg",\n    "sizeBytes": 245760,\n    "width": 1920,\n    "height": 1080,\n    "url": "/api/img/img_123456789.jpg",\n    "variants": [\n      {\n        "label": "webp",\n        "filename": "img_123456789.webp",\n        "width": 1920,\n        "height": 1080,\n        "url": "/api/img/img_123456789.webp"\n      }\n    ],\n    "createdAt": "2024-01-01T00:00:00.000Z"\n  }\n}`}
              language="json"
              id="upload-response"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
