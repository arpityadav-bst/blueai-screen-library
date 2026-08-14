import Image from 'next/image'
import { Sparkle } from '@/components/Sparkle'
import type { Step } from './types'

// ONE step cell: the oversized numeral behind it, the card, and the card's media panel. Split out of
// StepCards.tsx on 2026-08-13, which was 474 lines against this project's 300-line rule.
//
// THREE NESTED ELEMENTS, and the nesting is what makes the numerals able to hang arbitrarily far
// left. Two separate constraints force it:
//
//  1. STACKING. The outer cell must carry NO opacity and NO transform. Either one makes it a stacking
//     context, which traps its children's z-index inside it — and since sibling cells then paint in
//     DOM order, card 2's numeral would paint on top of card 1's card. Keeping the cell plain leaves
//     every numeral (z-0) and every card-lift (z-10) in the TRACK's stacking context, so all numerals
//     sort below all cards globally and a numeral can overlap its neighbour safely. That is why the
//     entrance animates the numeral and the lift, not this cell.
//  2. TRANSFORM COLLISION. GSAP writes `transform` inline, and an inline transform beats Tailwind's
//     `hover:-translate-y` class outright — so the scripted move and the hover move cannot live on
//     the same element. The lift div owns the scripted one, the article owns the hover one.
export default function StepCell({
  step,
  i,
  total,
  strokeId,
  maskId,
  cellRef,
  numRef,
  liftRef,
}: {
  step: Step
  i: number
  total: number
  strokeId: string
  maskId: string
  cellRef: (el: HTMLElement | null) => void
  numRef: (el: SVGSVGElement | null) => void
  liftRef: (el: HTMLElement | null) => void
}) {
  return (
    <div ref={cellRef} className="cb-step-card relative">
      {/* Oversized numeral BEHIND the card, hanging past its top-left corner. Gradient OUTLINE
          rather than a flat grey fill: at 7% grey the exposed sliver was invisible, and simply
          raising the grey's opacity would have read as a smudge. An outline in the brand gradient is
          legible at low weight because the eye picks up the contour, not the mass.

          SVG rather than CSS, because there is no reliable way to stroke text with a gradient in
          CSS — `-webkit-text-stroke` takes a solid colour only, and `background-clip: text` fills the
          glyph rather than outlining it. SVG also gets the directional fade for free via a mask.

          Plain "1", not step.n's "01" — at this size a leading zero reads as a second glyph competing
          with the first rather than as a step label. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 150 185"
        // hidden below lg: the stacked mobile layout has no gutter for a numeral to hang into, so it
        // would only ever be clipped. It's decorative, so it goes.
        //
        // Geometry, so it can be re-derived rather than re-guessed: the viewBox is 150x185 rendered
        // at 203x250, i.e. scaled 1.35. The digit's cap height is ~0.72em = 140 units, sitting on the
        // y=152 baseline, so its top edge is 12 units (16px) below the SVG's own top. At -top-24
        // (96px) that leaves ~80px of digit above the card, visible because .cb-step-clip's
        // overflow-y: visible never clips upward at all.
        //
        // -left-24 (96px) is not bounded by the gap: z-0 here sorts below every card's z-10 in the
        // track's stacking context, so overlapping the neighbour is fine — it goes behind it. Nor is
        // it bounded by track padding; the only crop that applies is .cb-step-clip's, at the true
        // page edge rather than the STAGE's own tighter inset.
        ref={numRef}
        // NO opacity utility for the resting softness — GSAP animates opacity to 1 on entrance and
        // would blow past it. The softness is baked into the fade mask's stops instead (see
        // NumeralDefs.tsx), which leaves element opacity free to mean "arrived or not".
        className="pointer-events-none absolute -left-24 -top-24 z-0 hidden h-[250px] w-[203px] select-none lg:block lg:motion-safe:opacity-0"
      >
        <text
          x="4"
          y="152"
          fontSize="195"
          fontWeight="700"
          fill="none"
          stroke={`url(#${strokeId})`}
          strokeWidth="2.5"
          mask={`url(#${maskId})`}
          // --font-head (Space Grotesk), matching the card titles and section headings. NOT
          // --font-display, which is the SF Pro/Inter body stack — the numeral is display type and
          // should be cut from the same font as the headings it sits behind.
          style={{ fontFamily: 'var(--font-head)' }}
        >
          {i + 1}
        </text>
      </svg>

      {/* z-10 puts every card above every numeral, including its neighbours'. h-full so a stretched
          flex cell still passes its height through to the article. */}
      <div ref={liftRef} className="relative z-10 h-full lg:motion-safe:opacity-0">
        <article className="flex h-full flex-col overflow-hidden rounded-credits border border-divider bg-white shadow-float transition-transform duration-base ease-out-bai hover:-translate-y-1.5">
          <MediaPanel step={step} i={i} />

          {/* No reserved min-heights on the title or body. There were, briefly, to guarantee the
              bodies started at the same y — but a 2-line floor under a 1-line title showed up as a
              dead gap between title and body, which is worse than the raggedness it was insuring
              against. The copy carries it instead: every body on a page is written to within ~10
              characters of its siblings, so they wrap to the same line count on their own. */}
          <div className="p-8">
            {/* The only thing announcing sequence to a screen reader — the numeral is decorative and
                the left-to-right order isn't spoken. */}
            <span className="sr-only">
              Step {i + 1} of {total}
            </span>
            {/* leading-[1.15] rather than a `.cb-scope h3` rule: the 28px `2xl` token ships 1.05,
                which crowds a 2-line card title, but a scope-wide h3 rule would also retune the
                signed-off platform cards' 17px h3s. */}
            <h3 className="font-head text-2xl font-bold leading-[1.15] text-ink-display">{step.title}</h3>
            <p className="bai-body-lg mt-3 text-ink-body-2">{step.body}</p>
          </div>
        </article>
      </div>
    </div>
  )
}

