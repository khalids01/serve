import { Hero } from "@/features/landing/hero"
import { FeaturesGrid } from "@/features/landing/features-grid"
import { HowItWorks } from "@/features/landing/how-it-works"
import { CtaBanner } from "@/features/landing/cta-banner"
import { PublicHeader } from "@/components/core/public-header"

export default function Home() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main>
        <Hero />
        <FeaturesGrid />
        <HowItWorks />
        <CtaBanner />
      </main>
    </div>
  )
}
