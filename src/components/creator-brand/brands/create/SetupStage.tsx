'use client'

import { useMemo, useState, type FormEvent } from 'react'
import DateField from '../../controls/DateField'
import Money from '../campaign/Money'
import { INPUT, LABEL } from '../../controls/fieldClasses'
import { FieldError, withErr } from '../../forms'
import TypeFields, { type FieldValues } from './TypeFields'
import { REVIEW_MODES, estimate, type CampaignType, type ReviewMode } from './campaignSpec'

// STAGE 3 - the setup form. Fixed questions on every campaign (name, bid, budget, window, review,
// goal), the type's own questions in the middle, and a live estimate between the bid and the dates.
//
// THE ESTIMATE IS THE AGENTIC BEAT OF THIS SCREEN. Swap #1 is that the surface starts the work
// rather than describing it: here that means the page answers back while you type. Enter a bid and a
// budget and the line states what the money buys in the type's own unit - checked views, surviving
// comments, reports - which is the number the brand is really deciding, and the one the dev page
// only reveals after submit.
//
// SAME FORM CONTRACT AS EVERY OTHER FORM ON THIS SITE: the submit is never disabled (clicking with
// a bad field shows the error rather than refusing), blur only counts once something is typed, and
// submit forces every error at once. See forms.tsx for why.

const ERR_REQUIRED = 'Give the campaign a name.'

export type SubmitPayload = {
  name: string
  bid: number
  budget: number
  gen: number | null
  start: Date
  end: Date
  review: ReviewMode
  goal: string
  fields: FieldValues
}

