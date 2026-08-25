'use client'

import { useState } from 'react'
import { StepIntro, StepOne, StepTwo, StepThree, StepFour } from './Steps'
import Milestones from './Milestones'
import { INITIAL, STEPS, STEP_FIELDS, validate, type Draft } from './spec'
import type { Errors } from './forms'
import { useCrx } from '../CrxState'
import CtaBand from '../../CtaBand'

// The creator application — flow ported from creator-brand/creators/ApplyForm.tsx. Eleven questions
// across five steps, the first of which (StepIntro) asks nothing at all. The flow lives here, the
// questions and their rules in spec.ts, the fields in Steps.tsx.
//
// SAME MACHINERY AS THE SOURCE, deliberately: per-step validation, errors that only appear once
// touched or once a submit has forced them, a never-disabled submit that reveals the reason instead
// of refusing silently, and a right-aligned progress rail riding the step-title row.
//
// NOT in a dialog: it sits inline at the top of the page once you're signed in (ApplySection.tsx) —
// signing in replaces the marketing hero with the application, so the form IS the top of the page
// and putting it behind another click would bury the thing you just signed in to do.
const LAST = STEPS.length - 1

export default function ApplyForm() {
  const { account } = useCrx()
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
      // NO AUTO-SCROLL (designer, 2026-08-13, source file) — two scroll targets were tried and
      // removed; with one shared min-height across steps the Continue/Submit button stays roughly
      // where it was, so there's nothing left that needs correcting for.
      setStep((s) => s + 1)
      return
    }
    setSubmitted(true)
  }

  // The confirmation — re-imagined as a .crx-panel celebration in THIS page's language (the source
  // used its own dark CTABand, which isn't ported): tick in a mint-soft circle (mint is this page's
  // money/success colour), same heading and email line VERBATIM. The strip above advances one dot —
  // submitting is what moves the reader from "Apply" to "We review", and the strip advancing is the
  // visual receipt of that.
  if (submitted) {
    return (
      <>
        <Milestones stage="submitted" />
        {/* THE HOMEPAGE'S CLOSING-BAND CONTAINER, not a dark .crx-panel (Appy, 2026-08-20: "show
            these in the final CTA container style like homepage"). The two moments the page ends
            on — the closing ask and this confirmation — now share one surface, so finishing the
            application lands you somewhere the page has already taught you to read as an ending.
            .crx-confirm carries the sizing, and it is the SAME class the full-capacity notice uses:
            Appy asked for both containers to be one size, and one shared class is the only version
            of that which cannot drift. */}
        <CtaBand className="dark">
          <div className="crx-confirm">
            <span className="crx-confirm-tick">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4.5 12.5l5 5L19.5 6.5" />
            </svg>
          </span>
            <h2>Thanks for applying.</h2>
            <p>
              We review every application and will email <b>{d.email}</b> when your access is approved.
            </p>
          </div>
        </CtaBand>
      </>
    )
  }

  return (
    <>
      {/* The journey strip sits with the form, not in ApplySection, because `submitted` lives here —
          the strip's whole job is to advance when the form's state does. */}
      <Milestones stage="filling" />
      <div className="crx-panel">
        {/* noValidate — our inline errors speak, not the browser's bubbles. */}
        <form noValidate onSubmit={submit}>
          {/* ONE row: the step's title with its progress pinned to the right edge — the shape the
              source's top area was reduced to after running five stacked rows of chrome. h2: the only
              other heading in this section is ApplySection's h1, so an h3 would skip a level. */}
          <div className="crx-form-head">
            <h2 className="crx-panel-title">{STEPS[step].title}</h2>
            <Rail step={step} />
          </div>

          {/* ONE STEP MOUNTED AT A TIME (designer, 2026-08-13, source file) — a CSS-grid version that
              stacked all steps in one shared cell once rendered two steps' fields on top of each
              other. Only the current step's DOM exists, full stop. The shared min-height floor
              (crx-step-body) keeps the Continue/Submit row from jumping between steps; the source's
              exact mobile 480px card height was tuned against the light DS's metrics and is left to
              the gate to re-tune here. If a step overflows the floor, that step's content is the
              thing to trim, not the number — the source raised it twice chasing a step before
              learning that. */}
          {/* The intro opts OUT of the shared floor (Abhisht, 2026-08-24: "the box is going down
              a lot") — the 400px contract keeps Continue steady across the four QUESTION steps,
              but the intro is a fieldless read-once screen and the floor left it ~130px of dead
              space above its button. Cost: Continue drops once on the intro→step-1 transition,
              which is the transition where the card changes character anyway. */}
          <div className={step === 0 ? 'crx-step-body intro' : 'crx-step-body'}>
            {step === 0 && <StepIntro />}
            {step === 1 && <StepOne {...stepProps} />}
            {step === 2 && <StepTwo {...stepProps} />}
            {step === 3 && <StepThree {...stepProps} />}
            {step === 4 && <StepFour {...stepProps} />}
          </div>

          {/* ONE ROW AT BOTH BREAKPOINTS. Back is the kit's quiet ghost button; the primary takes the
              rest of the row. (The source shrank Back to an icon below sm because its light buttons
              couldn't share a mobile row — the kit's quiet button is compact enough that the label
              stays; flag at the gate if a 320px viewport disagrees.) Submit is NEVER disabled — it
              answers with the step's errors instead (see submit()). */}
          <div className="crx-form-foot">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="crx-btn-quiet">
                Back
              </button>
            )}
            <button type="submit" className="btn crx-grow">
              {step === LAST ? 'Submit application' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

/**
 * Minimal progress, right-aligned in the step-title row — the kit's .crx-rail. Segments are
 * INDICATORS, not buttons (source's mobile pass, 2026-08-13): as buttons they were 4×16px jump
 * targets — 9% of minimum touch height — and padding them to 44px can't fit five in this row.
 * Backward navigation already has a real, adequately-sized control: the Back button. The count stays
 * as an sr-only string so the ticks aren't the only way to know where you are.
 */
function Rail({ step }: { step: number }) {
  return (
    <div className="crx-rail">
      <span className="crx-rail-count">
        {step + 1}/{STEPS.length}
        <span className="sr-only">, step {step + 1} of {STEPS.length}</span>
      </span>
      <span className="crx-rail-segs">
        {STEPS.map((s, i) => (
          <span key={s.title} className={`crx-rail-seg${i <= step ? ' on' : ''}`} />
        ))}
      </span>
    </div>
  )
}
