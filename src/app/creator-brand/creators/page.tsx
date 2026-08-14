'use client'

import Header from '@/components/creator-brand/Header'
import Footer from '@/components/creator-brand/Footer'
import CreatorsTop from '@/components/creator-brand/creators/CreatorsTop'
import HowItWorks from '@/components/creator-brand/creators/HowItWorks'
import Platforms from '@/components/creator-brand/creators/Platforms'
import FAQ from '@/components/creator-brand/creators/FAQ'
import ApplyCTA from '@/components/creator-brand/creators/ApplyCTA'
import PreviewToggler from '@/components/creator-brand/PreviewToggler'
import { useApply } from '@/components/creator-brand/creators/ApplyState'

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
//
// THE RETURNING-USER DASHBOARD IS THE ONE EXCEPTION (2026-08-14) — that reasoning above is about a
// FIRST-TIME visitor who might be signed in or not; a returning creator who already earns through
// BlueAI has no use for How It Works, the FAQ, an "Apply now" band or a footer full of section links
// — the dashboard IS the page for that persona, same principle as CreatorsTop already applies to its
// own swap. `'use client'` on this file (was a server component) is what lets it read that flag
// directly rather than needing a separate wrapper component just to hide four sections + the footer.
//
// onDashboard = signedIn && isReturningUser, NOT isReturningUser alone (2026-08-14 fix) — the
// dashboard only actually renders once CreatorsTop's own signedIn check passes too. Gating this on
// isReturningUser by itself hid these sections under the signed-out Hero the moment the reviewer
// flipped the preview toggle to "Returning user", before ever signing in.
export default function CreatorsPage() {
  const { signedIn, isReturningUser } = useApply()
  const onDashboard = signedIn && isReturningUser

  return (
    <>
      <Header />
      <main>
        <CreatorsTop />
        {!onDashboard && (
          <>
            <HowItWorks />
            <Platforms />
            <FAQ />
            <ApplyCTA />
          </>
        )}
      </main>
      {!onDashboard && <Footer />}
      {/* Creators only — it toggles the signed-in state, and the brands page has no signed-in state to
          toggle. Design-handoff chrome, deliberately unlike any CTA on the page. Stays mounted in
          EVERY state, dashboard included — Log out is now the real way back out, but this stays as
          the way to set up which persona the NEXT sign-in resolves to. */}
      <PreviewToggler />
    </>
  )
}
