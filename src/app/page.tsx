import { SiteHeader } from "@/components/core/site-header"
import { Hero } from "@/features/landing/hero"
import { FeaturesGrid } from "@/features/landing/features-grid"
import { HowItWorks } from "@/features/landing/how-it-works"
import { CtaBanner } from "@/features/landing/cta-banner"

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <FeaturesGrid />
        <HowItWorks />
        <CtaBanner />
      </main>
    </div>
  )
}
