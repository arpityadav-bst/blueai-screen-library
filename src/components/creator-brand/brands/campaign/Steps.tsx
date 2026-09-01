'use client'

import type { Dispatch, SetStateAction } from 'react'
import DateField from '../../controls/DateField'
import Money from './Money'
import { Check } from '../../controls/icons'
import { INPUT, LABEL } from '../../controls/fieldClasses'
import { FieldError, withErr } from '../../forms'
import { CHANNELS } from '../../platforms/channels'
import { ACTIONS, COUNTRIES, type Draft } from './spec'

// The one live platform (channels.ts is the logo SSOT; YouTube is the only entry with live: true).
const YT = CHANNELS[0]

type Props = {
  d: Draft
  setD: Dispatch<SetStateAction<Draft>>
  /** Only the errors that should currently be VISIBLE, the parent decides that, not the field. */
  err: Record<string, string | undefined>
  /** Marks a field touched, so its error can appear once the user has left it. */
  touch: (k: string) => void
}

// Placeholders are concrete examples with no "e.g." prefix, the label already says what the field
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
      {/* Platform is stated, not chosen: campaigns run on YouTube only. Saying it first, as a
          field, puts the constraint where the brand is looking, instead of a hint under the URL. */}
      <div>
        <span className={LABEL}>Platform</span>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-card border border-[rgba(var(--cb-accent-rgb),0.38)] bg-[rgba(var(--cb-accent-rgb),0.07)] px-2.5 py-1.5 text-[12px] font-medium text-ink-heading">
            <span className="flex w-3 justify-center text-[var(--cb-accent)]"><Check size={11} /></span>
            <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden="true">
              <path fill={YT.color} d={YT.path} />
            </svg>
            {YT.label}
          </span>
          <span className="text-[11px] text-ink-muted">More platforms coming soon.</span>
        </div>
      </div>

      <label className="mt-5 block">
        <span className={LABEL}>Campaign name</span>
        <input
          value={d.name}
          onChange={(e) => setD((p) => ({ ...p, name: e.target.value }))}
          onBlur={() => touch('name')}
          placeholder="Fernweh Coffee: spring launch"
          className={withErr(INPUT, err.name)}
        />
        <FieldError>{err.name}</FieldError>
      </label>

      <label className="mt-5 block">
        <span className={LABEL}>YouTube video URL</span>
        <input
          // type="text", NOT type="url" (2026-08-13). The browser enforces its OWN constraint on a
          // url input and it demands a scheme, so `asdas.com` — or any perfectly good
          // `youtube.com/watch?v=...` — was rejected by a native bubble before our validator ran at
          // all. That bubble also cannot be styled, cannot be positioned, and speaks in the browser's
          // words rather than ours, which on a design library is three problems in one.
          // inputMode="url" is kept: it is what actually earns the URL keyboard on a phone, and unlike
          // the type it carries no validation of its own.
          type="text"
          inputMode="url"
          value={d.url}
          onChange={(e) => setD((p) => ({ ...p, url: e.target.value }))}
          onBlur={() => touch('url')}
          placeholder="https://youtube.com/watch?v=…"
          className={withErr(INPUT, err.url)}
        />
        {/* The hint gives way to the error rather than stacking with it, two lines of 11px text
            under one field, one of them red, is where a form starts looking broken. */}
        {err.url ? (
          <FieldError>{err.url}</FieldError>
        ) : (
          <span className="mt-1.5 block text-[11px] text-ink-muted">A public YouTube video or Short.</span>
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
              // the ring is forwarded to the chip, hence peer + peer-focus-visible. Without it
              // this row was keyboard-operable but invisibly so.
              //
              // SELECTED IS NOT A CTA (designer, 2026-08-11). These were gradient pills with a
              // brand shadow, which is the exact treatment of the form's own submit button, three
              // filters reading as three primary actions, right above the real one. Selected is now
              // a 10%-wash + iris ink + iris hairline + a small check: unmistakably on, visibly a
              // filter. Smaller too (12px, tighter padding, 8px radius rather than a 128px pill),
              // so the row reads as a set of options rather than a row of buttons.
              <label key={a} className="cursor-pointer select-none">
                <input type="checkbox" checked={on} onChange={() => toggleAction(a)} className="peer sr-only" />
                <span
                  className={`flex min-h-[44px] items-center gap-1.5 rounded-card border px-3.5 py-2.5 text-[12px] font-medium capitalize transition-all duration-base ease-out-bai peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(var(--cb-accent-rgb),0.30)] peer-focus-visible:ring-offset-2 ${
                    on
                      ? 'border-[rgba(var(--cb-accent-rgb),0.38)] bg-[rgba(var(--cb-accent-rgb),0.07)] text-[var(--cb-accent)]'
                      : err.actions
                        ? 'border-status-danger text-ink-body-2'
                        : 'border-divider text-ink-muted hover:border-stroke-warm hover:text-ink-body-2'
                  }`}
                >
                  {/* NO CHECK, AND NO SLOT FOR ONE (designer, 2026-08-13). The mark used to sit in a
                      permanently reserved w-3 box so that selecting a chip wouldn't widen it and
                      shuffle its neighbours. That worked, at the price of every UNSELECTED chip
                      showing an empty indent where its glyph wasn't. Colour already says "on" three
                      times over here — border, fill and ink all change — so the tick was a second
                      signal for one state paid for with a hole in the other. Same fix as the
                      creators' ChoiceGroup chips; see that file. */}
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
  // the pickers' own floors rather than by an error message after the fact, and moving the start
  // past an already-chosen end clears that end, because leaving an impossible window on screen
  // and calling it invalid is worse than asking for the one field again.
  const today = new Date()

  return (
    <>
      {/* Single column below sm: at 320 these were 98px each, and the date trigger alone needs ~145px
          of content (glyph + gap + "Pick a day" + chevron). */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
      {/* Only shown when neither money field is complaining, see the Post URL note for why. */}
      {!err.budget && !err.bid && (
        <span className="mt-1.5 block text-[11px] text-ink-muted">
          The bid is what you pay for each verified action. Illustrative, not a rate card.
        </span>
      )}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        {/* align="right" so the calendar, wider than the half-width field it hangs off,
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
      {/* Chosen, no longer stated: Worldwide joined the pilot's US-only targeting (2026-08-31), so
          this row wears step 1's Action-chip clothes — colour says "on", no check glyph, focus ring
          forwarded from the sr-only input. Radios, not checkboxes: a campaign targets one region.
          It becomes a SelectField the day COUNTRIES grows into a real per-country list. No "coming
          soon" hint here, unlike the Platform row: that line excused a row with no choice, and
          next to Worldwide it read as a contradiction rather than a promise. */}
      <fieldset>
        <legend className={LABEL}>Target country</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {COUNTRIES.map((c) => {
            const on = d.country === c
            return (
              <label key={c} className="cursor-pointer select-none">
                <input
                  type="radio"
                  name="cb-target-country"
                  checked={on}
                  onChange={() => setD((p) => ({ ...p, country: c }))}
                  className="peer sr-only"
                />
                <span
                  className={`flex min-h-[44px] items-center rounded-card border px-3.5 py-2.5 text-[12px] font-medium transition-all duration-base ease-out-bai peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(var(--cb-accent-rgb),0.30)] peer-focus-visible:ring-offset-2 ${
                    on
                      ? 'border-[rgba(var(--cb-accent-rgb),0.38)] bg-[rgba(var(--cb-accent-rgb),0.07)] text-[var(--cb-accent)]'
                      : 'border-divider text-ink-muted hover:border-stroke-warm hover:text-ink-body-2'
                  }`}
                >
                  {c}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* The one optional field, and the label says so rather than relying on the absence of
          `required`, which is invisible until you try to submit. */}
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

