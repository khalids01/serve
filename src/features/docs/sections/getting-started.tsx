import { CodeBlock } from "@/features/docs/code-block";
import { Book, Zap } from "lucide-react";

export function GettingStartedSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Getting Started</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Welcome to the Serve API! This guide will help you get started with uploading and managing files.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-primary/10 p-2 mr-3">
              <Book className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold">Quick Setup</h3>
          </div>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              Generate an API key from your dashboard
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              Include it in your requests
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              Start uploading files
            </li>
          </ol>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-green-100 p-2 mr-3">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold">Base URL</h3>
          </div>
          <CodeBlock code="https://your-domain.com/api/v1" language="text" id="base-url" />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-4">First Request</h3>
        <p className="text-muted-foreground mb-4">Here's how to make your first API call:</p>
        <CodeBlock
          code={`curl -X POST https://your-domain.com/api/v1/upload \\\n  -H "Authorization: Bearer sk_live_your_api_key" \\\n  -F "file=@image.jpg" \\\n  -F "tags=profile,avatar"`}
          language="bash"
          id="first-request"
        />
      </div>
    </div>
  );
}
