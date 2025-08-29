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
            <code className="text-lg font-mono">/api/v1/upload</code>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Request</h4>
            <CodeBlock
              code={`curl -X POST https://your-domain.com/api/v1/upload \\\n  -H "Authorization: Bearer sk_live_your_api_key" \\\n  -F "file=@image.jpg" \\\n  -F "tags=profile,avatar"`}
              language="bash"
              id="upload-curl"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">JavaScript Example</h4>
            <CodeBlock
              code={`const formData = new FormData();\nformData.append('file', fileInput.files[0]);\nformData.append('tags', 'profile,avatar');\n\nconst response = await fetch('/api/v1/upload', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer sk_live_your_api_key'\n  },\n  body: formData\n});\n\nconst result = await response.json();`}
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
