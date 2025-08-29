import { CodeBlock } from "@/features/docs/code-block";

export function GetImageSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Get Image</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Retrieve detailed information about a specific image including all variants.
        </p>
        <CodeBlock
          code={`curl -X GET "https://your-domain.com/api/images/img_123456789" \\\n  -H "Authorization: Bearer sk_live_your_api_key"`}
          language="bash"
          id="get-curl"
        />
      </div>

      <div>
        <h4 className="font-semibold mb-3">Postman</h4>
        <div className="space-y-3 text-sm">
          <div>
            <p className="mb-1 font-medium">URL</p>
            <CodeBlock code="https://your-domain.com/api/images/img_123456789" language="text" id="get-postman-url" />
          </div>
          <div>
            <p className="mb-1 font-medium">Method</p>
            <CodeBlock code="GET" language="text" id="get-postman-method" />
          </div>
          <div>
            <p className="mb-1 font-medium">Headers</p>
            <CodeBlock code={`Authorization: Bearer sk_live_your_api_key`} language="text" id="get-postman-headers" />
          </div>
          <div>
            <p className="mb-1 font-medium">Query Params</p>
            <CodeBlock code={`N/A`} language="text" id="get-postman-params" />
          </div>
          <div>
            <p className="mb-1 font-medium">Body</p>
            <CodeBlock code={`N/A`} language="text" id="get-postman-body" />
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Response</h4>
        <CodeBlock
          code={`{\n  "id": "img_123456789",\n  "filename": "image_processed.jpg",\n  "originalName": "avatar.jpg",\n  "contentType": "image/jpeg",\n  "sizeBytes": 245760,\n  "width": 1920,\n  "height": 1080,\n  "tags": ["profile", "avatar"],\n  "variants": [\n    {\n      "id": "var_123",\n      "label": "thumb",\n      "filename": "image_processed_thumb.jpg",\n      "width": 150,\n      "height": 150,\n      "sizeBytes": 8192\n    }\n  ],\n  "createdAt": "2024-01-01T00:00:00.000Z",\n  "updatedAt": "2024-01-01T00:00:00.000Z"\n}`}
          language="json"
          id="get-response"
        />
      </div>
    </div>
  );
}
