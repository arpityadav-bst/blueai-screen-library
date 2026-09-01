'use client'

import { LABEL } from '../../controls/fieldClasses'
import { FieldError, withErr } from '../../forms'

// Split out of Steps.tsx (2026-08-31) when step 3's country row grew chips and pushed that file
// past the 300-line ceiling. Same component, new address; StepTwo is still its only consumer.
//
// The $ is a prefix AFFIX, not typed content, so it sits at placeholder weight (cb-field-affix)
// and the SHELL carries the border, which is why cb-field-strong is on the wrapper here and the
// inner input is transparent and borderless. cb-nospin removes the native number spinners: they
// paint hard against the right edge, the same crowding the custom chevron was built to avoid.
export default function Money({
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
