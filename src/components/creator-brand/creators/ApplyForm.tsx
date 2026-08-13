'use client'

import { useState } from 'react'
import { StepOne, StepTwo, StepThree, StepFour, StepFive } from './apply/Steps'
import { INITIAL, STEPS, STEP_FIELDS, validate, type Draft } from './apply/spec'
import type { Errors } from '../forms'
import CTABand from '../CTABand'
import { useApply } from './ApplyState'

// The creator application. Thirteen questions across five steps — the flow lives here, the questions
// and their rules live in apply/spec.ts, the fields themselves in apply/Steps.tsx.
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
      setStep((s) => s + 1)
      // The form is a tall card in a tall page, so advancing has to bring the new step's first
      // question back into view — otherwise step 4's two long-text boxes leave you looking at the
      // Continue button of a step you have not read.
      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
      <CTABand idPrefix="cbGridApplied">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-circle bg-white/10 ring-1 ring-white/20">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 12.5l5 5L19.5 6.5" />
          </svg>
        </div>
        <h2 className="mt-5 font-head text-3xl font-bold text-white">Thanks for applying.</h2>
        <p className="bai-body-lg mx-auto mt-3 max-w-[44ch] text-white/70">
          We review every application and will email{' '}
          <b className="font-semibold text-white">{d.email}</b> when your spot opens.
        </p>
      </CTABand>
    )
  }

  return (
    <div className="overflow-hidden rounded-credits border border-divider bg-white shadow-float">
      {/* The account row IS the sign-in step made visible. Step 1 of How It Works promises "sign in
          with your now.gg account", and without this the prototype would claim a step it never
          shows. It is not a control — no chevron, no menu — because there is nothing to do with it
          here; signing out is the review-only affordance in PreviewToggler. */}
      <div className="flex items-center gap-3 border-b border-divider bg-surface px-6 py-4 sm:px-8">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-circle bg-bai-gradient text-[12px] font-bold text-white">
          {account.initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-semibold text-ink-heading">{account.name}</span>
          <span className="block truncate text-[11.5px] text-ink-muted">Signed in with now.gg</span>
        </span>
      </div>

      <form onSubmit={submit} className="px-6 py-6 sm:px-8">
        {/* ONE row: the step's title with its progress pinned to the right edge — the shape the
            campaign form's top area was reduced to on 2026-08-11, after running title → subtitle →
            full-width rail → "STEP 2 OF 5" → step-title as five stacked rows of chrome. */}
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-head text-[17px] font-semibold text-ink-display">{STEPS[step].title}</h3>
          <Rail step={step} onJump={setStep} />
        </div>

        {/* Holds the card at roughly the tallest step's height so moving between steps doesn't
            resize it. Taller than the campaign form's 300 because step 4 is two four-row textareas
            plus a chip group. */}
        <div className="mt-5 min-h-[352px]">
          {step === 0 && <StepOne {...stepProps} />}
          {step === 1 && <StepTwo {...stepProps} />}
          {step === 2 && <StepThree {...stepProps} />}
          {step === 3 && <StepFour {...stepProps} />}
          {step === 4 && <StepFive {...stepProps} />}
        </div>

        <div className="mt-7 flex items-center gap-3">
          {/* Same size as the primary, both flex-1, and the primary carries a transparent border so
              the pair matches on BOTH axes — without it the bordered secondary measures ~2px larger
              each way, which reads as sloppy rather than as a difference. */}
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-pill border border-stroke-warm bg-white px-5 py-3.5 text-[15px] font-semibold text-ink-heading transition-all duration-base ease-out-bai hover:border-ink-heading hover:bg-surface active:scale-[0.98]"
            >
              Back
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
function Rail({ step, onJump }: { step: number; onJump: (s: number) => void }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="cb-tabular text-[11px] font-semibold text-ink-muted">
        {step + 1}/{STEPS.length}
        <span className="sr-only"> — step {step + 1} of {STEPS.length}</span>
      </span>
      <span className="flex gap-1">
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-label={`Step ${i + 1}: ${s.title}`}
            aria-current={i === step ? 'step' : undefined}
            disabled={i > step}
            onClick={() => onJump(i)}
            className={`h-1 w-4 rounded-pill transition-colors duration-slow ease-out-bai disabled:cursor-default ${
              i <= step ? 'bg-bai-gradient' : 'bg-[var(--cb-track)]'
            }`}
          />
        ))}
      </span>
    </div>
  )
}
