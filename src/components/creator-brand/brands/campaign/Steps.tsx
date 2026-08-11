'use client'

import type { Dispatch, SetStateAction } from 'react'
import DateField from '../../controls/DateField'
import SelectField from '../../controls/SelectField'
import { INPUT, LABEL } from '../../controls/fieldClasses'
import { FieldError, withErr } from '../../forms'
import { ACTIONS, COUNTRIES, type Draft } from './spec'

type Props = {
  d: Draft
  setD: Dispatch<SetStateAction<Draft>>
  /** Only the errors that should currently be VISIBLE — the parent decides that, not the field. */
  err: Record<string, string | undefined>
  /** Marks a field touched, so its error can appear once the user has left it. */
  touch: (k: string) => void
}

// Placeholders are concrete examples with no "e.g." prefix — the label already says what the field
// is, and cb-field-strong's placeholder colour is deliberately tuned (0.55 alpha, ~4.2:1) to read
// as empty rather than pre-filled, which is the job "e.g." was doing.
export function StepOne({ d, setD, err, touch }: Props) {
  function toggleAction(a: string) {
    touch('actions')
    setD((p) => ({
      ...p,
      actions: p.actions.includes(a) ? p.actions.filter((x) => x !== a) : [...p.actions, a],
    }))
  }

  return (
    <>
      <label className="block">
        <span className={LABEL}>Campaign name</span>
        <input
          value={d.name}
          onChange={(e) => setD((p) => ({ ...p, name: e.target.value }))}
          onBlur={() => touch('name')}
          placeholder="Fernweh Coffee — spring launch"
          className={withErr(INPUT, err.name)}
        />
        <FieldError>{err.name}</FieldError>
      </label>

      <label className="mt-5 block">
        <span className={LABEL}>Post URL</span>
        <input
          type="url"
          inputMode="url"
          value={d.url}
          onChange={(e) => setD((p) => ({ ...p, url: e.target.value }))}
          onBlur={() => touch('url')}
          placeholder="https://youtube.com/watch?v=…"
          className={withErr(INPUT, err.url)}
        />
        {/* The hint gives way to the error rather than stacking with it — two lines of 11px text
            under one field, one of them red, is where a form starts looking broken. */}
        {err.url ? (
          <FieldError>{err.url}</FieldError>
        ) : (
          <span className="mt-1.5 block text-[11px] text-ink-muted">YouTube only for now.</span>
        )}
      </label>

      {/* Multi-select, not a single choice: the three are independent things a brand can ask for.
          A fieldset rather than a bare div, so the group has one accessible name instead of three
          unrelated checkboxes. */}
      <fieldset className="mt-5">
        <legend className={LABEL}>Action</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {ACTIONS.map((a) => {
            const on = d.actions.includes(a)
            return (
              // The checkbox is sr-only, so keyboard focus has nothing visible to land on unless
              // the ring is forwarded to the chip — hence peer + peer-focus-visible. Without it
              // this row was keyboard-operable but invisibly so.
              <label key={a} className="cursor-pointer select-none">
                <input type="checkbox" checked={on} onChange={() => toggleAction(a)} className="peer sr-only" />
                <span
                  className={`block rounded-pill border px-4 py-2 text-[13px] font-medium capitalize transition-all duration-base ease-out-bai peer-focus-visible:ring-2 peer-focus-visible:ring-iris/40 peer-focus-visible:ring-offset-2 ${
                    on
                      ? 'border-transparent bg-bai-gradient text-white shadow-brand-sm'
                      : err.actions
                        ? 'border-status-danger text-ink-body-2'
                        : 'border-stroke-warm text-ink-body-2 hover:border-ink-muted'
                  }`}
                >
                  {a}
                </span>
              </label>
            )
          })}
        </div>
        <FieldError>{err.actions}</FieldError>
      </fieldset>
    </>
  )
}

export function StepTwo({ d, setD, err, touch }: Props) {
  // A campaign can't start in the past, and it can't end before it starts. Both are enforced by
  // the pickers' own floors rather than by an error message after the fact — and moving the start
  // past an already-chosen end clears that end, because leaving an impossible window on screen
  // and calling it invalid is worse than asking for the one field again.
  const today = new Date()

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Money
          label="Campaign budget"
          value={d.budget}
          onChange={(v) => setD((p) => ({ ...p, budget: v }))}
          onBlur={() => touch('budget')}
          placeholder="500"
          step="1"
          err={err.budget}
        />
        <Money
          label="Bid price"
          value={d.bid}
          onChange={(v) => setD((p) => ({ ...p, bid: v }))}
          onBlur={() => touch('bid')}
          placeholder="1.00"
          step="0.01"
          err={err.bid}
        />
      </div>
      {/* Only shown when neither money field is complaining — see the Post URL note for why. */}
      {!err.budget && !err.bid && (
        <span className="mt-1.5 block text-[11px] text-ink-muted">
          The bid is what you pay for each verified action. Illustrative — not a rate card.
        </span>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <DateField
          label="Start date"
          value={d.start}
          min={today}
          placeholder="Pick a day"
          err={err.start}
          onChange={(v) => {
            touch('start')
            setD((p) => ({ ...p, start: v, end: p.end && p.end < v ? null : p.end }))
          }}
        />
        {/* align="right" so the calendar — wider than the half-width field it hangs off —
            opens inward across the card instead of off its right edge. */}
        <DateField
          label="End date"
          value={d.end}
          min={d.start ?? today}
          placeholder="Pick a day"
          align="right"
          err={err.end}
          onChange={(v) => {
            touch('end')
            setD((p) => ({ ...p, end: v }))
          }}
        />
      </div>
    </>
  )
}

export function StepThree({ d, setD }: Props) {
  return (
    <>
      <SelectField
        label="Target country"
        value={d.country}
        options={COUNTRIES}
        onChange={(v) => setD((p) => ({ ...p, country: v }))}
      />

      {/* The one optional field, and the label says so rather than relying on the absence of
          `required` — which is invisible until you try to submit. */}
      <label className="mt-5 block">
        <span className={LABEL}>
          What&apos;s the goal? <span className="font-normal">(optional)</span>
        </span>
        <textarea
          rows={3}
          value={d.goal}
          onChange={(e) => setD((p) => ({ ...p, goal: e.target.value }))}
          placeholder="Awareness for our new roast, ahead of the summer range."
          className={`${INPUT} resize-none py-3`}
        />
      </label>
    </>
  )
}

// The $ is a prefix AFFIX, not typed content, so it sits at placeholder weight (cb-field-affix)
// and the SHELL carries the border — which is why cb-field-strong is on the wrapper here and the
// inner input is transparent and borderless. cb-nospin removes the native number spinners: they
// paint hard against the right edge, the same crowding the custom chevron was built to avoid.
function Money({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  step,
  err,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onBlur: () => void
  placeholder: string
  step: string
  err?: string
}) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <div
        className={withErr('cb-field-strong mt-1.5 flex items-center rounded-field border bg-white px-3.5', err)}
      >
        <span className="cb-field-affix text-[14px]">$</span>
        <input
          type="number"
          min={0}
          step={step}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="cb-nospin cb-tabular w-full bg-transparent py-3 pl-1.5 text-[14px] text-ink-heading outline-none"
        />
      </div>
      <FieldError>{err}</FieldError>
    </label>
  )
}
