import { SiteHeader } from "@/components/core/site-header"
import { Hero } from "@/features/landing/hero"

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
      </main>
    </div>
  )
}
