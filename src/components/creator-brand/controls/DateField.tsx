'use client'

import { useRef, useState } from 'react'
import Popover from './Popover'
import { CalendarGlyph, ChevronDown } from './icons'
import { LABEL, TRIGGER } from './fieldClasses'
import { FieldError, withErr } from '../forms'

// A calendar popover instead of <input type="date">. Same two reasons as the dropdown: the native
// control is OS chrome that cb-field-strong can't reach, and its own picker button crowds the
// right edge. blueai-desktop reached the same conclusion in the same words — its stylesheet notes
// a native input "still looked like plain OS chrome" before the custom calendar replaced it.
//
// en-GB explicitly, not the visitor's locale: "12 Aug 2026" is unambiguous everywhere, where a
// numeric format silently means two different days on either side of the Atlantic. Passing a fixed
// locale also keeps the output deterministic instead of varying by who's looking.
export function fmtDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Two letters, not one: an S-M-T-W-T-F-S row makes the two S columns and the two T columns
// guessing games.
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function dayKey(d: Date) {
  return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate()
}

export default function DateField({
  label,
  value,
  onChange,
  min,
  placeholder,
  align = 'left',
  err,
}: {
  label: string
  value: Date | null
  onChange: (d: Date) => void
  /** Earliest selectable day — today for the start date, the start date for the end date. */
  min?: Date | null
  placeholder: string
  align?: 'left' | 'right'
  err?: string
}) {
  const [open, setOpen] = useState(false)
  // The month on screen. null = "follow the data" (the selected day, else the floor, else today),
  // which is what should happen every time the picker is reopened after the floor moved. It only
  // becomes a real value once the user navigates months themselves.
  const [view, setView] = useState<Date | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  function close() {
    setOpen(false)
    setView(null)
    triggerRef.current?.focus()
  }

  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={withErr(TRIGGER, err)}
        >
          <CalendarGlyph size={15} className="shrink-0 text-iris" />
          {/* cb-field-affix is the placeholder weight the rest of the form's fields use, so an
              empty date field reads as empty rather than as pre-filled. cb-tabular keeps the
              digits from shuffling the layout as the day changes. */}
          <span className={value ? 'cb-tabular text-ink-heading' : 'cb-field-affix'}>
            {value ? fmtDate(value) : placeholder}
          </span>
          <ChevronDown
            size={14}
            className={`ml-auto shrink-0 text-ink-muted transition-transform duration-base ease-out-bai ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        {open && (
          <Popover onClose={close} align={align} className="w-[268px] p-4">
            <Calendar
              value={value}
              min={min ?? null}
              view={view}
              onView={setView}
              onPick={(d) => {
                onChange(d)
                close()
              }}
            />
          </Popover>
        )}
      </div>
      <FieldError>{err}</FieldError>
    </label>
  )
}

function Calendar({
  value,
  min,
  view,
  onView,
  onPick,
}: {
  value: Date | null
  min: Date | null
  view: Date | null
  onView: (d: Date) => void
  onPick: (d: Date) => void
}) {
  // Everything time-derived lives in here, and this only ever renders inside an open popover —
  // so no server-rendered markup depends on what day it is.
  const now = new Date()
  const today = dayKey(now)
  const floor = min ? dayKey(min) : null
  const month = view ?? new Date((value ?? min ?? now).getFullYear(), (value ?? min ?? now).getMonth(), 1)

  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  // Always 42 cells (6 weeks), never 35: a month-length-dependent grid makes the popover jump
  // taller and shorter as you page through it, which is far more distracting than one quiet row.
  const cells = Array.from({ length: 42 }, (_, i) => {
    return new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay() + i)
  })

  const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1)
  // Nothing before the floor is selectable, so paging to those months is a dead end.
  const canGoBack = !min || dayKey(new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0)) >= floor!

  return (
    <>
      <div className="flex items-center justify-between">
        <NavBtn label="Previous month" disabled={!canGoBack} onClick={() => onView(prevMonth)}>
          <ChevronDown size={14} className="rotate-90" />
        </NavBtn>
        <span className="text-[13px] font-bold text-ink-heading">
          {month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </span>
        <NavBtn label="Next month" onClick={() => onView(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
          <ChevronDown size={14} className="-rotate-90" />
        </NavBtn>
      </div>

      <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-label text-ink-muted">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="mt-1.5 grid grid-cols-7 gap-y-0.5">
        {cells.map((d) => {
          const k = dayKey(d)
          const outside = d.getMonth() !== month.getMonth()
          const disabled = floor !== null && k < floor
          const selected = !!value && k === dayKey(value)
          return (
            <button
              key={k}
              type="button"
              disabled={disabled}
              aria-current={selected ? 'date' : undefined}
              onClick={() => onPick(d)}
              // 32x32 fixed square, never a percentage: a day cell whose size tracks the popover
              // width turns rounded-circle into an ellipse the moment the two disagree.
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-circle text-[13px] tabular-nums transition-colors duration-fast ease-out-bai ${
                selected
                  ? 'bg-bai-gradient font-semibold text-white'
                  : disabled
                    ? 'cursor-not-allowed text-ink-muted/30'
                    : outside
                      ? 'text-ink-muted/45 hover:bg-canvas'
                      : k === today
                        ? 'font-bold text-iris hover:bg-canvas'
                        : 'text-ink-body-2 hover:bg-canvas'
              }`}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </>
  )
}

function NavBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-card text-ink-muted transition-colors duration-fast ease-out-bai hover:bg-canvas hover:text-ink-heading disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}
