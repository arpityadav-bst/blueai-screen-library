'use client'

import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NumeralDefs from './stepcards/NumeralDefs'
import StepCell from './stepcards/StepCell'
import type { Step } from './stepcards/types'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

// Re-exported so the two consumers keep their existing `import StepCards, { type Step }` — the type
// itself lives in stepcards/types.ts now, alongside the note about `img` being optional.
export type { Step }

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
 * SPLIT 2026-08-13. This file was 474 lines against the project's 300-line rule, and the creators
 * steps needed changing (three steps to four, plus a pending-art state). The numeral's SVG defs went
 * to stepcards/NumeralDefs.tsx and one card's markup to stepcards/StepCell.tsx; the plan is
 * byte-identical either side of the split for both pages, so it is a pure refactor. What stayed here
 * is the part that is genuinely this component's job: the beat structure and the pinning.
 *
 * The beat structure: the title arrives alone and holds; then card 1 lands on top of it, then card 2,
 * then card 3, each ACCUMULATING rather than replacing the last, and the title fades out across that
 * span so it's gone by the time the third card is in.
 *
 * HORIZONTAL SHIFT. Cards are a fixed width (see .cb-step-track), so a 4-up page's cards are the same
 * size as a 3-up page's rather than being squeezed to fit — which means the track can be wider than
 * the STAGE it sits in (.cb-step-viewport, pinned to a fixed 3-card width so both pages' card 1
 * starts at the same x — see that class for the bug this is fixing). When a card lands off-stage
 * right, the row slides left far enough to bring it in, and the card's own entrance is delayed until
 * that slide is mostly done, so you see the row make room and THEN the card arrive. The shift is
 * derived from measured geometry, not from the step count, so it is 0 whenever the row already fits
 * and needs no per-page config. Nothing here special-cases either page; it is the same measurement
 * either way — which is why the creators page going from three cards to four needed no change to this
 * file at all beyond the split.
 *
 * This is the pinned mechanism the earlier sequencer used, minus the thing that made that one
 * fragile. There, each beat REPLACED the previous one, so every transition was a handover between two
 * moving frames — which is where the pinType jitter, the `anticipatePin` entry jump, the
 * snap-vs-threshold tuning and the "two steps on screen after a fast gesture" race all lived. Here
 * nothing hands over: a card's target state is a pure function of how far you've scrolled, cards
 * never leave once shown, and the title is a scrubbed opacity with no movement at all. A fast gesture
 * can't strand anything, because there is no intermediate state to strand.
 *
 * Pinning is desktop-only and motion-safe-only, via `gsap.matchMedia`. Both branches render the SAME
 * DOM (the title switches from in-flow to absolutely-centred with a `lg:` variant, and the track
 * switches from a column to a row in CSS), so there's no `isPinned` state and no first-paint flash of
 * a different layout. The cards' hidden start state is `lg:motion-safe:opacity-0`, matching the
 * matchMedia query exactly — so wherever the script does NOT run, the cards are simply visible rather
 * than permanently invisible.
 */
