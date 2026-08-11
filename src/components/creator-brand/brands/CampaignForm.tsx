'use client'

import { useState } from 'react'
import { StepOne, StepTwo, StepThree } from './campaign/Steps'
import { INITIAL, STEPS, STEP_FIELDS, validate, type Draft } from './campaign/spec'
import type { Errors } from '../forms'

// The field list is the real product's, given by the designer 2026-08-11 — Campaign Name, Post URL,
// Action, Start Date, End Date, Campaign Budget, Bid price, Target Country, plus "What's the goal?"
// as the one optional field. Grouped into three steps (STEPS in spec.ts). Field-level reasoning
// lives with each field in campaign/Steps.tsx.
//
// NOT A SECTION ANY MORE (designer, 2026-08-11): this used to own `#create-a-campaign`, a full
// page section with its own heading column, and every "Create a campaign" CTA scrolled to it.
// It's a dialog now, so this component is the dialog's whole contents — header, form, success
// state — and supplies no panel of its own, because Modal.tsx is the panel. The section's left
// column collapsed into the one-line header below; its "Nothing is charged now" reassurance was
// the only part carrying weight and it now sits directly under the title.
//
// REACH IS GONE (designer, same day). It was a derived, non-editable row showing budget ÷ bid —
// the only output in a form of inputs, which read as a broken field and showed an em-dash until
// both money fields were filled. What it explained is one line of copy under the bid field now.
//
// Two fields the pre-2026-08-11 version had are still deliberately gone, because the spec was
// "these fields only": "Brand name" (Campaign Name covers it) and "Where should we send updates?".
// Losing the email is why the success state can't promise to email anyone.
export default function CampaignForm({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState(0)
  const [d, setD] = useState<Draft>(INITIAL)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  // Per STEP, not global: forcing step 1's errors open shouldn't pre-redden step 2's dates, and
  // returning to a step you already failed should still show what it told you.
  const [forced, setForced] = useState<Record<number, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  const last = step === STEPS.length - 1
  const all = validate(d)
  const fields = STEP_FIELDS[step]

  // Only this step's errors, and only the ones allowed to be visible yet — see forms.tsx for the
  // touched/forced rule. The fields never decide for themselves when to complain.
  const visible: Errors = {}
  for (const f of fields) {
    if ((touched[f] || forced[step]) && all[f]) visible[f] = all[f]
  }
  const touch = (k: string) => setTouched((p) => ({ ...p, [k]: true }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    // The CTA is never disabled. Clicking it with an incomplete step reveals that step's errors
    // instead of doing nothing — a greyed-out button says something's wrong and refuses to say
    // what, which is the one thing this guard exists to avoid.
    if (fields.some((f) => all[f])) {
      setForced((p) => ({ ...p, [step]: true }))
      return
    }
    // Enter inside a field lands here too, so it advances the step rather than doing nothing.
    if (!last) setStep((s) => s + 1)
    else setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="px-6 py-12 text-center sm:px-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-circle bg-bai-gradient shadow-brand-sm">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 12.5l5 5L19.5 6.5" />
          </svg>
        </div>
        <h2 className="mt-5 font-head text-[22px] font-semibold text-ink-display">Your campaign is queued.</h2>
        {/* Doesn't promise an email — the form doesn't collect one. Saying "we'll email you" with
            no email field is the kind of copy that outlives the UI it described. */}
        <p className="mx-auto mt-2 max-w-[40ch] text-[14px] text-ink-body-2">
          <b className="font-semibold text-ink-heading">{d.name}</b> is saved. BlueAI will start matching
          creators to it the moment we go live.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-7 rounded-pill border border-stroke-warm px-6 py-3 text-[14px] font-semibold text-ink-heading transition-all duration-base ease-out-bai hover:border-ink-heading hover:bg-surface"
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <>
      {/* pr-12 clears Modal's own close button, which is absolutely positioned over this corner. */}
      <div className="border-b border-divider px-6 py-5 pr-12 sm:px-8 sm:pr-14">
        <h2 className="font-head text-[20px] font-bold text-ink-display">Create a campaign</h2>
        <p className="mt-1 text-[13px] text-ink-body-2">
          Nothing is charged now — you&apos;re only defining the campaign.
        </p>
      </div>

      <form onSubmit={submit} className="px-6 py-6 sm:px-8">
        <Rail step={step} onJump={setStep} />

        <div className="mt-5">
          <h3 className="font-head text-[17px] font-semibold text-ink-display">{STEPS[step].title}</h3>
          <p className="mt-1 text-[13px] text-ink-body-2">{STEPS[step].sub}</p>
        </div>

        {/* min-h holds the panel at roughly step 1's height, so moving between steps doesn't
            resize the dialog — and with a dialog that's centred, a height change moves BOTH
            edges, which is far more distracting than it was in the page. */}
        <div className="mt-6 min-h-[300px]">
          {step === 0 && <StepOne d={d} setD={setD} err={visible} touch={touch} />}
          {step === 1 && <StepTwo d={d} setD={setD} err={visible} touch={touch} />}
          {step === 2 && <StepThree d={d} setD={setD} err={visible} touch={touch} />}
        </div>

        <div className="mt-7 flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-pill px-4 py-3 text-[14px] font-medium text-ink-muted transition-colors duration-base ease-out-bai hover:text-ink-heading"
            >
              Back
            </button>
          )}
          {/* One submit button that changes label, not two — the action is always "finish this
              step", and the validation behind it is the same either way. */}
          <button
            type="submit"
            className="ml-auto flex-1 rounded-pill bg-cta-gradient px-5 py-3.5 text-[15px] font-semibold text-white shadow-cta transition-all duration-base ease-out-bai hover:-translate-y-0.5 hover:shadow-cta-hover"
          >
            {last ? 'Create this campaign' : 'Continue'}
          </button>
        </div>
      </form>
    </>
  )
}

// Progress sits at the top of the form, above the step title. Segments are clickable BACKWARD
// only — jumping forward past an incomplete step would land on a step whose own Continue is about
// to send you back anyway.
function Rail({ step, onJump }: { step: number; onJump: (s: number) => void }) {
  return (
    <div>
      <div className="flex gap-1.5">
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-label={`Step ${i + 1}: ${s.title}`}
            aria-current={i === step ? 'step' : undefined}
            disabled={i > step}
            onClick={() => onJump(i)}
            className={`h-1.5 flex-1 rounded-pill transition-colors duration-slow ease-out-bai disabled:cursor-default ${
              i <= step ? 'bg-bai-gradient' : 'bg-canvas'
            }`}
          />
        ))}
      </div>
      <span className="mt-3 block text-[11px] font-bold uppercase tracking-label text-ink-muted">
        Step {step + 1} of {STEPS.length}
      </span>
    </div>
  )
}
