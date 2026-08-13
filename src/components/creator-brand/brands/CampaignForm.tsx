'use client'

import { useState } from 'react'
import { StepOne, StepTwo, StepThree } from './campaign/Steps'
import { INITIAL, STEPS, STEP_FIELDS, validate, type Draft } from './campaign/spec'
import { submitCampaign } from './campaign/submit'
import type { Errors } from '../forms'
import { ModalHeader } from '../Modal'

// The field list is the real product's, given by the designer 2026-08-11, Campaign Name, Post URL,
// Action, Start Date, End Date, Campaign Budget, Bid price, Target Country, plus "What's the goal?"
// as the one optional field. Grouped into three steps (STEPS in spec.ts). Field-level reasoning
// lives with each field in campaign/Steps.tsx.
//
// NOT A SECTION ANY MORE (designer, 2026-08-11): this used to own `#create-a-campaign`, a full
// page section with its own heading column, and every "Create a campaign" CTA scrolled to it.
// It's a dialog now, so this component is the dialog's whole contents, header, form, success
// state, and supplies no panel of its own, because Modal.tsx is the panel. The section's left
// column collapsed into the one-line header below; its "Nothing is charged now" reassurance was
// the only part carrying weight and it now sits directly under the title.
//
// REACH IS GONE (designer, same day). It was a derived, non-editable row showing budget ÷ bid,
// the only output in a form of inputs, which read as a broken field and showed an em-dash until
// both money fields were filled. What it explained is one line of copy under the bid field now.
//
// Two fields the pre-2026-08-11 version had are still deliberately gone, because the spec was
// "these fields only": "Brand name" (Campaign Name covers it) and "Where should we send updates?".
// Losing the email is why the success state can't promise to email anyone.
export default function CampaignForm({
  onClose,
  onDone,
  email = null,
}: {
  onClose?: () => void
  /** Fires once the campaign is submitted, so the host can switch the dialog to its band variant,
   *  the queued state is the CTA band, and the panel's surface and close-button colours are the
   *  host's to own, not this form's. */
  onDone?: () => void
  /** The signed-in brand email from the gate (null on the Google stub path); rides along into
   *  the Supabase submission. */
  email?: string | null
}) {
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

  // Only this step's errors, and only the ones allowed to be visible yet, see forms.tsx for the
  // touched/forced rule. The fields never decide for themselves when to complain.
  const visible: Errors = {}
  for (const f of fields) {
    if ((touched[f] || forced[step]) && all[f]) visible[f] = all[f]
  }
  const touch = (k: string) => setTouched((p) => ({ ...p, [k]: true }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    // The CTA is never disabled. Clicking it with an incomplete step reveals that step's errors
    // instead of doing nothing, a greyed-out button says something's wrong and refuses to say
    // what, which is the one thing this guard exists to avoid.
    if (fields.some((f) => all[f])) {
      setForced((p) => ({ ...p, [step]: true }))
      return
    }
    // Enter inside a field lands here too, so it advances the step rather than doing nothing.
    if (!last) {
      setStep((s) => s + 1)
      return
    }
    submitCampaign(d, email)
    setSubmitted(true)
    onDone?.()
  }

  // The queued state is the CTA BAND, not a white card (designer, 2026-08-11): "same bg and grid
  // lines like the final call container". ModalHost switches the dialog's own variant to `band`
  // when onDone fires, which is what makes this a full-bleed dark panel with the same receding
  // CTAGrid the closing sections use, rather than a dark block sitting inside a white one, and it
  // also flips the close button to its light-on-dark treatment.
  //
  // The mark, the type scale and the white pill deliberately match WaitlistForm's joined state, so
  // "you're done" looks the same on both journeys.
  if (submitted) {
    return (
      <div className="px-8 py-14 text-center sm:px-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-circle bg-white/10 ring-1 ring-white/20">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 12.5l5 5L19.5 6.5" />
          </svg>
        </div>
        <h2 className="mt-5 font-head text-[26px] font-bold text-white">Campaign submitted.</h2>
        {/* Doesn't promise an email, the form doesn't collect one. Saying "we'll email you" with
            no email field is the kind of copy that outlives the UI it described. "In review" is
            the honest lifecycle: every campaign is checked before it reaches workers. */}
        <p className="bai-body-lg mx-auto mt-2.5 max-w-[40ch] text-white/80">
          <b className="font-semibold text-white">{d.name}</b> is in review. We check every
          campaign before it goes live; you can follow it on its report page.
        </p>
        {/* The white pill is the one primary action (band pattern: a hairline outline button on a
            dark band reads as disabled), so View campaign takes the pill and Done drops to a
            quiet text link under it. The report is the design-handoff report page in public/;
            it opens on the campaigns LIST with this campaign prepended as IN REVIEW, built from
            the query params. */}
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/creator-brand/campaign-report.html?submitted=${encodeURIComponent(d.name)}&budget=${encodeURIComponent(d.budget)}&bid=${encodeURIComponent(d.bid)}`}
          target="_blank"
          rel="noopener"
          className="mt-8 inline-block w-full max-w-[260px] rounded-pill bg-white px-6 py-3.5 text-[15px] font-semibold text-ink-display transition-transform duration-base ease-out-bai hover:-translate-y-0.5 active:scale-[0.98]"
        >
          View campaign
        </a>
        <button
          type="button"
          onClick={onClose}
          className="mx-auto mt-4 block text-[13px] font-medium text-white/80 transition-colors duration-base hover:text-white"
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <>
      <ModalHeader
        title={<h2 className="font-head text-[20px] font-bold text-ink-display">Create a campaign</h2>}
        sub="Nothing is charged now. You're only defining the campaign."
      />

      {/* noValidate: this form runs its own validation, shown inline under each field in this site's
          own voice. Without it the browser fires a native bubble FIRST — unstyleable, differently
          worded, and in some cases plain wrong for a design replica. The handle-lookup form has always
          carried it; it simply never reached the two real forms. */}
      <form noValidate onSubmit={submit} className="px-6 py-6 sm:px-8">
        {/* ONE row: the step's title, and the progress pinned to the right edge of it. This top
            area used to run dialog-title → dialog-subtitle → full-width rail → "STEP 2 OF 3" →
            step-title → step-subtitle, which is two titles and two subtitles with the progress
            wedged in the middle. Now the progress is a passenger on the line it describes. */}
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-head text-[17px] font-semibold text-ink-display">{STEPS[step].title}</h3>
          <Rail step={step} />
        </div>

        {/* min-h holds the panel at roughly step 1's height, so moving between steps doesn't
            resize the dialog, and with a dialog that's centred, a height change moves BOTH
            edges, which is far more distracting than it was in the page. */}
        {/* min-h is a DESKTOP stabiliser — it stops a centred dialog resizing both edges between steps.
            On a phone the panel is already taller than the viewport and the reader is scrolling, so it
            stabilises nothing and just burns ~120px of a short screen. */}
        <div className="mt-5 min-h-0 sm:min-h-[300px]">
          {step === 0 && <StepOne d={d} setD={setD} err={visible} touch={touch} />}
          {step === 1 && <StepTwo d={d} setD={setD} err={visible} touch={touch} />}
          {step === 2 && <StepThree d={d} setD={setD} err={visible} touch={touch} />}
        </div>

        {/* STACKED BELOW sm. Side by side, each button gets ~86-94px of label room at 360, and
            "Create this campaign" needs ~140-155px — so the primary wrapped to two lines and broke the
            equal-size pairing both files went to trouble to build. col-reverse keeps the primary
            nearest the thumb while DOM and tab order stay unchanged. */}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          {/* Back is a SECONDARY button now, not a bare text link, and the same size as Continue,
              both flex-1, same padding, same radius. As a tertiary text button it was a different
              species sitting next to the primary, which made the pair read as one button with a
              stray label beside it. Same white/hairline treatment as CBButton's secondary variant,
              so it matches every other secondary on the site. */}
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-pill border border-stroke-warm bg-white px-5 py-3.5 text-[15px] font-semibold text-ink-heading transition-all duration-base ease-out-bai hover:border-ink-heading hover:bg-surface active:scale-[0.98]"
            >
              Back
            </button>
          )}
          {/* One submit button that changes label, not two, the action is always "finish this
              step", and the validation behind it is the same either way. */}
          {/* border-transparent is what actually makes the pair the same size. Both are flex-1, but
              Back carries a 1px border and this one didn't, so it measured ~2px narrower AND ~2px
              shorter, a mismatch small enough to read as sloppy rather than as a difference. A
              matching transparent border equalises both axes without drawing anything. */}
          <button
            type="submit"
            className="flex-1 rounded-pill border border-transparent bg-cta-gradient px-5 py-3.5 text-[15px] font-semibold text-white shadow-cta transition-all duration-base ease-out-bai hover:-translate-y-0.5 hover:shadow-cta-hover"
          >
            {last ? 'Create this campaign' : 'Continue'}
          </button>
        </div>
      </form>
    </>
  )
}

/**
 * Minimal progress, right-aligned in the step-title row. Was a full-width 3-segment rail plus a
 * "STEP 2 OF 3" label on its own line, i.e. two rows of chrome to say one number.
 *
 * The unfilled segments used bg-canvas, and --bai-canvas is pure WHITE, so on a white panel a
 * 3-step rail rendered as TWO visible bars and read as "step 2 of 2". --cb-track is a real fill.
 *
 * Segments are clickable BACKWARD only: jumping forward past an incomplete step would land on a
 * step whose own Continue is about to send you back anyway. The count stays as an sr-only string so
 * the tick marks aren't the only way to know where you are.
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
          // They are indicators now. Backward navigation already has a real, full-width control — the
          // Back button — so this was a duplicate affordance that only existed at an untappable size.
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
