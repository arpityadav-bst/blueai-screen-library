'use client'

import type { ReactNode } from 'react'
import { FieldError } from './forms'

// The application's two custom controls plus the shared field-shell class strings — a one-file merge
// of creator-brand's controls/ChoiceGroup.tsx + controls/CheckField.tsx + controls/fieldClasses.ts,
// logic verbatim, skin swapped to the .crx kit (creators.css flow-kit section).
//
// fieldClasses.ts equivalents. .crx-field owns border, hover, focus halo and placeholder for every
// text surface, so nothing here declares its own — and the custom controls get the same treatment as
// a real <input> rather than an approximation. `.err` (via withErr) beats all of it by source order.
// The darker-labels decision carries over: .crx-label is the strongest text next to a field, hints
// sit quieter beneath it.
export const LABEL = 'crx-label'
export const INPUT = 'crx-field crx-gap-label'

/** The corner mark on a chosen card / the CheckField box glyph. Solid stroke so it reads at 11px. */
export function TickIcon({ size = 11 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 12.5l5 5L19.5 6.5" />
    </svg>
  )
}

// SINGLE-select options, in two shapes (source: ChoiceGroup.tsx — read that file's header for the
// full history; the load-bearing decisions are kept here):
//
// THE BUG THIS SHAPE FIXES (designer, 2026-08-13): options used to reserve a fixed-width slot for a
// checkmark that only rendered once selected — an unselected row showed a hole where its glyph
// wasn't, which across a form reads as a mis-indent. The slot existed so selection wouldn't reflow
// neighbours, so the fix keeps the layout independent of the mark:
//   `cards`  permanent left mass (an icon that is always there) + an ABSOLUTELY positioned corner
//            badge (.crx-choice-mark). Selected differs by colour; nothing reflows.
//   `chips`  no mark at all. Border, fill and ink all change on selection — a tick was a second
//            signal for one state, paid for with a permanent hole in the other.
// WHICH SHAPE WHERE is a judgement about the question, not the option count: cards when the choice
// deserves to be looked at, chips for the small factual ones.
//
// STATES ARE EXPLICIT AND ALL FOUR EXIST — rest, hover, focus-visible, selected (all in the kit's
// .crx-choice / .crx-choice-card rules). Hover never fakes selection; focus is a ring forwarded from
// the sr-only input (creators.css's `input.sr-only:focus-visible + …` rule), since without it the
// group is keyboard-operable but invisibly so.
// ONE SELECTED COLOUR, AND IT IS NOT THE GRADIENT (designer, 2026-08-13): the kit's iris selection
// trio (--sel-border/--sel-wash/--iris) paints every "chosen" state — the gradient stays reserved
// for things you PRESS. Selection is a value, not a CTA.
//
// TONES: a yes/no answer is not a neutral pick, so affirm reads mint and deny reads danger — the
// kit's tone-ok / tone-danger variants, showing at REST on the icon alone (waiting until selection
// would mean the colour only appears once you no longer need it to tell the options apart).
export type Tone = 'ok' | 'danger'
export type Choice = { value: string; icon?: ReactNode; hint?: string; tone?: Tone }

