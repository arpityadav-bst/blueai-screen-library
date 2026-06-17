'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// Themed dropdown (replaces the native <select>). Pill trigger (selected icon + value) + a rounded
// menu PORTALED to <body> so it can't be clipped by the hero's overflow:hidden; positioned fixed at
// the trigger, closes on outside-click / Escape / scroll. Rows: [shape icon · name · ratio] + check.
export type SelectOption = { value: string; label?: string; hint?: string; icon?: ReactNode }

export function CreatorSelect({ value, options, onChange, icon, label, heading }: {
  value: string
  options: readonly SelectOption[]
  onChange: (v: string) => void
  icon?: ReactNode
  label: string
  heading?: string
}) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggle = () => {
    if (!open) {
      const r = triggerRef.current?.getBoundingClientRect()
      if (r) setCoords({ top: r.bottom + 6, left: r.left, width: r.width })
    }
    setOpen((o) => !o)
  }

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onScroll = () => setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open])

  const current = options.find((o) => o.value === value)
  const triggerIcon = current?.icon ?? icon

  return (
    <div className="cr-select">
      <button
        ref={triggerRef} type="button" className="cr-model cr-select-trigger"
        aria-haspopup="listbox" aria-expanded={open} aria-label={label} onClick={toggle}
      >
        {triggerIcon && <span className="cr-select-ic" aria-hidden="true">{triggerIcon}</span>}
        <span className="cr-select-val">{value}</span>
        <svg className={`cr-select-chev${open ? ' is-open' : ''}`} viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && coords && createPortal(
        <div
          ref={menuRef} className="cr-select-menu" role="listbox" aria-label={label}
          style={{ position: 'fixed', top: coords.top, left: coords.left, minWidth: Math.max(coords.width, 200) }}
        >
          {heading && <p className="cr-select-head">{heading}</p>}
          {options.map((o) => (
            <button
              type="button" key={o.value} role="option" aria-selected={o.value === value}
              className={`cr-select-opt${o.value === value ? ' is-sel' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false) }}
            >
              <span className="cr-opt-left">
                {o.icon && <span className="cr-opt-ic" aria-hidden="true">{o.icon}</span>}
                <span className="cr-opt-label">{o.label ?? o.value}</span>
                {o.hint && <span className="cr-opt-hint">{o.hint}</span>}
              </span>
              {o.value === value && (
                <svg className="cr-opt-check" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
              )}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}
