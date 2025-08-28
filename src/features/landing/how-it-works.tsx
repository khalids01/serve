import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, Image as ImageIcon, Globe } from "lucide-react";

const steps = [
  {
    title: "Upload",
    desc: "Send files via REST with multipart/form-data or direct streams.",
    Icon: UploadCloud,
    accent: "text-blue-500",
  },
  {
    title: "Process",
    desc: "Store securely, auto-generate variants and capture metadata.",
    Icon: ImageIcon,
    accent: "text-violet-500",
  },
  {
    title: "Serve",
    desc: "Deliver fast from your server or behind a CDN with signed URLs.",
    Icon: Globe,
    accent: "text-emerald-500",
  },
];

export function HowItWorks() {
  return (
    <section className="container mx-auto py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center space-y-3">
        <Badge variant="outline" className="mx-auto">How it works</Badge>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          From upload to delivery
        </h2>
        <p className="text-muted-foreground">
          A focused pipeline built for reliability and speed.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {steps.map(({ title, desc, Icon, accent }, idx) => (
          <Card key={title}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground text-sm font-medium">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${accent}`} />
                    <h3 className="font-semibold">{title}</h3>
                  </div>
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
