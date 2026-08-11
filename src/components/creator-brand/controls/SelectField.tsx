'use client'

import { useRef, useState } from 'react'
import Popover from './Popover'
import { Check, ChevronDown } from './icons'
import { LABEL, TRIGGER } from './fieldClasses'
import { FieldError, withErr } from '../forms'

// A real floating dropdown, replacing the native <select>. Two reasons, in order of how much they
// matter: a native select can't carry cb-field-strong's hover/focus treatment (the OS draws it),
// and its arrow is painted hard against the right edge — the "arrow too close to the boundary"
// the designer flagged. Behaviour follows blueai-desktop's settings model picker, which the
// designer named as the reference: spans the field exactly, opens 6px below, floats over the
// form, marks the current value, scrolls past ~5 rows with the scrollbar hidden.
//
// A native select still wins on mobile (the OS wheel beats any custom list on a touch screen).
// That's a real trade being made knowingly here, not an oversight — this is a design-handoff
// replica and the designer asked for the desktop-app interaction.
const MAX_VISIBLE = 'max-h-[188px]'

export default function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
  err,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
  /** Shown at placeholder weight when `value` is empty — omit for a pre-defaulted select. */
  placeholder?: string
  err?: string
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  function pick(v: string) {
    onChange(v)
    setOpen(false)
    // Focus returns to the trigger, or a keyboard user is dumped at the top of the document
    // the moment the list they were driving unmounts.
    triggerRef.current?.focus()
  }

  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      {/* relative: Popover positions against this, and its outside-click test treats it as
          inside, so clicking the trigger toggles instead of closing-then-reopening. */}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault()
              setOpen(true)
            }
          }}
          className={withErr(TRIGGER, err)}
        >
          <span className={`truncate ${value ? 'text-ink-heading' : 'cb-field-affix'}`}>
            {value || placeholder}
          </span>
          <ChevronDown
            size={14}
            className={`ml-auto shrink-0 text-ink-muted transition-transform duration-base ease-out-bai ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        {open && (
          <Popover onClose={() => setOpen(false)} className="p-1.5">
            {/* cb-noscroll hides the scrollbar, as the reference picker does — the list is
                capped at ~5 rows so the cut-off row is itself the scroll affordance. */}
            <div role="listbox" aria-label={label} className={`cb-noscroll overflow-y-auto ${MAX_VISIBLE}`}>
              {options.map((o) => {
                const on = o === value
                return (
                  <button
                    key={o}
                    type="button"
                    role="option"
                    aria-selected={on}
                    onClick={() => pick(o)}
                    className={`flex w-full items-center gap-2 rounded-card px-2.5 py-2 text-left text-[13px] transition-colors duration-fast ease-out-bai hover:bg-canvas ${
                      on ? 'font-semibold text-ink-heading' : 'text-ink-body-2'
                    }`}
                  >
                    {/* Fixed-width marker slot, so the label column starts at the same x on
                        every row whether or not that row is the selected one. */}
                    <span className="flex w-3.5 shrink-0 justify-center text-iris">
                      {on && <Check size={12} />}
                    </span>
                    {o}
                  </button>
                )
              })}
            </div>
          </Popover>
        )}
      </div>
      <FieldError>{err}</FieldError>
    </label>
  )
}
