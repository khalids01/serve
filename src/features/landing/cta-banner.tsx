import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="container mx-auto py-16 md:py-24">
      <div className="relative overflow-hidden rounded-xl border bg-card p-8 md:p-12 text-center">
        <div className="space-y-3 max-w-2xl mx-auto">
          <Badge variant="secondary" className="mx-auto">Get started</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Build your file platform today
          </h2>
          <p className="text-muted-foreground">
            Spin up Serve locally or deploy to your own infrastructure. Keep control, stay fast.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/dashboard">Launch Console</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/docs">Read the Docs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
