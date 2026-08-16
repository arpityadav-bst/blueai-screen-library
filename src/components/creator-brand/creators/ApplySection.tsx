import Reveal from '../Reveal'
import ApplyForm from './ApplyForm'
import PixelRain from './PixelRain'

// The top of the page once you're signed in — a headline and the application, in place of the
// marketing hero (see CreatorsTop.tsx for the swap).
//
// IT REPLACES THE HERO RATHER THAN SITTING UNDER IT. Signing in means the pitch has landed: the
// headline, the sub-headline and the artwork exist to get someone to apply, and leaving them above
// the form pushes the thing you just signed in to do below the fold. Everything after this section —
// How It Works, Platforms, FAQ, the closing band — stays exactly as it is, because those still
// answer real questions someone half-way through an application will have.
//
// TWO IDS, and both are load-bearing. `#hero` is what the header's logo scrolls to on both pages, and
// it lives on the SECTION so that link keeps working here instead of falling through to a real
// navigation. `#apply` is on the form's own column, and it's what every "Apply now" CTA on the page
// scrolls to once you're signed in, plus what the form itself scrolls back to between steps.
export default function ApplySection() {
  return (
    // data-cb-nogate is read by Backdrop.tsx. That layer holds itself at opacity 0 for the whole of
    // #hero, because both marketing heroes are signed off and it must not repaint them — but this
    // section IS #hero when you're signed in, so the orbs and the logo star were invisible for the
    // entire application. They should be there from the top, at full strength, with no fade-in: this
    // is a form, not a hero, and it has nothing to protect.
    //
    // px-6 IS DELIBERATE AND SHOULD STAY (2026-08-14). Asked to widen the form on mobile, the obvious
    // move is to take it from here as well as from the card's own padding — this is the other 48px.
    // It is the wrong 48px: px-6 is the PAGE grid. Header.tsx, HowItWorks, the FAQ and the closing
    // band all carry the same px-6, so narrowing it here alone would leave the form card sitting
    // further out than the header's own logo and than every section below it — the exact
    // header-vs-content grid mismatch Appy caught on the dashboard earlier the same day. The card's
    // internal padding (ApplyForm) is the half that can move, because nothing else is aligned to it.
    // If the form genuinely needs more than that, change the gutter SITE-WIDE at this breakpoint
    // rather than on this one section.
    <section
      id="hero"
      data-cb-nogate="true"
      className="relative overflow-hidden px-6 pb-16 pt-10 sm:pt-14"
    >
      {/* The same ambient twinkle the marketing hero carries, for the same reason: signing in should
          not drop the reader onto a plainer page than the one that persuaded them. */}
      <PixelRain className="z-0" />

      <div className="relative z-[1] mx-auto max-w-[620px]">
        <Reveal className="text-center">
          <h1 className="font-head text-[30px] font-bold leading-[1.15] tracking-tight-2 text-ink-display sm:text-4xl md:text-5xl">
            One short application.
            <span className="mt-1 block text-gradient italic pr-[0.2em]">Then we take it from here.</span>
          </h1>
          {/* THE SUB WAS ORPHANED BY ITS OWN max-w (designer, 2026-08-13). At 46ch it was capped near
              410px inside a 620px column, so a 62-character sentence had to break — and it broke late,
              leaving "spot opens." alone on a second line under a two-line headline. Three lines of
              ragged centred text with the shortest at the bottom is what read as floating.
              It fits on ONE line in this column now. text-balance is the insurance for narrow
              viewports, where it still has to wrap: it splits the sentence evenly instead of pushing a
              stub onto its own row. The gap above also came down (5 -> 4) so it sits WITH the headline
              rather than adrift below it, and the headline's own two lines tightened for the same
              reason.
              No time estimate, still. "About three minutes" is the kind of number that is wrong for the
              reader who writes two paragraphs on question 7, and a form that under-promises its own
              length is worse than one that says nothing. The step count is visible in the rail. */}
          <p className="bai-body-lg mx-auto mt-4 [text-wrap:balance]">
            We review every application and email you when your spot opens.
          </p>
        </Reveal>

        {/* DELIBERATELY NOT WRAPPED IN <Reveal>, unlike every other block on this site. Reveal sets
            opacity:0 and restores it from a ScrollTrigger — and this section can mount while the
            viewport is at the BOTTOM of the page (signing in from the closing band), which is the one
            case where "did the trigger fire?" stops being a cosmetic question. A missed reveal on a
            marketing section is a section that fades in late; a missed reveal here is an invisible
            application form. It also doesn't want an entrance: this is the thing the reader signed in
            to do, and animating it in is noise in front of it. */}
        <div id="apply" className="mt-10 scroll-mt-24">
          <ApplyForm />
        </div>
      </div>
    </section>
  )
}