export function ChoiceGroup({
  label,
  hint,
  name,
  value,
  options,
  onChange,
  err,
  variant = 'chips',
  columns = 2,
  tight = false,
}: {
  label: string
  /** Sits under the options, and gives way to the error rather than stacking with it. */
  hint?: string
  /** Must be unique on the page — it's the radio group's identity, not a display string. */
  name: string
  value: string
  options: readonly (string | Choice)[]
  onChange: (v: string) => void
  err?: string
  variant?: 'cards' | 'chips'
  /** cards only. */
  columns?: 2 | 3
  /**
   * Halves the label→options gap. OPT-IN, for exactly one caller: the application's last step, which
   * carries four groups against every other step's two or three and has to fit the same height budget
   * (Appy, 2026-08-14). Default false so no other group moves — a height concession bought on one
   * screen, not a change of opinion about how far a label should sit from its own control.
   */
  tight?: boolean
}) {
  const items: Choice[] = options.map((o) => (typeof o === 'string' ? { value: o } : o))

  return (
    // A fieldset rather than a div, so the group carries ONE accessible name instead of the reader
    // meeting four unrelated radios with no idea what question they answer.
    <fieldset className="crx-fieldset">
      <legend className={LABEL}>{label}</legend>

      <div
        className={
          // crx-opts carries the label→options gap; `tight` halves it (see the tight prop above).
          variant === 'cards'
            ? `crx-choice-grid${columns === 3 ? ' cols-3' : ''} crx-opts${tight ? ' tight' : ''}`
            : `crx-choice-row crx-opts${tight ? ' tight' : ''}`
        }
      >
        {items.map((o, i) => {
          const on = o.value === value
          const tone = o.tone ? ` tone-${o.tone}` : ''
          const state = `${on ? ' on' : ''}${err && !on ? ' err' : ''}`
          // An odd number of cards leaves the last one alone in a half-empty row; the original spanned
          // it (and cancelled the span at the 3-col desktop width). Kit gap — see the missing-styles
          // report: .crx-ctl.span-last needs a grid-column rule before this does anything.
          const lastOdd = variant === 'cards' && items.length % 2 === 1 && i === items.length - 1
          return (
            // The radio is sr-only so the control keeps its semantics — one answer per group, arrow
            // keys for free — while the paint is ours. The kit's sibling selector forwards its
            // focus-visible ring onto the painted span.
            <label key={o.value} className={`crx-ctl${lastOdd ? ' span-last' : ''}`}>
              <input
                type="radio"
                name={name}
                checked={on}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />

              {variant === 'cards' ? (
                <span className={`crx-choice-card${tone}${state}`}>
                  {o.icon && <span className="crx-choice-ic">{o.icon}</span>}
                  <span className="crx-choice-name">{o.value}</span>
                  {o.hint && <span className="crx-choice-hint">{o.hint}</span>}
                  {/* ABSOLUTE (kit rule), so it costs no layout — the whole reason cards can carry a
                      tick and chips can't afford one. ROUND rather than square because these are
                      radios and CheckField's box is a checkbox — the one shape difference that
                      carries meaning. Always in the DOM; the kit shows it only on .on. */}
                  <span className="crx-choice-mark">
                    <TickIcon size={11} />
                  </span>
                </span>
              ) : (
                <span className={`crx-choice${tone}${state}`}>
                  {o.icon && <span className="crx-choice-ic">{o.icon}</span>}
                  {o.value}
                </span>
              )}
            </label>
          )
        })}
      </div>

      {/* ALWAYS ONE SLOT, NEVER ZERO (designer, 2026-08-13, source: ChoiceGroup.tsx) — a group with
          no hint and no error still reserves the line, so an error appearing fills an already-held
          box instead of growing the card. THE HINT SHARES FIELDERROR'S EXACT BOX (the kit's .crx-hint
          and .crx-err are deliberately the same box), so swapping hint for error changes the colour
          and the words, not the height. */}
      {err ? <FieldError>{err}</FieldError> : hint ? (
        <span className="crx-hint">{hint}</span>
      ) : (
        <FieldError />
      )}
    </fieldset>
  )
}

// A single statement you tick — the age confirmation and the closing consent line.
// (Source: CheckField.tsx — the decisions that survive the re-skin:)
//
// IT IS A SELECTABLE ROW, not a bare checkbox on the page background (designer, 2026-08-13): the one
// question that can END the application must not look like a footnote, and the whole row being the
// target reads consent in the same visual language as every other answer. The box fills iris rather
// than the gradient — gradient stays reserved for things you press.
//
// THE BOX IS DRAWN, NOT NATIVE: the OS paints a native checkbox, so it can carry neither our hover
// treatment nor the iris fill. The real input stays in the DOM (sr-only) and keeps its semantics,
// label association and focus behaviour; only the paint is ours (.crx-check-box).
export function CheckField({
  checked,
  onChange,
  err,
  children,
  subtle = false,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  err?: string
  children: ReactNode
  /**
   * SUBTLE (designer, 2026-08-13) — no card at all: the closing "I agree to the Program Terms…"
   * line is boilerplate ticked on the way out, not a decision needing the age-gate's presence. The
   * kit's .crx-check.subtle drops the bordered card; the focus ring still lands via the sr-only
   * sibling rule. Nothing else uses it.
   */
  subtle?: boolean
}) {
  return (
    <div>
      <label className="crx-ctl">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span className={`crx-check${subtle ? ' subtle' : ''}${checked ? ' on' : ''}${err && !checked ? ' err' : ''}`}>
          <span className={`crx-check-box${checked ? ' on' : ''}`}>{checked && <TickIcon size={11} />}</span>
          <span>{children}</span>
        </span>
      </label>
      {/* Reserved-height error slot, same as every field (see FieldError). */}
      <FieldError>{err}</FieldError>
    </div>
  )
}
