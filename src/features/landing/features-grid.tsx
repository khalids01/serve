import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Zap,
  Layers3,
  Lock,
  Globe2,
  ServerCog,
} from "lucide-react";

const items = [
  {
    title: "Automatic image optimization",
    desc: "Optimized originals plus WebP copies generated on upload.",
    Icon: ServerCog,
    accent: "text-emerald-600",
  },
  {
    title: "On‑demand resizing & caching",
    desc: "Resize via URL params with disk cache and no upscaling.",
    Icon: Zap,
    accent: "text-pink-600",
  },
  {
    title: "API‑first",
    desc: "Clean, predictable REST API designed for developers.",
    Icon: Zap,
    accent: "text-yellow-500",
  },
  {
    title: "Secure by default",
    desc: "Auth, scoped keys and access control baked in.",
    Icon: ShieldCheck,
    accent: "text-emerald-500",
  },
  {
    title: "Multi‑tenant",
    desc: "Isolate data per application with clear boundaries.",
    Icon: Layers3,
    accent: "text-blue-500",
  },
  {
    title: "Encryption",
    desc: "Encrypt data at rest and in transit with TLS.",
    Icon: Lock,
    accent: "text-indigo-500",
  },
  {
    title: "Global‑ready",
    desc: "Deploy anywhere. Works great behind a CDN.",
    Icon: Globe2,
    accent: "text-sky-500",
  },
  {
    title: "Operational metrics",
    desc: "Track usage, health and performance in real time.",
    Icon: ServerCog,
    accent: "text-orange-500",
  },
];

export function FeaturesGrid() {
  return (
    <section className="container mx-auto py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center space-y-3">
        <Badge variant="outline" className="mx-auto">Features</Badge>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Simple, powerful storage
        </h2>
        <p className="text-muted-foreground">
          Everything you need to store, transform and serve files at scale.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map(({ title, desc, Icon, accent }) => (
          <Card key={title}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 ${accent} mt-0.5`} />
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
