import { CodeBlock } from "@/features/docs/code-block";
import { Zap } from "lucide-react";

export function AuthenticationSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Authentication</h2>
        <p className="text-lg text-muted-foreground mb-6">
          All API requests require authentication using API keys.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-4">API Key Format</h3>
        <p className="text-muted-foreground mb-4">
          API keys follow the format <code className="bg-muted px-1 py-0.5 rounded text-sm">sk_live_...</code> and must be included in the Authorization header.
        </p>
        <CodeBlock code="Authorization: Bearer sk_live_your_api_key_here" language="text" id="auth-header" />
      </div>

      <div className="rounded-lg border bg-amber-50 border-amber-200 p-6">
        <div className="flex items-start">
          <div className="rounded-full bg-amber-100 p-1 mr-3 mt-0.5">
            <Zap className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">Keep your API keys secure</h4>
            <p className="text-amber-700 text-sm">
              Never expose your API keys in client-side code. Always make requests from your server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
