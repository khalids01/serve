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
        <h3 className="font-semibold mb-4">API Key Headers</h3>
        <p className="text-muted-foreground mb-4">
          API keys follow the format <code className="bg-muted px-1 py-0.5 rounded text-sm">sk_live_...</code> and must be sent in one of the following headers:
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Option 1: x-api-key</p>
            <CodeBlock code="x-api-key: sk_live_your_api_key_here" language="text" id="auth-header-x-api-key" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Option 2: Authorization</p>
            <CodeBlock code="Authorization: Bearer sk_live_your_api_key_here" language="text" id="auth-header-authorization" />
          </div>
        </div>
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

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-2">Key Lifetime</h3>
        <p className="text-muted-foreground text-sm">
          API keys do not expire automatically. Revoke or delete them to invalidate.
        </p>
      </div>
    </div>
  );
}
