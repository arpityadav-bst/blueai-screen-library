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

const DWELL = 5000

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
  // Set once a dot is clicked. A reader who took the wheel does not get it taken back — an
  // auto-advance that resumes after a manual choice moves the card out from under them.
  const [held, setHeld] = useState(false)
  const [paused, setPaused] = useState(false)
  const [phone, setPhone] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setPhone(/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent))
  }, [])

  // AUTO-ADVANCE STOPS AT THE LAST SLIDE rather than looping. This is a thing to read once, not a
  // billboard: cycling back to point one implies there is more to see and quietly asks the reader
  // to keep watching instead of pressing the button.
  useEffect(() => {
    if (held || paused || reduced.current || i >= SLIDES.length - 1) return
    const t = window.setTimeout(() => setI((n) => n + 1), DWELL)
    return () => window.clearTimeout(t)
  }, [i, held, paused])

  const go = useCallback((n: number) => {
    setHeld(true)
    setI(n)
  }, [])

  const slides: Slide[] = phone ? [PHONE_SLIDE, SLIDES[1], SLIDES[2]] : [...SLIDES]

  return (
    <div
      style={{ background: skin.card, color: skin.ink, border: `0.8px solid ${RING}`, fontFamily: CARD_FONT }}
      className={`crx-xp relative flex w-full ${CARD_WIDTH} flex-col overflow-hidden rounded-[12px] ${enter === 'back' ? 'crx-step-back' : ''}`}
      // Pause while the pointer is over the card or focus is inside it: someone reading point one
      // slowly, or tabbing to a dot, should not have it replaced mid-sentence.
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
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
