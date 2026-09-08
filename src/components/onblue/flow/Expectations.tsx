'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useCrx } from './CrxState'
import { CARD_FONT, CARD_WIDTH, CTA, CTA_SHADOW, RING, SKIN } from './signinSkin'
import BandGrid from '../BandGrid'
import { PHONE_SLIDE, SLIDES, type Slide } from './expectationSlides'

// LEVEL 1 OF THE SIGN-IN DIALOG — the three things you are agreeing to, before anyone types an
// email. Shown to applicants only; the "Sign in" door for returning accounts skips it.
//
// WHAT THIS IS FOR, AND WHAT IT IS NOT. The homepage's four cards explain what HAPPENS. This has a
// different job: what you are AGREEING TO — the three constraints people misread and then drop out
// over. It is not a form either: the application already asks the qualifying questions, and ticking
// them here too would be friction dressed as diligence.
//
// A CAROUSEL, NOT A LIST (Appy, 2026-09-08: "three cards... timed carousel"). Three points stacked
// as rows are read as one block and skimmed as one; one at a time, each with its own illustration,
// they are read as three. The cost is that a reader must wait or click for points two and three,
// which is why the dwell is generous, the dots are real controls, and the CTA never depends on
// having seen all three — the acknowledgement stays passive.
//
// THE PARENT OWNS EVERYTHING THAT DOES NOT CHANGE: the close control, the grid, the dots, the CTA
// and the sign-in line all sit outside the moving part. Only the card slides.

const DWELL = 8000

