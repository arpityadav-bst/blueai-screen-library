'use client'

import { useEffect, useState } from 'react'

// THE REVIEWER'S STATE SWITCH for the brand side (Appy, 2026-08-26: "I was able to view it once,
// then I'm not able to view it again").
//
// That is not a bug in the flow, it is the flow working: registration writes localStorage, so the
// second visit is a returning brand and the new-brand screens are unreachable. Every state after
// the first became write-once. The creators side solved this months ago with PreviewToggler; the
// brand side never had one because it only ever had two states, and it has four now.
//
// IT WRITES STORAGE AND RELOADS rather than holding React state. Two of the four screens live in the
// static dashboard (public/creator-brand/campaign-report.html), which shares nothing with this tree
// except those keys — a toggle that only flipped context here would be a switch that works on half
// the flow. Storage plus a reload is the one mechanism both surfaces already agree on.
//
// KEYS ARE RESTATED, NOT IMPORTED, and deliberately: BrandSession owns them for the app, and this is
// a dev tool that must be able to write them from outside the provider — including on the static
// page, where the provider does not exist. They are listed together here so the pairing is visible.
const K_EMAIL = 'cb-brand-email'
const K_REG = 'cb-brand-registered'
const K_APPROVED = 'cb-brand-approved'

const DASH = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/creator-brand/campaign-report.html`

type State = 'new' | 'registered' | 'approved'

const ROWS: { value: State; label: string; hint: string }[] = [
  { value: 'new', label: 'New agency', hint: 'Signed out. Create a campaign opens sign-in, then Register' },
  { value: 'registered', label: 'Registered, in review', hint: 'Dashboard shows the review screen' },
  { value: 'approved', label: 'Approved agency', hint: 'Dashboard shows campaigns' },
]

function read(): State {
  try {
    if (localStorage.getItem(K_APPROVED) === '1') return 'approved'
    if (localStorage.getItem(K_REG)) return 'registered'
  } catch {
    // Storage unavailable: 'new' is the honest fallback, same as the session provider's.
  }
  return 'new'
}

export default function BrandPreview() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<State>('new')
  // Read after mount, never during render — the same hydration rule BrandSession follows.
  useEffect(() => setState(read()), [])

  function apply(next: State) {
    try {
      if (next === 'new') {
        localStorage.removeItem(K_EMAIL)
        localStorage.removeItem(K_REG)
        localStorage.removeItem(K_APPROVED)
      } else {
        localStorage.setItem(K_EMAIL, 'you@acmegames.com')
        localStorage.setItem(K_REG, JSON.stringify({ name: 'Acme Games', email: 'you@acmegames.com' }))
        if (next === 'approved') localStorage.setItem(K_APPROVED, '1')
        else localStorage.removeItem(K_APPROVED)
      }
    } catch {
      // Nothing useful to do; the reload below will simply land on the unchanged state.
    }
    // A RELOAD, NOT A STATE FLIP. Half the flow is a separate document, and the two screens a
    // reviewer most wants to check (review, then campaigns) are both on it. Landing them on the
    // dashboard for the two signed-in states is the point of the switch, not a side effect.
    window.location.assign(next === 'new' ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/creator-brand/brands` : DASH)
  }

  if (!open) {
    return (
      <button type="button" className="cb-prev-fab" onClick={() => setOpen(true)} aria-label="Preview state">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <circle cx="12" cy="12" r="3.2" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 3.63 15a1.7 1.7 0 0 0-1.56-1H2a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 3.66 8a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 8 3.63h.08a1.7 1.7 0 0 0 1-1.56V2a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 20.37 8v.08a1.7 1.7 0 0 0 1.56 1H22a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="cb-prev" role="radiogroup" aria-label="Agency preview state">
      <button type="button" className="cb-prev-head" onClick={() => setOpen(false)} aria-expanded="true">
        Preview · agency state
      </button>
      {ROWS.map((r) => (
        <button
          key={r.value}
          type="button"
          role="radio"
          aria-checked={state === r.value}
          onClick={() => apply(r.value)}
          className={state === r.value ? 'cb-prev-row on' : 'cb-prev-row'}
        >
          <span className="cb-prev-label">{r.label}</span>
          <span className="cb-prev-hint">{r.hint}</span>
        </button>
      ))}
    </div>
  )
}
