'use client'

import { useEffect, useRef, useState } from 'react'
import Popover, { type CloseReason } from './Popover'
import { CalendarGlyph, ChevronDown } from './icons'
import { LABEL, TRIGGER } from './fieldClasses'
import { FieldError, withErr } from '../forms'

// A calendar popover instead of <input type="date">. Same two reasons as the dropdown: the native
// control is OS chrome that cb-field-strong can't reach, and its own picker button crowds the right
// edge. blueai-desktop reached the same conclusion in the same words — its stylesheet notes a
// native input "still looked like plain OS chrome" before the custom calendar replaced it.
//
// en-GB explicitly, not the visitor's locale: "12 Aug 2026" is unambiguous everywhere, where a
// numeric format silently means two different days on either side of the Atlantic. A fixed locale
// also keeps the output deterministic instead of varying by who's looking.
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

  function close(reason: CloseReason) {
    setOpen(false)
    setView(null)
    if (reason === 'escape') triggerRef.current?.focus()
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
              empty date field reads as empty rather than as pre-filled. cb-tabular keeps the digits
              from shuffling the layout as the day changes. */}
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
          <Popover anchor={triggerRef} onClose={close} align={align} className="w-[268px] p-4">
            <Calendar
              value={value}
              min={min ?? null}
              view={view}
              onView={setView}
              onPick={(d) => {
                onChange(d)
                setOpen(false)
                setView(null)
                triggerRef.current?.focus()
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
  const gridRef = useRef<HTMLDivElement>(null)
  // Everything time-derived lives in here, and this only ever renders inside an open popover — so
  // no server-rendered markup depends on what day it is.
  const now = new Date()
  const today = dayKey(now)
  const floor = min ? dayKey(min) : null
  const month = view ?? new Date((value ?? min ?? now).getFullYear(), (value ?? min ?? now).getMonth(), 1)

  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  // Always 42 cells (6 weeks), never 35: a month-length-dependent grid makes the popover jump
  // taller and shorter as you page through it, which is more distracting than one quiet row.
  const cells = Array.from({ length: 42 }, (_, i) => new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay() + i))

  const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1)
  // Nothing before the floor is selectable, so paging to those months is a dead end.
  const canGoBack = !min || dayKey(new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0)) >= floor!

  // Same reason as the dropdown's roving focus: the calendar portals out of the dialog, so it sits
  // outside the dialog's focus trap and Tab can't reach it. Arrows walk the grid — ±1 for a day,
  // ±7 for a week, which is the shape the grid already has.
  //
  // Where focus STARTS: the selected day, else today, else the first selectable one. Marked with
  // data-autofocus and actioned by Popover, because on the popover's first render it is
  // `visibility: hidden` for the measure pass and focus() there is a no-op.
  const selectable = (d: Date) => !(floor !== null && dayKey(d) < floor)
  const focusKey = (() => {
    if (value && cells.some((c) => dayKey(c) === dayKey(value))) return dayKey(value)
    const t = cells.find((c) => dayKey(c) === today && selectable(c))
    if (t) return today
    // The 1st of the month ON SCREEN, before the grid's first selectable cell. Both are "the
    // earliest option", but the grid's first cell usually belongs to the PREVIOUS month — paging
    // forward to September and landing on 30 August is not where someone who just pressed Next
    // expects to be.
    const inMonth = cells.find((c) => c.getMonth() === month.getMonth() && selectable(c))
    if (inMonth) return dayKey(inMonth)
    const f = cells.find(selectable)
    return f ? dayKey(f) : null
  })()

  // Paging months replaces every cell, so the focused button is removed from the DOM and focus
  // falls to <body> — which silently kills the arrow keys. data-autofocus can't cover this: the
  // popover is already placed, so Popover's one-shot effect has run. Re-anchor here instead.
  const monthStamp = `${month.getFullYear()}-${month.getMonth()}`
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const days = dayEls(gridRef)
    ;(days.find((d) => d.dataset.autofocus !== undefined) ??
      days.find((d) => !(d as HTMLButtonElement).disabled))?.focus()
  }, [monthStamp])

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

      <div ref={gridRef} className="mt-1.5 grid grid-cols-7 gap-y-0.5" onKeyDown={(e) => roveDays(e, gridRef)}>
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
              data-today={k === today ? 'y' : undefined}
              {...(k === focusKey ? { 'data-autofocus': true } : {})}
              aria-current={selected ? 'date' : undefined}
              aria-label={fmtDate(d)}
              onClick={() => onPick(d)}
              // 32x32 fixed square, never a percentage: a day cell whose size tracks the popover
              // width turns rounded-circle into an ellipse the moment the two disagree.
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-circle text-[13px] tabular-nums outline-none transition-colors duration-fast ease-out-bai focus-visible:ring-2 focus-visible:ring-iris/40 ${
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

function dayEls(ref: React.RefObject<HTMLDivElement | null>) {
  return Array.from(ref.current?.querySelectorAll<HTMLElement>('button') ?? [])
}

function roveDays(e: React.KeyboardEvent, ref: React.RefObject<HTMLDivElement | null>) {
  const step =
    e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowDown' ? 7 : e.key === 'ArrowUp' ? -7 : 0
  if (step === 0) return
  e.preventDefault()
  const days = dayEls(ref)
  const i = days.indexOf(document.activeElement as HTMLElement)
  if (i < 0) return
  // Walk past disabled cells in the direction of travel rather than stopping dead on one — the
  // past days at the start of the floor month would otherwise be a wall.
  for (let n = i + step; n >= 0 && n < days.length; n += step > 0 ? 1 : -1) {
    if (!(days[n] as HTMLButtonElement).disabled) {
      days[n].focus()
      return
    }
  }
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
