'use client'

import Reveal from '../Reveal'
import CTABand from '../CTABand'
import ApplyButton from './ApplyButton'
import { useApply } from './ApplyState'

// THE final call. Was WaitlistCTA — "The jobs open soon. / Be first in line." over an email-capture
// field — replaced per the PM (screenshot item 8): the CTA is "Apply now".
//
// The email field is gone with the waitlist, not relocated: the application asks for a contact email
// as its own question, so capturing one here would collect the same address twice through two
// different forms, and the one collected here would be attached to nothing.
//
// THE TWO BIG NUMBERS ARE GONE TOO ("Join 12,400+ creators waiting…"). They were invented figures, and
// their companions — the 12,400+/3,100+ stat panel — lived in the trust section the PM removed. A
// social-proof count on a pre-launch pilot page is a claim the product cannot back, and it was the
// last one left on the page.
//
// idPrefix: the submitted application's confirmation is ALSO a CTABand (ApplyForm.tsx), and both can
// be on the page at once. See CTAGrid.tsx for why duplicate SVG ids render correctly right up until
// they don't.
export default function ApplyCTA() {
  const { signedIn } = useApply()

  // NOT RENDERED WHEN SIGNED IN (designer, 2026-08-13). This band's whole job is to ask someone to
  // apply; once they are signed in the application is already open at the top of the page, so a
  // closing "Apply now" is re-pitching a decision that has been made — and its button would only
  // scroll them back up to the form they are in the middle of. The page simply ends on the FAQ, which
  // is the right last word for someone half-way through filling it in.
  //
  // Returning null rather than swapping in a "finish your application" band: that would be a second
  // entry point to one form, and the same argument that removed the hero's earnings pill applies.
  if (signedIn) return null

  return (
    <section id="apply-cta" className="px-6 pb-24 pt-24">
      <Reveal className="mx-auto max-w-content" as="div">
        <CTABand idPrefix="cbGridClosing">
          <h2 className="mx-auto max-w-[24ch] font-head text-3xl font-bold text-white sm:text-4xl">
            Applications are open.
            <span className="cb-text-gradient-dark block italic pr-[0.2em]">We onboard in batches.</span>
          </h2>
          {/* Straight from the PM's own FAQ answer, which is the only thing on record about why there
              is a queue. Nothing here promises a deadline or a spot count — neither exists. */}
          <p className="bai-body-lg mx-auto mt-4 max-w-[46ch] text-white/70">
            Apply now and we’ll email you as soon as your spot opens.
          </p>
          {/* Signed out this opens the sign-in dialog; signed in it scrolls to the form already at the
              top of the page. That branch lives in ApplyButton, not here — see it for why. */}
          <div className="mt-8 flex justify-center">
            <ApplyButton />
          </div>
        </CTABand>
      </Reveal>
    </section>
  )
}
