import Reveal from '../Reveal'
import ApplyForm from './ApplyForm'

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
    <section id="hero" className="px-6 pb-16 pt-10 sm:pt-14">
      <div className="mx-auto max-w-[620px]">
        <Reveal className="text-center">
          <h1 className="font-head text-4xl font-bold tracking-tight-2 text-ink-display sm:text-5xl">
            One short application.
            <span className="mt-2 block text-gradient italic pr-[0.2em]">Then we take it from here.</span>
          </h1>
          {/* No time estimate. "About three minutes" is the kind of number that is wrong for the
              reader who writes two paragraphs on question 7, and a form that under-promises its own
              length is worse than one that says nothing. The step count is visible in the rail. */}
          <p className="bai-body-lg mx-auto mt-5 max-w-[46ch]">
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
