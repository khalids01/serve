import { integrationGuide } from "@/features/docs/integration-guide";
export function GET() {
  return new Response(integrationGuide, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
