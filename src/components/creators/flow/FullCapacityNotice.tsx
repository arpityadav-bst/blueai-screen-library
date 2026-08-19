'use client'

import { useCrx } from './CrxState'

// Ported from the frozen creator-brand tree (creator-brand/creators/FullCapacityNotice.tsx).
// Copy verbatim; presentation re-imagined for this page: the light original stood inside a CTABand
// (gradient + perspective grid-lines) sized to match the application form it replaces. This page
// has neither of those props, so the notice is a tall centered .crx-panel — the same card surface
// the application itself lives on here — with the tick mark in this page's own success language
// (the mint .crx-stat-icon.money circle; mint = money/success, the kit's one rule about it).
//
// The "full capacity" persona — the signed-in branch alongside ApplySection and Dashboard. A
// creator signs in exactly like a first-time applicant (same SignInDialog), but instead of the
// application form they land straight here: BlueAI isn't taking on new creators right now.
//
// Tall on purpose (.crx-full-panel min-height): it stands in the application form's slot at the top
// of the page, so it should feel like the same weight of thing sliding into the same slot — the
// light original derived its min-height from ApplyForm for exactly this reason.
export default function FullCapacityNotice() {
  const { account } = useCrx()

  return (
    <section className="crx-full">
      <div className="crx-panel crx-full-panel">
        <span className="crx-stat-icon money crx-full-tick">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 12.5l5 5L19.5 6.5" />
          </svg>
        </span>
        <h2 className="crx-full-title">Thanks for your interest.</h2>
        <p className="crx-full-copy">
          We&apos;re at full capacity right now and not onboarding new creators just yet.
          We&apos;ll email <b>{account.email}</b> the moment a spot opens up.
        </p>
      </div>
    </section>
  )
}