/**
 * The card's media panel, in whichever of its two states applies.
 *
 * WITH ART: square, because the source art is square, so `object-cover` fills it exactly and crops
 * nothing. The hairline beneath is what makes the small tone difference between art background and
 * card white read as a panel boundary rather than as an accident. The images are used AS DELIVERED —
 * no background cut, no rescaling, no mask — sitting full-bleed so an image's own near-white
 * background reads as that card's media panel. That's what makes the raw files safe here: an INSET
 * image would put a 242-253 square on a 255 card and show a visible box on the darker ones, which is
 * the seam every previous version of this section was working around.
 *
 * WITHOUT ART: the same square box, the same hairline, filled with a soft brand wash and a single
 * Sparkle. It is a declared pending state (see types.ts), and the important property is that it is
 * exactly the geometry the real art will occupy — so dropping the files in later changes the picture
 * and nothing else about the row. Deliberately NO "artwork pending" label: this is a page the
 * designer and the PM review as a page, and handoff chrome inside the composition would show up in
 * every screenshot of it. The absence of a picture is legible on its own.
 */
function MediaPanel({ step, i }: { step: Step; i: number }) {
  if (!step.img) {
    return (
      <div
        className="relative flex aspect-square w-full items-center justify-center border-b border-divider bg-surface"
        aria-hidden="true"
      >
        {/* Accent→cyan at wash strength (was iris→cyan until 2026-08-13, when iris stopped being a
            UI colour on this route). Strong enough to read as a
            deliberate panel, quiet enough that it never competes with the card's own copy. */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(var(--cb-accent-rgb),0.07),rgba(var(--bai-cyan-rgb),0.04))]" />
        <Sparkle size={30} className="relative text-[var(--cb-accent)] opacity-25" />
      </div>
    )
  }

  return (
    <div className="relative aspect-square w-full border-b border-divider">
      <Image
        src={step.img}
        alt={step.alt ?? ''}
        fill
        // 90vw was wrong: the real rendered width is min(100vw - 48px, 440px). And priority is GONE —
        // it preloaded a card that sits two or three screens below the fold on a phone, competing with
        // the hero that actually needed it.
        sizes="(min-width: 536px) 440px, calc(100vw - 48px)"
        className="object-cover"
      />
    </div>
  )
}
