"use client";

import { useState } from "react";
import { Copy, Check, ChevronRight, Code, Book, Zap } from "lucide-react";
import { SiteHeader } from "@/components/core/site-header";

export default function ApiDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("getting-started");

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const CodeBlock = ({
    code,
    language = "bash",
    id,
  }: {
    code: string;
    language?: string;
    id: string;
  }) => (
    <div className="relative group">
      <pre className="bg-card text-foreground p-4 rounded-lg overflow-x-auto text-sm border">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors opacity-0 group-hover:opacity-100"
      >
        {copiedCode === id ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );

  const sections = [
    { id: "getting-started", title: "Getting Started", icon: Book },
    { id: "authentication", title: "Authentication", icon: Zap },
    { id: "upload", title: "Upload Image", icon: Code },
    { id: "list", title: "List Images", icon: Code },
    { id: "get", title: "Get Image", icon: Code },
    { id: "delete", title: "Delete Image", icon: Code },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Docs Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Serve API</h1>
              <p className="text-muted-foreground">
                Fast, secure file storage API
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-8">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Getting Started */}
            {activeSection === "getting-started" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-4">
                    Getting Started
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Welcome to the Serve API! This guide will help you get
                    started with uploading and managing files.
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
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                          1
                        </span>
                        Generate an API key from your dashboard
                      </li>
                      <li className="flex items-start">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                          2
                        </span>
                        Include it in your requests
                      </li>
                      <li className="flex items-start">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                          3
                        </span>
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
                    <CodeBlock
                      code="https://your-domain.com/api/v1"
                      language="text"
                      id="base-url"
                    />
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h3 className="font-semibold mb-4">First Request</h3>
                  <p className="text-muted-foreground mb-4">
                    Here's how to make your first API call:
                  </p>
                  <CodeBlock
                    code={`curl -X POST https://your-domain.com/api/v1/upload \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -F "file=@image.jpg" \\
  -F "tags=profile,avatar"`}
                    language="bash"
                    id="first-request"
                  />
                </div>
              </div>
            )}

            {/* Authentication */}
            {activeSection === "authentication" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-4">
                    Authentication
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    All API requests require authentication using API keys.
                  </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h3 className="font-semibold mb-4">API Key Format</h3>
                  <p className="text-muted-foreground mb-4">
                    API keys follow the format{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-sm">
                      sk_live_...
                    </code>{" "}
                    and must be included in the Authorization header.
                  </p>
                  <CodeBlock
                    code="Authorization: Bearer sk_live_your_api_key_here"
                    language="text"
                    id="auth-header"
                  />
                </div>

                <div className="rounded-lg border bg-amber-50 border-amber-200 p-6">
                  <div className="flex items-start">
                    <div className="rounded-full bg-amber-100 p-1 mr-3 mt-0.5">
                      <Zap className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2">
                        Keep your API keys secure
                      </h4>
                      <p className="text-amber-700 text-sm">
                        Never expose your API keys in client-side code. Always
                        make requests from your server.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Image */}
            {activeSection === "upload" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-4">
                    Upload Image
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Upload image files to your application storage with
                    automatic processing and variant generation.
                  </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">
                        POST
                      </span>
                      <code className="text-lg font-mono">/api/v1/upload</code>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Request</h4>
                      <CodeBlock
                        code={`curl -X POST https://your-domain.com/api/v1/upload \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -F "file=@image.jpg" \\
  -F "tags=profile,avatar"`}
                        language="bash"
                        id="upload-curl"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">JavaScript Example</h4>
                      <CodeBlock
                        code={`const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('tags', 'profile,avatar');

const response = await fetch('/api/v1/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_your_api_key'
  },
  body: formData
});

const result = await response.json();`}
                        language="javascript"
                        id="upload-js"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Response</h4>
                      <CodeBlock
                        code={`{
  "success": true,
  "image": {
    "id": "img_123456789",
    "filename": "image_processed.jpg",
    "originalName": "image.jpg",
    "contentType": "image/jpeg",
    "sizeBytes": 245760,
    "width": 1920,
    "height": 1080,
    "url": "https://your-domain.com/uploads/app_id/image_processed.jpg",
    "variants": [
      {
        "label": "thumb",
        "filename": "image_processed_thumb.jpg",
        "width": 150,
        "height": 150,
        "url": "https://your-domain.com/uploads/app_id/image_processed_thumb.jpg"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}`}
                        language="json"
                        id="upload-response"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* List Images */}
            {activeSection === "list" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-4">
                    List Images
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Retrieve a paginated list of images with powerful filtering
                    and sorting options.
                  </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="bg-muted text-foreground text-xs font-medium px-2.5 py-0.5 rounded mr-3">
                        GET
                      </span>
                      <code className="text-lg font-mono">/api/v1/images</code>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Request</h4>
                      <CodeBlock
                        code={`curl -X GET "https://your-domain.com/api/v1/images?page=1&limit=20&search=avatar&sortBy=createdAt&sortOrder=desc" \\
  -H "Authorization: Bearer sk_live_your_api_key"`}
                        language="bash"
                        id="list-curl"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Query Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 font-medium">
                                Parameter
                              </th>
                              <th className="text-left py-2 font-medium">
                                Type
                              </th>
                              <th className="text-left py-2 font-medium">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-muted-foreground">
                            <tr className="border-b">
                              <td className="py-2">
                                <code>page</code>
                              </td>
                              <td className="py-2">integer</td>
                              <td className="py-2">Page number (default: 1)</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">
                                <code>limit</code>
                              </td>
                              <td className="py-2">integer</td>
                              <td className="py-2">
                                Items per page (default: 20, max: 100)
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">
                                <code>search</code>
                              </td>
                              <td className="py-2">string</td>
                              <td className="py-2">
                                Search in filename, original name, content type
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">
                                <code>contentType</code>
                              </td>
                              <td className="py-2">string</td>
                              <td className="py-2">
                                Filter by MIME type (e.g., "image/jpeg")
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">
                                <code>sortBy</code>
                              </td>
                              <td className="py-2">string</td>
                              <td className="py-2">
                                Sort field: createdAt, name, size, type
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2">
                                <code>sortOrder</code>
                              </td>
                              <td className="py-2">string</td>
                              <td className="py-2">Sort order: asc, desc</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Response</h4>
                      <CodeBlock
                        code={`{
  "images": [
    {
      "id": "img_123456789",
      "filename": "image_processed.jpg",
      "originalName": "avatar.jpg",
      "contentType": "image/jpeg",
      "sizeBytes": 245760,
      "width": 1920,
      "height": 1080,
      "variants": [...],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}`}
                        language="json"
                        id="list-response"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Get Image */}
            {activeSection === "get" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-4">
                    Get Image
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Retrieve detailed information about a specific image
                    including all variants.
                  </p>
                  <CodeBlock
                    code={`curl -X GET "https://your-domain.com/api/v1/images/img_123456789" \\
  -H "Authorization: Bearer sk_live_your_api_key"`}
                    language="bash"
                    id="get-curl"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Response</h4>
                  <CodeBlock
                    code={`{
  "id": "img_123456789",
  "filename": "image_processed.jpg",
  "originalName": "avatar.jpg",
  "contentType": "image/jpeg",
  "sizeBytes": 245760,
  "width": 1920,
  "height": 1080,
  "tags": ["profile", "avatar"],
  "variants": [
    {
      "id": "var_123",
      "label": "thumb",
      "filename": "image_processed_thumb.jpg",
      "width": 150,
      "height": 150,
      "sizeBytes": 8192
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}`}
                    language="json"
                    id="get-response"
                  />
                </div>
              </div>
            )}

            {/* Delete Image */}
            {activeSection === "delete" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-4">
                    Delete Image
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Permanently delete an image and all its variants from
                    storage.
                  </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">
                        DELETE
                      </span>
                      <code className="text-lg font-mono">
                        /api/v1/images/{"{id}"}
                      </code>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <div className="flex items-start">
                        <div className="rounded-full bg-red-100 p-1 mr-3 mt-0.5">
                          <Zap className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-800 mb-1">
                            Warning
                          </h4>
                          <p className="text-red-700 text-sm">
                            This action cannot be undone. The image and all its
                            variants will be permanently deleted.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Request</h4>
                      <CodeBlock
                        code={`curl -X DELETE "https://your-domain.com/api/v1/images/img_123456789" \\
  -H "Authorization: Bearer sk_live_your_api_key"`}
                        language="bash"
                        id="delete-curl"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Response</h4>
                      <CodeBlock
                        code={`{
  "success": true,
  "message": "Image deleted successfully"
}`}
                        language="json"
                        id="delete-response"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
