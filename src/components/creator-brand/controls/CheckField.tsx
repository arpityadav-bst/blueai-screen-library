'use client'

import { Check } from './icons'
import { FieldError } from '../forms'

// A single checkbox with its statement beside it — the age confirmation and the contact consent.
//
// THE BOX IS DRAWN, NOT NATIVE. A native checkbox is painted by the OS, so it can carry neither
// cb-field-strong's hover/focus treatment nor the iris fill every other selected control on this
// site uses — the same reason SelectField replaced the native <select>. The real input stays in the
// DOM (sr-only, `peer`) so it keeps its semantics, its label association and its focus behaviour;
// only the paint is ours.
//
// THE STATEMENT IS THE LABEL, and it sits at body weight rather than at the 12px muted weight the
// other fields' labels use. These two aren't labels for a value the reader supplies — they ARE the
// thing being agreed to, so they read as a sentence you tick, not as a caption over a control.
export default function CheckField({
  checked,
  onChange,
  err,
  children,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  err?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="flex cursor-pointer select-none items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        {/* mt-px nudges the 18px box onto the first line's optical centre — at the statement's
            14px/relaxed line-height, a flex-start box aligns to the line BOX rather than to the
            text, which reads a hair high. */}
        <span
          className={`mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-all duration-base ease-out-bai peer-focus-visible:ring-2 peer-focus-visible:ring-iris/30 peer-focus-visible:ring-offset-2 ${
            checked
              ? 'border-transparent bg-bai-gradient text-white'
              : err
                ? 'border-status-danger bg-white'
                : 'border-stroke-warm bg-white'
          }`}
        >
          {checked && <Check size={11} />}
        </span>
        <span className="text-[14px] leading-relaxed text-ink-body-2">{children}</span>
      </label>
      <FieldError>{err}</FieldError>
    </div>
  )
}
