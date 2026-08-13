import Header from '@/components/creator-brand/Header'
import Footer from '@/components/creator-brand/Footer'
import CreatorsTop from '@/components/creator-brand/creators/CreatorsTop'
import HowItWorks from '@/components/creator-brand/creators/HowItWorks'
import Platforms from '@/components/creator-brand/creators/Platforms'
import FAQ from '@/components/creator-brand/creators/FAQ'
import ApplyCTA from '@/components/creator-brand/creators/ApplyCTA'
import PreviewToggler from '@/components/creator-brand/PreviewToggler'

// RESTRUCTURED 2026-08-13 to the PM's brief. Two sections were removed outright and one was replaced:
//   · JobsPreview   ("Real brands. Real budgets. Open right now.") — cut for the pilot, item 5.
//   · TrustSection  ("Nothing happens on your channel without you.") — cut, item 7; its content moved
//                   into the FAQ, which is where the PM asked for it.
//   · WaitlistCTA   → ApplyCTA. The closing band's CTA is "Apply now", item 8, and the email capture
//                   went with the waitlist since the application collects a contact email itself.
//
// CreatorsTop is the only state-dependent section: signed out it renders the marketing hero, signed in
// it renders the application form under its own headline. Everything below it is identical in both
// states, which is deliberate — someone half-way through an application still wants How It Works and
// the FAQ, and duplicating them into a signed-in variant is how the two copies start disagreeing.
export default function CreatorsPage() {
  return (
    <>
      <Header />
      <main>
        <CreatorsTop />
        <HowItWorks />
        <Platforms />
        <FAQ />
        <ApplyCTA />
      </main>
      <Footer />
      {/* Creators only — it toggles the signed-in state, and the brands page has no signed-in state to
          toggle. Design-handoff chrome, deliberately unlike any CTA on the page. */}
      <PreviewToggler />
    </>
  )
}
