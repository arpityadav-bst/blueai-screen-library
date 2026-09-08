'use client'

import ApplyForm from './apply/ApplyForm'
import { useCrx } from './CrxState'

// The top of the page once a NEW creator is signed in — a headline and the application, in place of
// the marketing hero. Ported from creator-brand/creators/ApplySection.tsx; copy verbatim, skin =
// this page's own hero vocabulary (kit h1 + .grad gradient line + .sub — the same classes the
// marketing hero uses, so signing in doesn't drop the reader onto a page that speaks differently).
//
// IT REPLACES THE HERO RATHER THAN SITTING UNDER IT (source's architecture, kept): signing in means
// the pitch has landed — leaving the headline/artwork above the form pushes the thing you just
// signed in to do below the fold. Everything after this section stays, because it still answers real
// questions someone half-way through an application will have.
//
// NO PixelRain — this page's ambiance is its own stars/sky; importing the light hero's twinkle layer
// would be a second ambient system fighting the first.
//
// `#apply` is the scroll target for the page's Apply CTAs once signed in. DELIBERATELY NO entrance
// animation on the form (source's rule, kept): this section can mount while the viewport is anywhere
// on the page, and a missed reveal here is an invisible application form, not a late fade — and the
// thing the reader signed in to do doesn't want noise in front of it.
export default function ApplySection({ onBack, programTitle }: { onBack?: () => void; programTitle: string }) {
  // Version C says "offers" where A says "programs" (2026-08-27); the back link is this file's
  // one line that carries the noun.
  const { variant } = useCrx()
  return (
    <section className="crx-apply">
      <div className="crx-apply-col">
        {/* Back to the programs home (2026-08-24 program-workflow pass) — rendered only when the
            application was reached THROUGH the home, so the card the reader applied from is one
            click away instead of a browser-back gamble. Quiet text, not a button: it competes
            with nothing and the form below stays the page's one big action. */}
        {onBack && (
          <button type="button" className="crx-apply-back" onClick={onBack}>
            ← Back to {variant === 'offers' ? 'offers' : 'programs'}
          </button>
        )}
        {/* THE HEADLINE NAMES THE PROGRAM (Abhisht, 2026-08-24) — "Get your worker hired." moved
            to the programs home, and this page's job is confirming WHAT you just chose: the card
            said the name, the click said apply, this h1 closes the loop. PLAIN, NO GRADIENT, on
            purpose (same review): the site's grad goes on chosen words on pitch screens; this is
            a working screen (the dashboard's plain h1 is the precedent) and the title is
            ops-authored data — a display treatment on arbitrary data eventually produces a
            half-wrapped gradient nobody designed. */}
        <h1>Apply to {programTitle}.</h1>
        {/* No time estimate, still (source): "about three minutes" is wrong for the reader who writes
            two paragraphs on question 7, and a form that under-promises its own length is worse than
            one that says nothing. The step count is visible in the rail. */}
        <p className="sub">One short application. We review every one and email you when your access is approved.</p>

        <div id="apply" className="crx-apply-form">
          <ApplyForm />
        </div>
      </div>
    </section>
  )
}
