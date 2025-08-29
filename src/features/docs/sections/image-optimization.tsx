import { CodeBlock } from "@/features/docs/code-block";

export function ImageOptimizationSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Image Optimization & WebP
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          On upload, images are optimized in their original format for mobile
          devices, and a same-dimension
          <code className="mx-1">.webp</code> copy is generated for modern
          browsers. You also get ready-made size variants for common
          breakpoints.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div>
          <h4 className="font-semibold mb-3">What happens on upload</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
            <li>
              Optimize original: JPEG/PNG/WebP with sensible quality and
              compression settings
            </li>
            <li>
              Create same-dimension WebP copy using the same base filename
            </li>
            <li>
              Files are stored under your <code>UPLOAD_DIR</code> (by app slug)
              and are served via <code>/api/img/:name</code>.
            </li>
            <li>
              Size variants are served <em>on-demand</em> via query params
              (e.g., <code>?w=640</code>, <code>?h=480</code>, optional
              <code>?q=80</code>), and cached on disk.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Upload Response (excerpt)</h4>
          <CodeBlock
            id="upload-optimization-response"
            language="json"
            code={`{
  "success": true,
  "image": {
    "id": "img_123",
    "filename": "<fileId>.jpg",
    "url": "/api/img/<fileId>.jpg",
    "variants": [
      { "label": "webp", "filename": "<fileId>.webp", "url": "/api/img/<fileId>.webp" }
    ]
  }
}`}
          />
        </div>
      </div>
    </div>
  );
}
