import { CodeBlock } from "@/features/docs/code-block";
import { DocsSectionLayout } from "@/features/docs/components/docs-section-layout";
import { DeleteImageApiTester } from "../components/delete-image-tester";
import { Zap } from "lucide-react";

export function DeleteImageSection() {
  return (
    <DocsSectionLayout
      title="Delete Image"
      description="Permanently delete an image and all its variants from storage."
      method="DELETE"
      path="/api/images/{id}"
      alert={
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-start">
            <div className="mr-3 mt-0.5 rounded-full bg-red-100 p-1 dark:bg-red-900">
              <Zap className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-red-800 dark:text-red-300">
                Warning
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400">
                This action cannot be undone. The image and all its variants
                will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      }
      tester={<DeleteImageApiTester />}
      reference={
        <>
          <div>
            <h4 className="mb-3 font-semibold">Request</h4>
            <CodeBlock
              code={`curl -X DELETE "https://your-domain.com/api/images/img_123456789" \\
  -H "Authorization: Bearer sk_live_your_api_key"`}
              language="bash"
              id="delete-curl"
            />
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Response</h4>
            <CodeBlock
              code={`{\n  "success": true\n}`}
              language="json"
              id="delete-response"
            />
          </div>
        </>
      }
    />
  );
}
