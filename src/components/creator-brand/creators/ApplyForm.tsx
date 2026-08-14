'use client'

import { useState } from 'react'
import { Arrow } from '@/components/Arrow'
import { StepIntro, StepOne, StepTwo, StepThree, StepFour } from './apply/Steps'
import Milestones from './apply/Milestones'
import { INITIAL, STEPS, STEP_FIELDS, validate, type Draft } from './apply/spec'
import type { Errors } from '../forms'
import CTABand from '../CTABand'
import { useApply } from './ApplyState'

// The creator application. Eleven questions across five steps — the first of which (StepIntro) asks
// nothing at all, it's the "About the program" summary on its own screen. The flow lives here, the
// questions and their rules live in apply/spec.ts, the fields themselves in apply/Steps.tsx.
//
// SAME MACHINERY AS THE BRANDS CAMPAIGN FORM, deliberately: per-step validation, errors that only
// appear once touched or once a submit has forced them, a never-disabled submit that reveals the
// reason instead of refusing silently, and a right-aligned progress rail riding the step-title row.
// The PM asked for this form to be "served in a similar way we serve the campaign form" — matching
// the mechanics is most of what that means, and it also stops the two forms from disagreeing about
// what an invalid field looks like on the same site.
//
// WHAT IS DIFFERENT: this one is NOT in a dialog. It sits inline at the top of the page once you're
// signed in (ApplySection.tsx), so it owns its own card, its own header and its own submitted state
// rather than being handed a panel by Modal.tsx. That is the designer's architecture — signing in
// replaces the marketing hero with the application, so the form IS the top of the page and putting it
// behind another click would bury the thing you just signed in to do.
const LAST = STEPS.length - 1