export default function Expectations({
  onContinue,
  onSignIn,
  onClose,
  enter,
}: {
  onContinue: () => void
  /** "Already have an account? Sign in" — jumps to level 2 as a returning account. */
  onSignIn: () => void
  onClose: () => void
  /** 'back' when reached from level 2's Back link, so it slides in from the left. */
  enter?: 'back'
}) {
  const { theme } = useCrx()
  const skin = SKIN[theme]

  const [i, setI] = useState(0)
  // Set once a dot or the arrow is used. A reader who took the wheel does not get it taken back —
  // an auto-advance that resumes after a manual choice moves the card out from under them.
  const [held, setHeld] = useState(false)
  const [phone, setPhone] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setPhone(/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent))
  }, [])

  // IT DOES NOT PAUSE ON HOVER, and that is a correction, not an omission (Appy, 2026-09-08: "they
  // are not moving towards the next item by itself"). A hover pause is the obvious kindness and it
  // was wrong here for a reason worth keeping: this card opens under the pointer that clicked
  // "Apply now", so the pause fired on the first frame and the carousel never advanced once. A
  // pause condition that is true by default is a stopped carousel. 8s instead of 5 is what buys
  // back the reading time the pause was meant to protect.
  //
  // IT LOOPS (Appy, 2026-09-08: "once the carousel is over... it should go back to the first one").
  // This shipped stopping at the last card, on the argument that a screen you read once should
  // settle rather than keep asking for attention. Reversed, and the reason it was wrong is worth
  // keeping: this dialog is not a page you scroll past — it sits and waits for you to press a
  // button, so a carousel frozen on card three is not "settled", it is a control that has visibly
  // stopped working while you are still looking at it.
  useEffect(() => {
    if (held || reduced.current) return
    const t = window.setTimeout(() => setI((n) => (n + 1) % SLIDES.length), DWELL)
    return () => window.clearTimeout(t)
  }, [i, held])

  const go = useCallback((n: number) => {
    setHeld(true)
    setI(n)
  }, [])

  // Same wrap as the timer, for the same reason — and so the two never disagree about what comes
  // after card three.
  const next = useCallback(() => {
    setHeld(true)
    setI((n) => (n + 1) % SLIDES.length)
  }, [])

  const slides: Slide[] = phone ? [PHONE_SLIDE, SLIDES[1], SLIDES[2]] : [...SLIDES]

  return (
    <div
      style={{ background: skin.card, color: skin.ink, border: `0.8px solid ${RING}`, fontFamily: CARD_FONT }}
      className={`crx-xp relative flex w-full ${CARD_WIDTH} flex-col overflow-hidden rounded-[12px] ${enter === 'back' ? 'crx-step-back' : ''}`}
    >
      {/* THE GRID, top and bottom, the closer's own (Appy, 2026-09-08). Same fans, no shine — the
          travelling wave belongs to a full-width band you scroll past; behind 40 words of dialog
          copy it competes with the thing it frames. Its own idPrefix because the closer's grid is
          on the page behind this one, and two grids sharing mask ids break as soon as their sizes
          differ. Colour comes from .crx-xp-grid in onblue.css. */}
      <BandGrid idPrefix="crxXp" className="crx-xp-grid" />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
        style={{ color: skin.ink40 }}
        onMouseEnter={(e) => { e.currentTarget.style.color = skin.ink }}
        onMouseLeave={(e) => { e.currentTarget.style.color = skin.ink40 }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="relative z-10 flex flex-col gap-5 px-7 pb-7 pt-14">
        {/* THE SLIDES ARE STACKED IN ONE GRID CELL, all three always rendered. That is what keeps
            the card from resizing as it advances: the container is as tall as the TALLEST slide, so
            no magic min-height has to be guessed and none goes stale when the copy changes.
            aria-live announces the change for a screen reader, since the visible swap is silent. */}
        <div className="crx-xp-stage" aria-live="polite">
          {slides.map((s, n) => {
            const Art = s.art
            const on = n === i
            return (
              <div key={s.key} className={`crx-xp-slide ${on ? 'on' : ''}`} aria-hidden={!on}>
                <span className="crx-xp-icon" style={{ background: skin.wash, color: skin.accent }}>
                  <Art />
                </span>
                <h3 className="mt-4 text-[17px] font-semibold leading-[24px]">{s.title}</h3>
                <p className="mt-1.5 text-[14px] leading-[21px]" style={{ color: skin.ink70 }}>{s.body}</p>
              </div>
            )
          })}
        </div>

        {/* The dots are CONTROLS, not decoration — they were two inert pips on the version before
            this and got deleted for exactly that reason. Real buttons, real labels, and clicking
            one takes the wheel for good. */}
        {/* A group of plain buttons, NOT a tablist: role="tab" is a promise of a tabpanel to point
            at, and the slides are one aria-live region rather than three panels. A half-applied tab
            pattern navigates worse than no pattern. */}
        <div className="crx-xp-dots" role="group" aria-label="Which point is showing">
          {slides.map((s, n) => (
            <button
              key={s.key}
              type="button"
              aria-current={n === i}
              aria-label={`Point ${n + 1} of ${slides.length}`}
              onClick={() => go(n)}
              className={`crx-xp-dot ${n === i ? 'on' : ''}`}
              style={{ background: n === i ? skin.accent : skin.rule }}
            />
          ))}

          {/* THE ARROW SITS IN THE DOT RAIL, after the dots (Appy, 2026-09-08) — the rail is where
              "where am I / where next" already lives, so the control that answers the second half
              belongs beside the thing that answers the first. The whole rail centres as one group
              rather than centring the dots and pinning the arrow to the edge: an arrow parked in the
              corner reads as page chrome, not as this carousel's own next. */}
          <button
            type="button"
            onClick={next}
            aria-label="Next point"
            className="crx-xp-next"
            style={{ color: skin.ink40 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = skin.accent }}
            onMouseLeave={(e) => { e.currentTarget.style.color = skin.ink40 }}
          >
            {/* THE VIEWBOX IS CROPPED TO THE INK, stroke included, so the svg box IS the chevron
                with no built-in left padding. That is what lets the rail space evenly: a chevron
                centred in a square box carries ~11px of empty box on its left, which reads as a
                gap nobody wrote and cannot be tuned away with the flex gap. */}
            <svg viewBox="7.9 3.9 9.2 16.2" width="6.8" height="12" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* NEVER GATED ON HAVING SEEN ALL THREE. The acknowledgement is passive by design, and a
            button that waits for a carousel is a button that punishes you for reading fast. */}
        <button
          type="button"
          onClick={onContinue}
          className="flex h-[44px] w-full items-center justify-center rounded-pill px-6 text-[15px] font-bold leading-[21px] transition-[transform,box-shadow] duration-base ease-out-bai hover:-translate-y-0.5 active:translate-y-0"
          style={{ background: CTA, color: '#fff', boxShadow: CTA_SHADOW }}
        >
          Got it, continue
        </button>

        <p className="text-center text-[12px] leading-[18px]" style={{ color: skin.ink40 }}>
          Already have an account?{' '}
          <button type="button" onClick={onSignIn} className="underline underline-offset-2" style={{ color: skin.ink70 }}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
