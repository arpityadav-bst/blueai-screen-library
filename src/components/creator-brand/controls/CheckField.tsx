'use client'

import { TickIcon } from './choiceIcons'
import { FieldError } from '../forms'

// A single statement you tick — the age confirmation and the contact consent.
//
// IT IS A SELECTABLE ROW NOW, not a bare checkbox on the page background (designer, 2026-08-13). Two
// things were wrong with the bare version. It had no resting presence at all, so the one question that
// can END the application looked like a footnote under the heading. And its only "on" signal was the
// box filling with the full brand gradient, which is this site's PRIMARY-ACTION treatment — the same
// paint as the submit button, on a control that is an input, not an action.
//
// Now the whole row is the target: a bordered surface at rest that takes the same iris wash as a
// chosen option card when ticked, so consent reads in the same visual language as every other answer
// in the form instead of inventing a third one. The box itself fills iris rather than the gradient —
// gradient stays reserved for things you press.
//
// THE BOX IS DRAWN, NOT NATIVE, for the same reason SelectField replaced the native <select>: the OS
// paints a native checkbox, so it can carry neither our hover treatment nor the iris fill. The real
// input stays in the DOM (sr-only, `peer`) and keeps its semantics, its label association and its
// focus behaviour; only the paint is ours.
// Same three values as ChoiceGroup, and deliberately the same names — see that file for why the
// selection colour is iris and not the gradient or --cb-accent.
const SELECTED_BORDER = 'rgba(var(--cb-accent-rgb),0.38)'
const SELECTED_WASH = 'rgba(var(--cb-accent-rgb),0.07)'
const SELECTED_SOLID = 'var(--cb-accent)'

export default function CheckField({
  checked,
  onChange,
  err,
  children,
  subtle = false,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  err?: string
  children: React.ReactNode
  /** See the SUBTLE block comment above — the closing agree-to-terms line uses this, nothing else does. */
  subtle?: boolean
}) {
  return (
    <div>
      <label className="block cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          style={!subtle && checked ? { borderColor: SELECTED_BORDER, background: SELECTED_WASH } : undefined}
          className={
            subtle
              ? // SUBTLE (designer, 2026-08-13) — no card at all: no border, no background, no padding
                // box. Written for the closing "I agree to the Program Terms…" line, which is boilerplate
                // a reader ticks once on the way out, not a decision that needs the same visual weight as
                // an actual question. The bordered-card treatment below was built FOR the age-gate
                // checkbox specifically — "the one question that can end the application" needed
                // presence so it wouldn't read as a footnote — and that reasoning doesn't transfer to a
                // consent line at the bottom of the last step. Still a real focus ring on the glyph
                // itself, just nothing framing the row.
                'flex items-start gap-3 py-1'
              : `flex items-start gap-3 rounded-field border p-3.5 transition-all duration-base ease-out-bai peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(var(--cb-accent-rgb),0.30)] peer-focus-visible:ring-offset-2 ${
                  checked
                    ? ''
                    : err
                      ? 'border-status-danger bg-white'
                      : 'border-divider bg-white hover:border-stroke-warm hover:bg-surface'
                }`
          }
        >
          {/* mt-px nudges the 18px box onto the first line's optical centre — at the statement's 14px
              relaxed line-height, a flex-start box aligns to the line BOX rather than to the text,
              which reads a hair high. peer-focus-visible: ring moved onto the glyph itself for `subtle`,
              since there's no longer an outer card for the ring to sit on. */}
          <span
            style={checked ? { background: SELECTED_SOLID, borderColor: SELECTED_SOLID } : undefined}
            className={`mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-all duration-base ease-out-bai ${
              subtle ? 'peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(var(--cb-accent-rgb),0.30)] peer-focus-visible:ring-offset-2' : ''
            } ${checked ? 'text-white' : err ? 'border-status-danger bg-white' : 'border-stroke-warm bg-white'}`}
          >
            {checked && <TickIcon size={11} />}
          </span>
          <span className={`text-[14px] leading-relaxed ${checked ? 'text-ink-heading' : 'text-ink-body-2'}`}>
            {children}
          </span>
        </span>
      </label>
      <FieldError>{err}</FieldError>
    </div>
  )
}
