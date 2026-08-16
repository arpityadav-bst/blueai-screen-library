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
        {/* px-4 BELOW sm, WAS px-6 (Appy, 2026-08-14) — mobile only; sm and up keep px-8 untouched.
            At 390px the form's content column was 294px: 48px to the section's own px-6 gutter and
            another 48px to this padding. Every question label, chip row and consent line was wrapping
            against that, and wrapping is what makes the mobile box taller than the desktop one in the
            first place (min-h 460 vs 400 below). Trading 16px of card padding back gives the content
            310px, which is the cheapest width available here — see the note on the section's own
            gutter for why the other 48px is NOT the one to take. */}
        <form noValidate onSubmit={submit} className="px-4 py-6 sm:px-8">
          {/* ONE row: the step's title with its progress pinned to the right edge — the shape the
              campaign form's top area was reduced to on 2026-08-11, after running title → subtitle →
              full-width rail → "STEP 2 OF 5" → step-title as five stacked rows of chrome. */}
          {/* gap-3 below sm (gap-4 at sm+) — part of the same one-line-title budget as the h2's own
              mobile size, next comment. */}
          <div className="flex items-baseline justify-between gap-3 sm:gap-4">
            {/* h2 — the only other heading on this page is the section h1, so an h3 skipped a level. */}
            {/* 15px BELOW sm, 17px UNCHANGED AT sm+ (Appy, 2026-08-14). The five step titles are
                different lengths, and this row sits OUTSIDE the fixed 480px step box below — so when
                the longest title ("Payment and contact") wrapped to two lines at mobile width, that
                one card ran ~22px taller than the rest, which Appy confirmed on-device was exactly the
                remaining height mismatch after the box itself was fixed. At 15px the longest title
                fits the ~180px the rail leaves it with margin to spare, so every title is one line and
                every card top is identical. Also consistent with Appy's own earlier read that mobile
                type runs bigger than it needs to. If a future title is added, keep it short enough to
                hold one line at 15px on a 360px viewport — this row's uniformity is what the whole
                fixed-height scheme hangs off. */}
            <h2 className="font-head text-[15px] font-semibold text-ink-display sm:text-[17px]">{STEPS[step].title}</h2>
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
          {/* MOBILE IS AN EXACT HEIGHT NOW, NOT A FLOOR — h-[480px], EXACT, per Appy's explicit brief
              (2026-08-14): "same and under 480px EXACT. nothing more and nothing less." The previous
              two rounds (min-h 460, then 520) kept failing for the same reason: a floor only pads
              SHORT steps up, so any step whose content exceeded the number kept its own height and
              the card still moved between steps. h fixes the box at 480 for every step regardless of
              content; the min-h approach is retired on mobile, not mistuned.
              THE OBLIGATION THIS CREATES: content must FIT 480, because a fixed box doesn't grow — an
              overflowing step would spill over the button row. Step 4 was the only one over (~513px:
              two chip groups wrapping to two rows each + a rows-3 textarea + three error slots), so it
              was trimmed mobile-only to fit — see StepThree's mt-4 sm:mt-7 gaps and Long.tsx's
              two-line mobile cap. Steps 1/2/3/5 were already under 480. If a future edit pushes any
              step past 480 on a ~390px viewport, trim THAT step; the 480 is not the knob.
              THE ONE GAP EXEMPTED from trimming is step 5's PayPal -> long-run mt-5 (Appy, same
              message, with a screenshot) — it stays at 20px on mobile too. Step 5 fits regardless.
              DESKTOP IS FINAL AND UNTOUCHED: sm:h-auto restores content sizing and sm:min-h-[400px]
              keeps the floor exactly as signed off. Nothing below sm leaks upward. */}
          <div className="mt-7 h-[480px] sm:h-auto sm:min-h-[400px]">
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
              at any width this form ships at, so there's one layout to maintain, not two.
              STAYS mt-7 (Appy, 2026-08-14) — briefly tried at mt-5 and put back, because this gap sits
              OUTSIDE the min-height box above and is therefore measured from the FLOOR, not from the
              last field. That makes it identical on all five steps, so changing it cannot bring step 5
              closer to the others — it only moves every button row together, i.e. it changes the card
              height Appy wanted preserved while leaving the actual mismatch untouched. Step 5 is
              equalised by its OWN internal gaps instead (see StepFour). Making this one step-dependent
              would work arithmetically only at a NEGATIVE value, so it isn't an option either. */}
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
          // w-3 below sm (w-4 unchanged at sm+) — 5px handed to the title so the longest one holds a
          // single line at mobile width; see the h2's own comment for the full budget.
          <span
            key={s.title}
            className={`h-1 w-3 rounded-pill transition-colors duration-slow ease-out-bai sm:w-4 ${
              i <= step ? 'bg-bai-gradient' : 'bg-[var(--cb-track)]'
            }`}
          />
        ))}
      </span>
    </div>
  )
}
