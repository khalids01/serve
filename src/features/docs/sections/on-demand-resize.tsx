import { CodeBlock } from "@/features/docs/code-block";

export function OnDemandResizeSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          On‑demand Resize
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          Serve any image at the exact dimensions you need using query
          parameters. We cache generated sizes on disk, avoid upscaling, and
          preserve aspect ratio when only one dimension is provided.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div>
          <h4 className="font-semibold mb-3">Endpoint</h4>
          <code className="text-sm">GET /api/img/:name</code>
          <div className="text-sm text-muted-foreground mt-2">
            Query params: <code>w</code> (or <code>width</code>), <code>h</code>{" "}
            (or <code>height</code>). To change format, request a different
            extension in <code>:name</code> (e.g. <code>.webp</code>, <code>.avif</code>).
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Examples</h4>
          <CodeBlock
            id="resize-curl"
            language="bash"
            code={`# Original (no resize)
curl -i \
  "https://your-domain.com/api/img/IMG_NAME.jpg"

# Width only (keeps aspect ratio)
curl -i \
  "https://your-domain.com/api/img/IMG_NAME.jpg?w=800"

# Height only (keeps aspect ratio)
curl -i \
  "https://your-domain.com/api/img/IMG_NAME.jpg?h=600"

# Width and height (fit=inside, no upscaling)
curl -i \
  "https://your-domain.com/api/img/IMG_NAME.jpg?w=1200&h=800"

# Request WebP output by extension
curl -i \
  "https://your-domain.com/api/img/IMG_NAME.webp?w=800"`}
          />
        </div>

        <div>
          <h4 className="font-semibold mb-3">Behavior</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
            <li>
              <strong>Aspect ratio</strong>: preserved when only one dimension
              is specified
            </li>
            <li>
              <strong>No upscaling</strong>: images won't be enlarged beyond
              their original size
            </li>
            <li>
              <strong>Caching</strong>: resized outputs stored under{" "}
              <code>_cache</code> for fast subsequent responses
            </li>
            <li>
              <strong>Headers</strong>: immutable cache with 1‑year max‑age
            </li>
            <li>
              <strong>Limits</strong>: dimensions clamped to a safe maximum
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
