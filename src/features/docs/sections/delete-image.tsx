import { CodeBlock } from "@/features/docs/code-block";
import { Zap } from "lucide-react";

export function DeleteImageSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Delete Image</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Permanently delete an image and all its variants from storage.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">DELETE</span>
            <code className="text-lg font-mono">/api/images/{"{id}"}</code>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start">
              <div className="rounded-full bg-red-100 p-1 mr-3 mt-0.5">
                <Zap className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Warning</h4>
                <p className="text-red-700 text-sm">
                  This action cannot be undone. The image and all its variants will be permanently deleted.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Request</h4>
            <CodeBlock
              code={`curl -X DELETE "https://your-domain.com/api/images/img_123456789" \\
  -H "Authorization: Bearer sk_live_your_api_key"`}
              language="bash"
              id="delete-curl"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Postman</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="mb-1 font-medium">URL</p>
                <CodeBlock code="https://your-domain.com/api/images/img_123456789" language="text" id="delete-postman-url" />
              </div>
              <div>
                <p className="mb-1 font-medium">Method</p>
                <CodeBlock code="DELETE" language="text" id="delete-postman-method" />
              </div>
              <div>
                <p className="mb-1 font-medium">Headers</p>
                <CodeBlock code={`Authorization: Bearer sk_live_your_api_key`} language="text" id="delete-postman-headers" />
              </div>
              <div>
                <p className="mb-1 font-medium">Query Params</p>
                <CodeBlock code={`N/A`} language="text" id="delete-postman-params" />
              </div>
              <div>
                <p className="mb-1 font-medium">Body</p>
                <CodeBlock code={`N/A`} language="text" id="delete-postman-body" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Response</h4>
            <CodeBlock
              code={`{\n  "success": true,\n  "message": "Image deleted successfully"\n}`}
              language="json"
              id="delete-response"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
