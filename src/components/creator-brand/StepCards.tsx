'use client'

import { useEffect, useId, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export type Step = {
  n: string
  title: string
  body: string
  img: string
  alt: string
}

type Props = {
  /** The section heading — same shape as the other sections: a plain line plus a
   *  text-gradient italic span on the key phrase. */
  heading: React.ReactNode
  steps: Step[]
}

const RISE = 56 // px each card travels while fading in
const IN = 0.6 // entrance duration; plays at its own speed, NOT tied to scroll
const OUT = 0.4 // scrolling back up is a little quicker
const SHIFT = 0.7 // how long the row takes to slide sideways to make room
const SEG_VH = 55 // scroll distance per beat — one for the title, one per card

/**
 * The steps as a row of large cards, revealed one at a time over a pinned title.
 *
 * The beat structure: the title arrives alone and holds; then card 1 lands on top of it, then
 * card 2, then card 3, each ACCUMULATING rather than replacing the last, and the title fades
 * out across that span so it's gone by the time the third card is in.
 *
 * HORIZONTAL SHIFT. Cards are a fixed width (see .cb-step-track), so a 4-up page's cards are
 * the same size as a 3-up page's rather than being squeezed to fit — which means the brands
 * track can be wider than the STAGE it sits in (.cb-step-viewport, pinned to a fixed 3-card
 * width so both pages' card 1 starts at the same x — see that class for the bug this is fixing).
 * When a card lands off-stage right, the row slides left far enough to bring it in, and the
 * card's own entrance is delayed until that slide is mostly done, so you see the row make room
 * and THEN the card arrive. The shift is derived from measured geometry, not from the step
 * count, so it is 0 whenever the row already fits, and needs no per-page config — that used to
 * mean "every creators width", full stop, but is now "every creators width above ~1900px": see
 * .cb-step-viewport's min() for why the stage is sometimes narrower than a full 3-card row,
 * which is when creators can shift too. Nothing here special-cases either page; it's the same
 * measurement either way.
 *
 * This is the pinned mechanism the earlier sequencer used, minus the thing that made that one
 * fragile. There, each beat REPLACED the previous one, so every transition was a handover
 * between two moving frames — which is where the pinType jitter, the `anticipatePin` entry
 * jump, the snap-vs-threshold tuning and the "two steps on screen after a fast gesture" race
 * all lived. Here nothing hands over: a card's target state is a pure function of how far
 * you've scrolled, cards never leave once shown, and the title is a scrubbed opacity with no
 * movement at all. A fast gesture can't strand anything, because there is no intermediate
 * state to strand.
 *
 * Pinning is desktop-only and motion-safe-only, via `gsap.matchMedia`. Both branches render
 * the SAME DOM (the title switches from in-flow to absolutely-centred with a `lg:` variant,
 * and the track switches from a column to a row in CSS), so there's no `isPinned` state and no
 * first-paint flash of a different layout. The cards' hidden start state is
 * `lg:motion-safe:opacity-0`, matching the matchMedia query exactly — so wherever the script
 * does NOT run, the cards are simply visible rather than permanently invisible.
 *
 * The images are used AS DELIVERED — no background cut, no rescaling, no mask. They sit
 * full-bleed at the top of each card, so an image's own near-white background reads as that
 * card's media panel. That's what makes the raw files safe here: an INSET image would put a
 * 242-253 square on a 255 card and show a visible box on the darker ones, which is the seam
 * every previous version of this section was working around.
 */
export default function StepCards({ heading, steps }: Props) {
  const pinRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // Three arrays, because the cell that defines GEOMETRY is no longer the element that gets
  // ANIMATED. See the stacking note in the markup: the cell has to stay free of opacity and
  // transform, so the entrance is driven on the numeral and the card-lift separately.
  const cellRefs = useRef<(HTMLElement | null)[]>([])
  const numRefs = useRef<(SVGSVGElement | null)[]>([])
  const liftRefs = useRef<(HTMLElement | null)[]>([])

  // One defs block per instance, so two StepCards on a page can't collide on ids.
  const uid = useId().replace(/:/g, '')
  const strokeId = `cbnum-stroke-${uid}`
  const fadeId = `cbnum-fade-${uid}`
  const maskId = `cbnum-mask-${uid}`

  useEffect(() => {
    const pin = pinRef.current
    const title = titleRef.current
    const track = trackRef.current
    if (!pin || !title || !track) return

    const n = steps.length
    const segments = n + 1 // the title's own beat, then one per card

    // The title is fully gone by the time the THIRD card lands — or by the last card, on a
    // page with fewer than three. Expressed against the beat grid so it stays correct for both
    // the 3-step and 4-step pages.
    const fadeFrom = 1 / segments
    const fadeTo = Math.min(3, n) / segments

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const cells = cellRefs.current.filter(Boolean) as HTMLElement[]
      // What actually animates per card: its numeral and its card-lift, as one group. The cell
      // wrapping them is deliberately left untouched.
      const groups = cells.map((_, i) =>
        [numRefs.current[i], liftRefs.current[i]].filter(Boolean) as Element[],
      )
      // Captured as a non-null const: the helpers below are hoisted function declarations, and
      // TS drops the outer null-narrowing on `track` inside those.
      const trackEl = track
      const viewport = trackEl.parentElement as HTMLElement
      gsap.set(groups.flat(), { opacity: 0, y: RISE })
      gsap.set(title, { opacity: 1 })
      gsap.set(trackEl, { x: 0 })

      const shown = cells.map(() => false)
      let lastShift = 0
      let count = 0

      // How far left the row must sit for the `count`-th card to be fully on screen. Measured,
      // and clamped to the real overflow so the row can never slide past its own last card.
      function shiftFor(c: number) {
        const el = cells[c - 1]
        if (!el) return 0
        const overflow = trackEl.scrollWidth - viewport.clientWidth
        if (overflow <= 0) return 0
        const padRight = parseFloat(getComputedStyle(trackEl).paddingRight) || 0
        const need = el.offsetLeft + el.offsetWidth + padRight - viewport.clientWidth
        return -Math.max(0, Math.min(need, overflow))
      }

      function settle(c: number) {
        count = c
        const shift = shiftFor(c)
        const sliding = shift !== lastShift
        if (sliding) {
          lastShift = shift
          gsap.killTweensOf(trackEl)
          gsap.to(trackEl, { x: shift, duration: SHIFT, ease: 'power2.inOut' })
        }
        groups.forEach((group, i) => {
          const want = i < c
          if (want === shown[i]) return
          shown[i] = want
          gsap.killTweensOf(group)
          gsap.to(group, {
            opacity: want ? 1 : 0,
            y: want ? 0 : RISE,
            duration: want ? IN : OUT,
            ease: want ? 'power2.out' : 'power2.in',
            // Arriving into a row that has to make room waits for the room.
            delay: want && sliding ? SHIFT * 0.55 : 0,
          })
        })
      }

      // The shift is a pixel value derived from viewport width, so it goes stale on resize.
      // Re-derive and re-apply for whatever is currently revealed.
      function reflow() {
        const shift = shiftFor(count)
        lastShift = shift
        gsap.set(trackEl, { x: shift })
      }
      ScrollTrigger.addEventListener('refresh', reflow)

      ScrollTrigger.create({
        trigger: pin,
        start: 'top top',
        end: `+=${segments * SEG_VH}%`,
        pin: true,
        // Native fixed pinning (ScrollTrigger's default — no pinType override) and NO
        // anticipatePin. Both were established the hard way on the previous version:
        // transform-pinning re-translates the section every tick and its sub-pixel rounding
        // reads as jitter, and anticipatePin engages the pin early, which shows up as the title
        // snapping into place on entry. See layout.tsx for why fixed pinning works here.
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress
          settle(Math.min(n, Math.floor(p * segments)))
          // Scrubbed, opacity only, no movement — so it tracks the scroll exactly and fades
          // out gradually across the first three cards rather than snapping per beat.
          const t = (p - fadeFrom) / (fadeTo - fadeFrom)
          gsap.set(title, { opacity: 1 - Math.min(1, Math.max(0, t)) })
        },
      })

      return () => {
        ScrollTrigger.removeEventListener('refresh', reflow)
        gsap.set(groups.flat(), { clearProps: 'all' })
        gsap.set([title, trackEl], { clearProps: 'all' })
      }
    })

    return () => mm.revert()
  }, [steps.length])

  return (
    <div ref={pinRef} className="relative py-20 lg:flex lg:min-h-screen lg:items-center lg:py-0">
      <div
        ref={titleRef}
        className="flex min-h-[46vh] items-center justify-center px-6 text-center lg:absolute lg:inset-0 lg:min-h-0"
      >
        {/* Hero scale (5xl/6xl), not section scale — it owns a screen to itself before the
            cards arrive, the way it did as the sequencer's opening beat.

            26ch, not 22ch. A `ch` box holds roughly 1.2x its value in average characters, so
            22ch held ~26 — and the brands heading's first clause ("No PR team. No negotiating.")
            is 27, which wrapped it and made that heading three lines. 26ch holds ~31, clearing
            the longest first clause on either page. */}
        <h2 className="mx-auto max-w-[26ch] font-head text-5xl font-bold text-ink-display sm:text-6xl">
          {heading}
        </h2>
      </div>

      {/* Gradient + fade defs, once.

          The FADE mask (fadeId/maskId) is deliberately NOT objectBoundingBox — that was tried
          first and was the actual cause of "1" looking cropped/incomplete while 2/3/4 looked
          fine. objectBoundingBox re-stretches the fade to fit EACH digit's own glyph bbox, and
          text x="4" is identical for every digit, but "1"'s bbox is only 88 units wide against
          124 for "4" — so the SAME absolute stroke position lands at a HIGHER fraction-of-its-
          own-width for the narrow digit than the wide one, meaning "1" fades faster for
          identical ink. Measured: at 40 units in from the left, that's x_frac 0.45 for "1" but
          only 0.32 for "4" — "1"'s actual vertical stroke was landing deep enough into the
          falloff (gone by 68%) to read as mostly gone below its top few pixels, while "3"/"4"'s
          wider strokes stayed in the bright zone. Not a per-digit tuning problem — a fraction
          computed against a different denominator per glyph can't give the same digit the same
          treatment twice, let alone match it across four different ones.

          Fixed by mapping the fade to the SVG's own fixed 150x185 canvas (userSpaceOnUse)
          instead of each glyph's bbox — one absolute coordinate space, shared by every digit,
          so the same physical stroke position gets the same alpha regardless of which number
          it belongs to. The STROKE gradient (strokeId) was never affected by this — it paints
          via the element's own paint server reference, not a mask, so it was never subject to
          bbox rescaling in the first place. */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          {/* Matches --bai-gradient exactly: to bottom right, iris 0% -> cyan 99%. */}
          <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: 'rgb(var(--bai-iris-rgb))' }} />
            <stop offset="99%" style={{ stopColor: 'rgb(var(--bai-cyan-rgb))' }} />
          </linearGradient>
          {/* Fades toward bottom-right — i.e. INTO the card, which is the direction the card
              covers it from. gradientUnits left at its default (objectBoundingBox) is correct
              HERE: this gradient paints the mask's own <rect> below, which is now a FIXED
              150x185 box, identical for every digit — so "resolves against its own box" means
              the same absolute box every time, which is the whole fix from the mask itself. */}
          {/* Peak alpha is 0.7, not 1: this mask carries the numeral's RESTING softness as well
              as its directional fade, because element opacity is reserved for the entrance
              animation (GSAP drives it 0 -> 1, so a CSS opacity for softness would be
              overwritten). Raise the 0.7 to make the numerals bolder.
              The falloff is deliberately front-loaded — 0.7 -> 0.22 by 32% and gone by 68%,
              rather than a straight ramp to 100%. That concentrates the ink in the corner that
              is actually exposed and makes the dissolve INTO the card much more pronounced;
              a linear ramp left too much weight sitting under the card where it can't be seen
              but still reads through the top edge. Pull the middle stop's offset in to fade
              harder, push it out to fade more gently.

              A "100% -> 0.1" floor (never true transparent) was tried here briefly, on the
              theory that "1" reading as cropped was the fade erasing too much of its sparse
              ink. It was a real, measurable difference in isolation — but wrong: the actual
              cause was where .cb-step-clip drew its crop boundary, not this gradient at all.
              Reverted; see that class for the real fix. Left as a note so the same theory
              doesn't get retried. */}
          <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="32%" stopColor="#fff" stopOpacity="0.22" />
            <stop offset="68%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {/* x/y/width/height match the numeral <svg>'s own viewBox exactly (see the numeral
              below) — this IS the fixed coordinate space every digit now shares. Re-derive
              these four numbers together if the viewBox ever changes; they're duplicated here
              because SVG has no way for a <mask> to read another element's viewBox. */}
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="150" height="185">
            <rect x="0" y="0" width="150" height="185" fill={`url(#${fadeId})`} />
          </mask>
        </defs>
      </svg>

      {/* TWO nested boxes, and the split is load-bearing:
            .cb-step-clip     full-bleed, owns the overflow — so the ONLY thing that can crop a
                              sliding card is the page's own edge, never the stage's own inset
            .cb-step-viewport the STAGE — caps its own width at exactly a 3-card span and
                              centres THAT, not whatever the actual (3- or 4-card) track
                              measures, which is what makes card 1 land at the same x-position
                              on both pages; crops nothing itself any more
          Collapsing these into one element (as this was originally written) is what caused
          "card 1 clipped from the left": with the crop on the SAME element that also insets the
          stage from the page (~140px), an outgoing card got guillotined mid-page, with ordinary
          page background sitting to the left of the cut — the crop landed at the stage's own
          edge, not the page's. See .cb-step-viewport in the CSS for the full account, including
          two earlier wrong turns (widening a clip-margin, then blaming the fade mask) before
          landing on relocating the boundary itself.

          .cb-step-clip is also horizontal-clip-only, for the SAME reason as before: the
          numerals hang ~96px ABOVE their cards, and clipping that vertically too would cut the
          one thing the hang exists to show. No scrollbar and nothing the user can drag out of
          sync, either — it just crops at the page edge instead of dragging one open.

          translate-y-10 is OPTICAL centring, and it is measured rather than eyeballed. The pin
          centres this box geometrically and does it correctly — the track lands at offsetTop
          147 in a 958px pinned box, i.e. exactly (958 - 663) / 2. But the numerals are absolutely
          positioned, so they contribute no height while contributing plenty of visible mass:
          each digit's top edge sits 80px above its card (96px offset less the 16px of slack
          between the SVG's top and the glyph's cap). That puts the composition's real visual
          centre 40px above the viewport's, which reads as top-aligned. Shifting down by half the
          overhang re-centres the mass.

          It goes on THIS element, not the track: GSAP owns the track's transform for the
          horizontal shift and an inline transform would overwrite a Tailwind translate class.
          Re-derive the 40px if the numeral's -top or size changes. */}
      <div className="cb-step-clip relative z-10 w-full lg:translate-y-10">
        <div className="cb-step-viewport">
        <div
          ref={trackRef}
          // NO mx-auto — the track is flush against the STAGE's left edge (.cb-step-viewport),
          // not self-centred. Self-centring is exactly the bug this replaced: a 4-card track is
          // wider than the stage, and centring a wider box on itself pushes its start negative.
          // Flush-left means card 1 always starts at the same x on both pages; any extra width
          // (brands' 4th card) simply overflows the stage to the right, where the shift reveals
          // it. Creators' own row doesn't visually change — its 3-card content already equals
          // the stage's width, so flush-left and self-centred land in the same place for it.
          //
          // Padding here is otherwise just breathing room — it doesn't have to reserve space
          // for the numerals in EITHER axis. The top hang is covered by .cb-step-clip's
          // overflow-y: visible; the left hang needs no covering at all any more, because the
          // crop boundary that matters is now the PAGE edge (.cb-step-clip is full-bleed), and
          // at rest the leftmost numeral sits ~76px inside it — comfortably clear on its own.
          // Reserving real padding for either hang instead would have cost ~144px horizontally
          // (forcing ~40px narrower cards at 1280) and ~224px vertically (in a block the pin has
          // to fit in one viewport).
          className="cb-step-track relative flex w-full px-6 py-6 lg:w-max lg:px-8 lg:py-8"
        >
          {steps.map((s, i) => (
            // THREE nested elements, and the nesting is what makes the numerals able to hang
            // arbitrarily far left. Two separate constraints force it:
            //
            //  1. STACKING. This cell must carry NO opacity and NO transform. Either one makes
            //     it a stacking context, which traps its children's z-index inside it — and
            //     since sibling cells then paint in DOM order, card 2's numeral would paint on
            //     top of card 1's card. Keeping the cell plain leaves every numeral (z-0) and
            //     every card-lift (z-10) in the TRACK's stacking context, so all numerals sort
            //     below all cards globally and a numeral can overlap its neighbour safely.
            //     That is why the entrance animates the numeral and the lift, not this cell.
            //  2. TRANSFORM COLLISION. GSAP writes `transform` inline, and an inline transform
            //     beats Tailwind's `hover:-translate-y` class outright — so the scripted move
            //     and the hover move cannot live on the same element. The lift div owns the
            //     scripted one, the article owns the hover one.
            <div
              key={s.n}
              ref={(el) => {
                cellRefs.current[i] = el
              }}
              className="cb-step-card relative"
            >
              {/* Oversized numeral BEHIND the card, hanging past its top-left corner.
                  Gradient OUTLINE rather than a flat grey fill: at 7% grey the exposed sliver
                  was invisible, and simply raising the grey's opacity would have read as a
                  smudge. An outline in the brand gradient is legible at low weight because the
                  eye picks up the contour, not the mass.

                  SVG rather than CSS, because there is no reliable way to stroke text with a
                  gradient in CSS — `-webkit-text-stroke` takes a solid colour only, and
                  `background-clip: text` fills the glyph rather than outlining it. SVG also
                  gets the directional fade for free via a mask.

                  Plain "1", not step.n's "01" — at this size a leading zero reads as a second
                  glyph competing with the first rather than as a step label. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 150 185"
                // hidden below lg: the stacked mobile layout has no gutter for a numeral to
                // hang into, so it would only ever be clipped. It's decorative, so it goes.
                //
                // Geometry, so it can be re-derived rather than re-guessed: the viewBox is
                // 150x185 rendered at 203x250, i.e. scaled 1.35. The digit's cap height is
                // ~0.72em = 140 units, sitting on the y=152 baseline, so its top edge is 12
                // units (16px) below the SVG's own top. At -top-24 (96px) that leaves ~80px of
                // digit above the card, visible because .cb-step-clip's overflow-y: visible
                // never clips upward at all.
                //
                // -left-24 (96px) is no longer bounded by the gap: z-0 here sorts below every
                // card's z-10 in the track's stacking context, so overlapping the neighbour is
                // fine — it goes behind it. Nor is it bounded by track padding; the only crop
                // that applies is .cb-step-clip's, at the true page edge rather than the STAGE's
                // own tighter inset — so this numeral is visible for exactly as long as its own
                // card genuinely is, and only clipped once it has actually scrolled off-page,
                // same as any carousel item would be. See .cb-step-viewport in the CSS for why
                // the boundary living there instead was the actual bug.
                ref={(el) => {
                  numRefs.current[i] = el
                }}
                // NO opacity utility for the resting softness — GSAP animates opacity to 1 on
                // entrance and would blow past it. The softness is baked into the fade mask's
                // stops instead, which leaves element opacity free to mean "arrived or not".
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
                  // --font-head (Space Grotesk), matching the card titles and section
                  // headings. NOT --font-display, which is the SF Pro/Inter body stack — the
                  // numeral is display type and should be cut from the same font as the
                  // headings it sits behind.
                  style={{ fontFamily: 'var(--font-head)' }}
                >
                  {i + 1}
                </text>
              </svg>

              {/* z-10 puts every card above every numeral, including its neighbours'. h-full so
                  a stretched grid/flex cell still passes its height through to the article. */}
              <div
                ref={(el) => {
                  liftRefs.current[i] = el
                }}
                className="relative z-10 h-full lg:motion-safe:opacity-0"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-credits border border-divider bg-white shadow-float transition-transform duration-base ease-out-bai hover:-translate-y-1.5">
                {/* Square panel because the source art is square, so `object-cover` fills it
                    exactly and crops nothing. The hairline beneath is what makes the small
                    tone difference between art background and card white read as a panel
                    boundary rather than as an accident. */}
                <div className="relative aspect-square w-full border-b border-divider">
                  <Image
                    src={s.img}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 1024px) 440px, 90vw"
                    priority={i === 0}
                    className="object-cover"
                  />
                </div>

                {/* No reserved min-heights on the title or body. There were, briefly, to
                    guarantee the bodies started at the same y — but a 2-line floor under a
                    1-line title showed up as a dead gap between title and body, which is worse
                    than the raggedness it was insuring against. The copy carries it instead:
                    every body on a page is written to within ~10 characters of its siblings,
                    so they wrap to the same line count on their own. */}
                <div className="p-8">
                  {/* The only thing announcing sequence to a screen reader — the numeral is
                      decorative and the left-to-right order isn't spoken. */}
                  <span className="sr-only">
                    Step {i + 1} of {steps.length}
                  </span>
                  {/* leading-[1.15] rather than a `.cb-scope h3` rule: the 28px `2xl` token
                      ships 1.05, which crowds a 2-line card title, but a scope-wide h3 rule
                      would also retune the signed-off platform cards' 17px h3s. */}
                  <h3 className="font-head text-2xl font-bold leading-[1.15] text-ink-display">{s.title}</h3>
                  <p className="bai-body-lg mt-3 text-ink-body-2">{s.body}</p>
                </div>
                </article>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}
