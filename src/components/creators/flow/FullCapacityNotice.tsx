'use client'

import CtaBand from '../CtaBand'
import { useCrx } from './CrxState'

// Ported from the frozen creator-brand tree (creator-brand/creators/FullCapacityNotice.tsx).
//
// BACK IN A GRID-LINED BAND, which is where the original had it. This page had no equivalent when
// the notice was first ported, so it became a dark .crx-panel; the homepage grew one (CtaBand) and
// Appy asked for both flow confirmations to use it (2026-08-20). It shares .crx-confirm with
// ApplyForm's submitted state, so the two are one size by construction rather than by two numbers
// that agree today.
//
// The "full capacity" persona — the signed-in branch alongside ApplySection and Dashboard. A
// creator signs in exactly like a first-time applicant (same SignInDialog), but instead of the
// application form they land straight here: BlueAI isn't taking on new creators right now.
//
// Tall on purpose: it stands in the application form's slot at the top of the page, so it should
// feel like the same weight of thing sliding into the same slot — which is the same reason
// .crx-confirm's min-height is derived from ApplyForm's own height.
export default function FullCapacityNotice() {
  const { account } = useCrx()

  return (
    <section className="crx-full">
      {/* A page heading over the notice (Appy, 2026-08-20), the same shape ApplySection uses: an
          h1 that names the state, a one-line sub for the expectation, then the panel. Without it
          this view opened straight onto a card, which read as a dialog someone had left on screen
          rather than as a page.
          THE HEADING STATES THE SITUATION, THE PANEL CONFIRMS IT PERSONALLY. That split is why the
          notice's own copy lost its "we're at full capacity right now and not onboarding new
          creators just yet" sentence in the same edit — the h1 says it in five words, and having
          both made the screen say one thing twice in two registers. */}
      <h1>
        The first wave is full.
        <br />
        <span className="grad">The next one is not.</span>
      </h1>
      <p className="sub">We onboard creators in batches, so this is a queue rather than a no.</p>

      <CtaBand className="dark">
        <div className="crx-confirm">
          <span className="crx-confirm-tick">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4.5 12.5l5 5L19.5 6.5" />
            </svg>
          </span>
          <h2>Thanks for your interest.</h2>
          <p>
            We&apos;ll email <b>{account.email}</b> the moment a spot opens up.
          </p>
        </div>
      </CtaBand>
    </section>
  )
}