export default function StepCards({ heading, steps }: Props) {
  const pinRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // Three arrays, because the cell that defines GEOMETRY is no longer the element that gets ANIMATED.
  // See the stacking note in StepCell.tsx: the cell has to stay free of opacity and transform, so the
  // entrance is driven on the numeral and the card-lift separately.
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

    // The title is fully gone by the time the THIRD card lands — or by the last card, on a page with
    // fewer than three. Expressed against the beat grid so it stays correct for a 3- or 4-step page.
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
      // Captured as a non-null const: the helpers below are hoisted function declarations, and TS
      // drops the outer null-narrowing on `track` inside those.
      const trackEl = track
      const viewport = trackEl.parentElement as HTMLElement
      gsap.set(groups.flat(), { opacity: 0, y: RISE })
      gsap.set(title, { opacity: 1 })
      gsap.set(trackEl, { x: 0 })

      const shown = cells.map(() => false)
      let lastShift = 0
      let count = 0

      // How far left the row must sit for the `count`-th card to be fully on screen. Measured, and
      // clamped to the real overflow so the row can never slide past its own last card.
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

      // The shift is a pixel value derived from viewport width, so it goes stale on resize. Re-derive
      // and re-apply for whatever is currently revealed.
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
        // Native fixed pinning (ScrollTrigger's default — no pinType override) and NO anticipatePin.
        // Both were established the hard way on the previous version: transform-pinning re-translates
        // the section every tick and its sub-pixel rounding reads as jitter, and anticipatePin
        // engages the pin early, which shows up as the title snapping into place on entry. See
        // layout.tsx for why fixed pinning works here.
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress
          settle(Math.min(n, Math.floor(p * segments)))
          // Scrubbed, opacity only, no movement — so it tracks the scroll exactly and fades out
          // gradually across the first three cards rather than snapping per beat.
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
        {/* Hero scale (5xl/6xl), not section scale — it owns a screen to itself before the cards
            arrive, the way it did as the sequencer's opening beat.

            26ch, not 22ch. A `ch` box holds roughly 1.2x its value in average characters, so 22ch held
            ~26 — and the brands heading's first clause ("No PR team. No negotiating.") is 27, which
            wrapped it and made that heading three lines. 26ch holds ~31, clearing the longest first
            clause on either page. */}
        <h2 className="mx-auto max-w-[26ch] font-head text-5xl font-bold text-ink-display sm:text-6xl">
          {heading}
        </h2>
      </div>

      <NumeralDefs strokeId={strokeId} fadeId={fadeId} maskId={maskId} />

      {/* TWO nested boxes, and the split is load-bearing:
            .cb-step-clip     full-bleed, owns the overflow — so the ONLY thing that can crop a
                              sliding card is the page's own edge, never the stage's own inset
            .cb-step-viewport the STAGE — caps its own width at exactly a 3-card span and centres
                              THAT, not whatever the actual (3- or 4-card) track measures, which is
                              what makes card 1 land at the same x-position on both pages; crops
                              nothing itself any more
          Collapsing these into one element (as this was originally written) is what caused "card 1
          clipped from the left": with the crop on the SAME element that also insets the stage from
          the page (~140px), an outgoing card got guillotined mid-page, with ordinary page background
          sitting to the left of the cut — the crop landed at the stage's own edge, not the page's.
          See .cb-step-viewport in the CSS for the full account, including two earlier wrong turns
          (widening a clip-margin, then blaming the fade mask) before landing on relocating the
          boundary itself.

          .cb-step-clip is also horizontal-clip-only, for the SAME reason as before: the numerals hang
          ~96px ABOVE their cards, and clipping that vertically too would cut the one thing the hang
          exists to show. No scrollbar and nothing the user can drag out of sync, either — it just
          crops at the page edge instead of dragging one open.

          translate-y-10 is OPTICAL centring, and it is measured rather than eyeballed. The pin centres
          this box geometrically and does it correctly — the track lands at offsetTop 147 in a 958px
          pinned box, i.e. exactly (958 - 663) / 2. But the numerals are absolutely positioned, so they
          contribute no height while contributing plenty of visible mass: each digit's top edge sits
          80px above its card (96px offset less the 16px of slack between the SVG's top and the
          glyph's cap). That puts the composition's real visual centre 40px above the viewport's, which
          reads as top-aligned. Shifting down by half the overhang re-centres the mass.

          It goes on THIS element, not the track: GSAP owns the track's transform for the horizontal
          shift and an inline transform would overwrite a Tailwind translate class. Re-derive the 40px
          if the numeral's -top or size changes. */}
      <div className="cb-step-clip relative z-10 w-full lg:translate-y-10">
        <div className="cb-step-viewport">
          <div
            ref={trackRef}
            // NO mx-auto — the track is flush against the STAGE's left edge (.cb-step-viewport), not
            // self-centred. Self-centring is exactly the bug this replaced: a 4-card track is wider
            // than the stage, and centring a wider box on itself pushes its start negative.
            // Flush-left means card 1 always starts at the same x on both pages; any extra width
            // simply overflows the stage to the right, where the shift reveals it.
            //
            // Padding here is otherwise just breathing room — it doesn't have to reserve space for
            // the numerals in EITHER axis. The top hang is covered by .cb-step-clip's overflow-y:
            // visible; the left hang needs no covering at all, because the crop boundary that matters
            // is the PAGE edge (.cb-step-clip is full-bleed), and at rest the leftmost numeral sits
            // ~76px inside it. Reserving real padding for either hang instead would have cost ~144px
            // horizontally (forcing ~40px narrower cards at 1280) and ~224px vertically (in a block
            // the pin has to fit in one viewport).
            className="cb-step-track relative flex w-full px-6 py-6 lg:w-max lg:px-8 lg:py-8"
          >
            {steps.map((s, i) => (
              <StepCell
                key={s.n}
                step={s}
                i={i}
                total={steps.length}
                strokeId={strokeId}
                maskId={maskId}
                cellRef={(el) => {
                  cellRefs.current[i] = el
                }}
                numRef={(el) => {
                  numRefs.current[i] = el
                }}
                liftRef={(el) => {
                  liftRefs.current[i] = el
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