export default function ApplyForm() {
  const { account } = useApply()
  const [step, setStep] = useState(0)
  // The one pre-filled answer, and it comes from the signed-in account rather than from INITIAL —
  // spec.ts stays a pure description of an empty application, with no knowledge of who is filling it.
  const [d, setD] = useState<Draft>({ ...INITIAL, email: account.email })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  // Per STEP, not global: forcing step 1's errors open must not pre-redden step 5's email, and
  // returning to a step you already failed should still show what it told you.
  const [forced, setForced] = useState<Record<number, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  const all = validate(d)
  const fields = STEP_FIELDS[step]

  const visible: Errors = {}
  for (const f of fields) {
    if ((touched[f] || forced[step]) && all[f]) visible[f] = all[f]
  }
  const touch = (k: string) => setTouched((p) => ({ ...p, [k]: true }))
  const stepProps = { d, setD, err: visible, touch }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (fields.some((f) => all[f])) {
      setForced((p) => ({ ...p, [step]: true }))
      return
    }
    if (step < LAST) {
      // NO AUTO-SCROLL (designer, 2026-08-13) — two scroll targets were tried and removed (the page
      // top, then #apply). Both were compensating for the box below changing size on every step; with
      // one shared min-height across all four steps, the Continue/Submit button stays roughly where it
      // was, so there's nothing left that needs correcting for.
      setStep((s) => s + 1)
      return
    }
    setSubmitted(true)
  }

  // The confirmation is the CTA BAND, matching the campaign form's queued state and the way both
  // journeys already say "you're done" — same mark, same type scale, same dark band. idPrefix is not
  // optional here: the closing ApplyCTA band is on the page at the same time, and CTAGrid's four SVG
  // mask ids would otherwise be declared twice (see CTAGrid.tsx for the bug that caused).
  if (submitted) {
    return (
      <>
        {/* Same strip as above the form, one dot further along — submitting is what moves the reader
            from "Apply" to "We review", and the strip advancing is the visual receipt of that. */}
        <Milestones stage="submitted" />
        <CTABand idPrefix="cbGridApplied">
          {/* SAME SIZE AS THE FORM BEFORE IT (PM, 2026-08-13) — the card was visibly shrinking on submit,
              which reads as content disappearing rather than as a confirmation.
              Matches the step body's floor above (460/400): py-6 top (24) + title/rail row (~26) +
              mt-7 (28) + body (460 mobile / 400 desktop) + mt-7 (28) + buttons (52, one row at both
              breakpoints) + py-6 (24) = 642 mobile, 582 desktop. CTABand's own py-16 is 128px (64 top +
              64 bottom): 642-128=514 mobile, 582-128=454 desktop. flex centring keeps the actual content
              (icon, heading, paragraph) in the middle of the box rather than pinned to its top. */}
          <div className="flex min-h-[514px] flex-col items-center justify-center sm:min-h-[454px]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-circle bg-white/10 ring-1 ring-white/20">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4.5 12.5l5 5L19.5 6.5" />
              </svg>
            </div>
            <h2 className="mt-5 font-head text-3xl font-bold text-white">Thanks for applying.</h2>
            <p className="bai-body-lg mx-auto mt-3 max-w-[44ch] text-white/80">
              We review every application and will email{' '}
              <b className="font-semibold text-white">{d.email}</b> when your spot opens.
            </p>
          </div>
        </CTABand>
      </>
    )
  }

  return (
    <>
      {/* The journey strip sits with the form, not in ApplySection, because `submitted` lives here —
          the strip's whole job is to advance when the form's state does. */}
      <Milestones stage="filling" />
      <div className="overflow-hidden rounded-credits border border-divider bg-white shadow-float">
        {/* noValidate — see CampaignForm. Our inline errors speak, not the browser's bubbles. */}
        <form noValidate onSubmit={submit} className="px-6 py-6 sm:px-8">
          {/* ONE row: the step's title with its progress pinned to the right edge — the shape the
              campaign form's top area was reduced to on 2026-08-11, after running title → subtitle →
              full-width rail → "STEP 2 OF 5" → step-title as five stacked rows of chrome. */}
          <div className="flex items-baseline justify-between gap-4">
            {/* h2 — the only other heading on this page is the section h1, so an h3 skipped a level. */}
            <h2 className="font-head text-[17px] font-semibold text-ink-display">{STEPS[step].title}</h2>
            <Rail step={step} />
          </div>

          {/* ONE STEP MOUNTED AT A TIME (designer, 2026-08-13) — a same-day CSS-grid version stacked all
              steps in one shared cell so the container measured itself against real content instead of a
              guessed number, and it produced exactly the failure that trick risks: a moment where the
              "hidden" steps weren't actually hidden, so two steps' fields rendered on top of each other
              at once. A broken-looking form is a strictly worse failure than one that's a little
              inconsistent in height, so: only the current step's DOM exists, full stop — there is no way
              for two steps to ever occupy the same pixels, CSS bug or not.
              460/400 IS APPY'S NUMBER, NOT A RE-ESTIMATE (2026-08-13) — the generous 520/470 above made
              the card too tall after a hard refresh ruled out stale-build as the explanation for the
              earlier complaint, so this went back to the last values that were sized against real content
              rather than padded defensively. It's the same floor the OLD five-step form used before the
              PC-specs step was cut and the two consent checkboxes became one — those changes only made
              steps shorter, not taller (the one exception, the new agree checkbox, being handled by
              `subtle` now rather than by the floor). If a step overflows this again, that step's content
              is the thing to trim, not this number — it's been raised twice already chasing a step
              instead of the other way round. */}
          <div className="mt-7 min-h-[460px] sm:min-h-[400px]">
            {step === 0 && <StepIntro />}
            {step === 1 && <StepOne {...stepProps} />}
            {step === 2 && <StepTwo {...stepProps} />}
            {step === 3 && <StepThree {...stepProps} />}
            {step === 4 && <StepFour {...stepProps} />}
          </div>

          {/* ONE ROW AT BOTH BREAKPOINTS NOW (designer, 2026-08-13). This used to stack below sm because
              two full-width labels — "Back" and "Submit application" — couldn't both fit one mobile row
              without the longer one wrapping to two lines. Shrinking Back to an icon (below) removes that
              constraint instead of working around it: an icon button plus a flex-1 primary fits one row
              at any width this form ships at, so there's one layout to maintain, not two. */}
          <div className="mt-7 flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                // ICON-ONLY BELOW sm, full label at sm+ (designer, 2026-08-13) — same button, same
                // handler, just what it shows. sr-only/not-sr-only keeps "Back" as the button's real
                // accessible name at every width rather than switching to aria-label, so a screen reader
                // hears the same thing regardless of viewport. Arrow is the site's own right-arrow glyph,
                // reused rotated 180deg rather than drawing a second asset — its own doc comment already
                // names this exact use ("a 'back to top' use that rotates this same glyph").
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-pill border border-stroke-warm bg-white p-3.5 text-[15px] font-semibold text-ink-heading transition-all duration-base ease-out-bai hover:border-ink-heading hover:bg-surface active:scale-[0.98] sm:flex-1 sm:px-5"
              >
                <Arrow size={15} className="rotate-180 sm:hidden" />
                <span className="sr-only sm:not-sr-only">Back</span>
              </button>
            )}
            <button
              type="submit"
              className="flex-1 rounded-pill border border-transparent bg-cta-gradient px-5 py-3.5 text-[15px] font-semibold text-white shadow-cta transition-all duration-base ease-out-bai hover:-translate-y-0.5 hover:shadow-cta-hover"
            >
              {step === LAST ? 'Submit application' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

/**
 * Minimal progress, right-aligned in the step-title row. Segments are clickable BACKWARD only —
 * jumping forward past an incomplete step lands on a step whose own Continue immediately sends you
 * back. The count stays as an sr-only string so the ticks aren't the only way to know where you are.
 *
 * Unfilled segments are --cb-track, NOT bg-canvas: --bai-canvas is pure white, so on a white card a
 * five-segment rail rendered as however-many-are-filled and read as "step 2 of 2".
 */
function Rail({ step }: { step: number }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="cb-tabular text-[11px] font-semibold text-ink-muted">
        {step + 1}/{STEPS.length}
        <span className="sr-only">, step {step + 1} of {STEPS.length}</span>
      </span>
      <span className="flex gap-1">
        {STEPS.map((s, i) => (
          // NOT A BUTTON ANY MORE (mobile pass, 2026-08-13). These were real buttons that jumped back a
          // step, at 4px tall by 16px wide with 4px between them — 9% of the minimum touch height and
          // by a distance the worst target in the codebase. Padding them out to 44px was the obvious
          // fix and the wrong one: it would put five 44px hit zones in the step-title row, which at a
          // 320px card cannot hold the title and the rail on one line.
          // They are indicators now. Backward navigation already has a real, adequately-sized control —
          // the Back button — so this was a duplicate affordance that only existed at an untappable size.
          <span
            key={s.title}
            className={`h-1 w-4 rounded-pill transition-colors duration-slow ease-out-bai ${
              i <= step ? 'bg-bai-gradient' : 'bg-[var(--cb-track)]'
            }`}
          />
        ))}
      </span>
    </div>
  )
}