export default function SetupStage({
  type,
  onBack,
  onSubmit,
}: {
  type: CampaignType
  onBack: () => void
  onSubmit: (p: SubmitPayload) => void
}) {
  const [name, setName] = useState('')
  const [bid, setBid] = useState('')
  const [budget, setBudget] = useState('')
  const [gen, setGen] = useState('')
  const [start, setStart] = useState<Date | null>(null)
  const [end, setEnd] = useState<Date | null>(null)
  const [review, setReview] = useState<ReviewMode>(type.review)
  const [goal, setGoal] = useState('')
  const [values, setValues] = useState<FieldValues>({})
  const [forced, setForced] = useState(false)

  const today = useMemo(() => new Date(), [])

  const nBid = parseFloat(bid) || 0
  const nBudget = parseFloat(budget) || 0
  const nGen = type.gen ? parseFloat(gen) || 0 : null

  const errors: Record<string, string | undefined> = {
    name: !name.trim() ? ERR_REQUIRED : undefined,
    bid: !(nBid > 0) ? 'Set a bid above $0.' : undefined,
    budget: !(nBudget > 0) ? 'Set a budget above $0.' : undefined,
    gen: type.gen && !(nGen! > 0) ? 'Set a bid above $0.' : undefined,
    start: !start ? 'Pick a start date.' : undefined,
    end: !end ? 'Pick an end date.' : start && end && end <= start ? 'The end date has to be after the start.' : undefined,
  }
  // THE TYPE'S OWN FIELDS ARE NOT VALIDATED, and that is the source prototype's behaviour kept on
  // purpose rather than an omission. Nothing in the catalogue declares which of them are required,
  // so enforcing any of them would mean inventing a product rule here - and the rule differs per
  // type (a boost needs its URL; a retainer's digest cadence has a sensible default). If required
  // fields are wanted, the flag belongs on TypeField in campaignSpec, not in this component.
  const visible = forced ? errors : {}

  function submit(e: FormEvent) {
    e.preventDefault()
    if (Object.values(errors).some(Boolean)) {
      setForced(true)
      return
    }
    onSubmit({
      name: name.trim(),
      bid: nBid,
      budget: nBudget,
      gen: nGen,
      start: start!,
      end: end!,
      review,
      goal: goal.trim(),
      fields: values,
    })
  }

  const buys = estimate(type, nBid, nBudget)

  return (
    <section>
      <button
        type="button"
        onClick={onBack}
        className="cb-mono text-[12px] text-ink-muted transition-colors hover:text-ink-heading"
      >
        &lsaquo; About this campaign
      </button>

      <h1 className="mt-4 font-head text-[26px] font-bold leading-tight text-ink-display sm:text-[30px]">
        Set up your campaign
      </h1>
      <p className="bai-body-sm mt-2 max-w-[62ch] text-ink-body-2">
        Nothing is charged now. We check every campaign before it goes live.
      </p>

      <form onSubmit={submit} className="mt-6 max-w-[640px] rounded-field border border-divider bg-white p-5 sm:p-6" noValidate>
        {/* The chosen type, named in mono at the top of its own form - the reader arrived here
            through two stages and the form has to say which of the nine it is setting up. */}
        <p className="cb-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--cb-accent)]">
          {type.name}
        </p>

        <label className="mt-4 block">
          <span className={LABEL}>Campaign name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Fernweh Coffee: spring launch"
            className={withErr(INPUT, visible.name)}
          />
          <FieldError>{visible.name}</FieldError>
        </label>

        <TypeFields fields={type.fields} values={values} onChange={(k, v) => setValues((p) => ({ ...p, [k]: v }))} errors={{}} />

        <div className="mt-7 border-t border-divider pt-5">
          <p className="cb-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Pricing, outcome based
          </p>
          <p className="bai-caption mt-1 text-ink-muted">
            You bid what each result is worth to you. You only pay for checked results.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Money label={type.outcome.label} value={bid} onChange={setBid} onBlur={() => {}} placeholder={type.outcome.ph} step="0.5" err={visible.bid} />
            <Money label="Campaign budget" value={budget} onChange={setBudget} onBlur={() => {}} placeholder="500" step="10" err={visible.budget} />
          </div>

          {type.gen && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Money label={type.gen.label} value={gen} onChange={setGen} onBlur={() => {}} placeholder={type.gen.ph} step="1" err={visible.gen} />
              <p className="bai-caption self-center text-ink-muted">
                Making the videos is charged per video, out of the same budget.
              </p>
            </div>
          )}

          {/* The live answer. Mono, because it is the machine reporting a count. */}
          <p className="cb-mono mt-4 rounded-field border border-divider bg-[var(--cb-hover)] px-3.5 py-3 text-[12px] text-ink-heading">
            {buys === null ? (
              <span className="text-ink-muted">Set a bid and a budget to see what it buys.</span>
            ) : (
              <>
                Your budget buys about{' '}
                <b className="font-semibold text-[var(--cb-accent)]">
                  {buys.toLocaleString()} {type.outcome.unit}
                </b>{' '}
                at this bid.
                {type.gen && ' Video bids come out of the same budget.'}
              </>
            )}
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <DateField
            label="Start date"
            value={start}
            min={today}
            placeholder="Pick a day"
            err={visible.start}
            onChange={(v) => setStart(() => { setEnd((p) => (p && p < v ? null : p)); return v })}
          />
          <DateField label="End date" value={end} min={start ?? today} placeholder="Pick a day" align="right" err={visible.end} onChange={setEnd} />
        </div>

        {/* THE REVIEW LADDER as a real control, not a line of copy. It decides how much work goes
            out under the brand's name unseen, which is the single biggest trust question on the
            page - so it is asked here, and it arrives on the type's own sensible default. */}
        <fieldset className="mt-6">
          <legend className={LABEL}>Content review</legend>
          <span className="bai-caption mt-1 block text-ink-muted">
            Decide what a member posts before it goes out under your name.
          </span>
          <div className="mt-2.5 space-y-2">
            {REVIEW_MODES.map((m) => {
              const on = review === m.v
              return (
                <label key={m.v} className="block cursor-pointer select-none">
                  <input type="radio" name="cb-review" checked={on} onChange={() => setReview(m.v)} className="peer sr-only" />
                  <span
                    className={`block rounded-card border px-3.5 py-3 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(var(--cb-accent-rgb),0.30)] ${
                      on
                        ? 'border-[rgba(var(--cb-accent-rgb),0.38)] bg-[rgba(var(--cb-accent-rgb),0.07)]'
                        : 'border-divider hover:border-stroke-warm'
                    }`}
                  >
                    <span className={`block text-[13px] font-semibold ${on ? 'text-[var(--cb-accent)]' : 'text-ink-heading'}`}>{m.l}</span>
                    <span className="bai-caption mt-0.5 block text-ink-muted">{m.h}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <label className="mt-6 block">
          <span className={LABEL}>
            What is the goal? <span className="font-normal text-ink-muted">(optional)</span>
          </span>
          <textarea
            rows={2}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Awareness for our new roast, ahead of the summer range."
            className={`${INPUT} resize-y`}
          />
        </label>

        <button
          type="submit"
          className="mt-7 w-full rounded-pill bg-[var(--cb-accent)] px-6 py-3.5 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Submit for review
        </button>
      </form>
    </section>
  )
}
