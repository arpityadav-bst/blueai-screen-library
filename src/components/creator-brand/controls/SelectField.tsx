'use client'

import { useRef, useState } from 'react'
import Popover, { type CloseReason } from './Popover'
import { Check, ChevronDown } from './icons'
import { LABEL, TRIGGER } from './fieldClasses'
import { FieldError, withErr } from '../forms'

// A real floating dropdown, replacing the native <select>. Two reasons, in order of how much they
// matter: a native select can't carry cb-field-strong's hover/focus treatment (the OS draws it),
// and its arrow is painted hard against the right edge — the "arrow too close to the boundary" the
// designer flagged. Behaviour follows blueai-desktop's settings model picker, which the designer
// named as the reference: matches the field's width, opens 6px below, floats over everything,
// marks the current value, scrolls past ~5 rows with the scrollbar hidden.
//
// A native select still wins on mobile (the OS wheel beats any custom list on a touch screen).
// That's a trade being made knowingly — this is a design-handoff replica and the designer asked
// for the desktop-app interaction.
//
// FULL KEYBOARD SUPPORT IS NOT OPTIONAL HERE, and that's a consequence of the portal: the list
// renders outside the dialog, so it's outside the dialog's focus trap and Tab can no longer reach
// it. Roving focus over the options replaces that — arrows to move, Enter/Space to pick (they're
// real buttons), Escape to leave. Without this, portaling would have traded a visual clip for a
// keyboard dead end.
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
  const listRef = useRef<HTMLDivElement>(null)

  // Opening lands focus on the CURRENT value, not the first row — so arrowing starts from where the
  // reader already is instead of making them walk back to it. Marked with data-autofocus and
  // actioned by Popover: it can only be done after the popover has been placed, since the
  // measure pass renders it `visibility: hidden` and focus() there does nothing.
  // -1 (no current value) falls through to 0, the first row.
  const focusIdx = Math.max(0, options.indexOf(value))

  function close(reason: CloseReason) {
    setOpen(false)
    // Escape returns focus to the trigger; an outside click must not, or it would yank focus off
    // whatever the reader just clicked.
    if (reason === 'escape') triggerRef.current?.focus()
  }

  function pick(v: string) {
    onChange(v)
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
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
          <Popover anchor={triggerRef} onClose={close} className="p-1.5">
            {/* cb-thinscroll: the bar fades in on hover and back out when the pointer leaves
                (creator-brand.css). It replaced a fully hidden bar — which matched the reference
                picker, but a list that scrolls should say so. */}
            <div
              ref={listRef}
              role="listbox"
              aria-label={label}
              onKeyDown={(e) => rove(e, listRef)}
              className={`cb-thinscroll overflow-y-auto ${MAX_VISIBLE}`}
            >
              {options.map((o, i) => {
                const on = o === value
                return (
                  <button
                    key={o}
                    type="button"
                    role="option"
                    aria-selected={on}
                    {...(i === focusIdx ? { 'data-autofocus': true } : {})}
                    onClick={() => pick(o)}
                    // The hover fill was `bg-canvas`, i.e. white on white — no hover at all. The
                    // value is now blueai-desktop's own light-theme --bai-hover, the window this
                    // picker was modelled on. focus-visible gets the same fill so driving the list
                    // by keyboard shows the same row highlight the pointer does.
                    className={`flex min-h-[44px] w-full items-center gap-2 rounded-card px-2.5 py-3 text-left text-[13px] outline-none transition-colors duration-fast ease-out-bai hover:bg-[var(--cb-hover)] focus-visible:bg-[var(--cb-hover)] active:bg-[var(--cb-hover)] ${
                      on ? 'font-semibold text-ink-heading' : 'text-ink-body-2'
                    }`}
                  >
                    {/* Fixed-width marker slot, so the label column starts at the same x on every
                        row whether or not that row is the selected one. */}
                    <span className="flex w-3.5 shrink-0 justify-center text-[var(--cb-accent)]">
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

function optionEls(ref: React.RefObject<HTMLDivElement | null>) {
  return Array.from(ref.current?.querySelectorAll<HTMLElement>('[role=option]') ?? [])
}

/** Arrow/Home/End roving focus. Clamped rather than wrapping: on a 13-row list, jumping from the
 *  last item to the first reads as a glitch more often than as a feature. */
function rove(e: React.KeyboardEvent, ref: React.RefObject<HTMLDivElement | null>) {
  const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End']
  if (!keys.includes(e.key)) return
  e.preventDefault()
  const items = optionEls(ref)
  const i = items.indexOf(document.activeElement as HTMLElement)
  const next =
    e.key === 'ArrowDown' ? Math.min(items.length - 1, i + 1)
    : e.key === 'ArrowUp' ? Math.max(0, i - 1)
    : e.key === 'Home' ? 0
    : items.length - 1
  items[next]?.focus()
}
