import ApplyForm from './apply/ApplyForm'

// The top of the page once a NEW creator is signed in — a headline and the application, in place of
// the marketing hero. Ported from creator-brand/creators/ApplySection.tsx; skin = this page's own
// hero vocabulary (kit h1 + .grad gradient line + .sub — the same classes the marketing hero uses,
// so signing in doesn't drop the reader onto a page that speaks differently).
//
// HEADLINE REFRAMED (PM, 2026-08-20, after the Aug 18 CEO review): the CTA that brought the reader
// here says "Join the first wave" and the landing says "You get it hired", so this page must not
// revert to you-as-applicant ("One short application" led before). The sub keeps the review promise
// but names the SAME scarcity the CTA sold — "a spot in the first wave", not a generic "your spot".
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
export default function ApplySection() {
  return (
    <section className="crx-apply">
      <div className="crx-apply-col">
        <h1>
          Get your worker <span className="grad">hired.</span>
        </h1>
        {/* No time estimate, still (source): "about three minutes" is wrong for the reader who writes
            two paragraphs on question 7, and a form that under-promises its own length is worse than
            one that says nothing. The step count is visible in the rail. */}
        <p className="sub">One short application. We review every one and email you when a spot in the first wave opens.</p>

        <div id="apply" className="crx-apply-form">
          <ApplyForm />
        </div>
      </div>
    </section>
  )
}
