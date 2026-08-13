'use client'

import { Check } from './icons'
import { LABEL } from './fieldClasses'
import { FieldError } from '../forms'

// SINGLE-select chips. The visual treatment is lifted wholesale from the campaign form's action
// chips (brands/campaign/Steps.tsx) rather than re-invented, because the designer's 2026-08-11
// correction there — "selected is not a CTA" — applies identically here: a 10% iris wash, iris ink,
// an iris hairline and a small check. Not a gradient pill with a brand shadow, which would put four
// primary-looking buttons directly above the form's actual primary.
//
// The one real difference from those chips is the INPUT TYPE, and it is the whole reason this is a
// separate component rather than a prop on that one: radio, not checkbox. Every question this drives
// has exactly one true answer ("Windows" or "macOS", "Yes" or "No", one RAM figure), and a group of
// checkboxes tells a screen reader the opposite — that any combination is allowed. A shared `name`
// per group is also what gives keyboard users arrow-key navigation for free; a checkbox row makes
// them Tab through every option.
//
// The check occupies its slot whether shown or not, so choosing an option doesn't widen its chip and
// shuffle the ones beside it. Same fixed-slot trick as the campaign chips and SelectField's rows.
export default function ChoiceGroup({
  label,
  hint,
  name,
  value,
  options,
  onChange,
  err,
}: {
  label: string
  /** Sits under the chips, and gives way to the error rather than stacking with it. */
  hint?: string
  /** Must be unique on the page — it's the radio group's identity, not a display string. */
  name: string
  value: string
  options: readonly string[]
  onChange: (v: string) => void
  err?: string
}) {
  return (
    // A fieldset rather than a div, so the group carries ONE accessible name instead of the reader
    // meeting four unrelated radios with no idea what question they answer.
    <fieldset>
      <legend className={LABEL}>{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o === value
          return (
            // The radio is sr-only, so keyboard focus has nothing visible to land on unless the
            // ring is forwarded to the chip — hence peer + peer-focus-visible. Without it the row
            // is keyboard-operable but invisibly so, which is worse than not being operable.
            <label key={o} className="cursor-pointer select-none">
              <input
                type="radio"
                name={name}
                checked={on}
                onChange={() => onChange(o)}
                className="peer sr-only"
              />
              <span
                className={`flex items-center gap-1.5 rounded-card border px-3 py-2 text-[13px] font-medium transition-all duration-base ease-out-bai peer-focus-visible:ring-2 peer-focus-visible:ring-iris/30 peer-focus-visible:ring-offset-2 ${
                  on
                    ? 'border-[rgba(var(--bai-iris-rgb),0.35)] bg-[rgba(var(--bai-iris-rgb),0.07)] text-iris'
                    : err
                      ? 'border-status-danger text-ink-body-2'
                      : 'border-divider text-ink-muted hover:border-stroke-warm hover:text-ink-body-2'
                }`}
              >
                <span className="flex w-3 justify-center">{on && <Check size={11} />}</span>
                {o}
              </span>
            </label>
          )
        })}
      </div>
      {err ? (
        <FieldError>{err}</FieldError>
      ) : (
        hint && <span className="mt-1.5 block text-[11px] text-ink-muted">{hint}</span>
      )}
    </fieldset>
  )
}
