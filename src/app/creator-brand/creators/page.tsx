import Header from '@/components/creator-brand/Header'
import Footer from '@/components/creator-brand/Footer'
import Hero from '@/components/creator-brand/creators/Hero'
import HowItWorks from '@/components/creator-brand/creators/HowItWorks'
import JobsPreview from '@/components/creator-brand/creators/JobsPreview'
import Platforms from '@/components/creator-brand/creators/Platforms'
import TrustSection from '@/components/creator-brand/creators/TrustSection'
import FAQ from '@/components/creator-brand/creators/FAQ'
import WaitlistCTA from '@/components/creator-brand/creators/WaitlistCTA'
import PreviewToggler from '@/components/creator-brand/PreviewToggler'

export default function CreatorsPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <JobsPreview />
        <Platforms />
        <TrustSection />
        <FAQ />
        <WaitlistCTA />
      </main>
      <Footer />
      {/* Creators only — it drives the handle lookup's two outcomes, and the brands page has no
          lookup to drive. Design-handoff chrome, deliberately unlike any CTA on the page. */}
      <PreviewToggler />
    </>
  )
}
