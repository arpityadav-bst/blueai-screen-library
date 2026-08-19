'use client'

import { useEffect, useRef, useState } from 'react'
import { useCrx } from './CrxState'

// The signed-in account control in the header: initials avatar + name + chevron opening a popover
// with the email line and Log out. Re-skinned from the frozen creator-brand tree's
// creators/AccountMenu.tsx (read-only reference, never imported) into this page's kit language:
// the trigger rides .crx-cta's quiet state (dim ink, hover to white — the exact "earns its
// presence on hover" behaviour the original built by hand), and the popover IS .crx-menu, the
// same surface the header's mobile menu uses.
//
// Decisions carried over from the original, condensed:
//   · The chip is NOT a card/pill/CTA — the quietest thing in its row; it must not compete with
//     the page's own primary action.
//   · The menu prints no name and no divider: the name already sits in the trigger two pixels
//     above, and in a small panel the space between two rows separates them on its own. The one
//     thing the trigger cannot show — which account — is the email line.
//   · Escape returns focus to the trigger; an outside click must NOT, or it would yank focus off
//     whatever was just clicked. pointerdown, not mousedown: on touch, mousedown is synthesized
//     after touchend and iOS Safari withholds it from "non-clickable" targets, so tapping plain
//     page copy could leave the menu open. Both listeners bind only while open.
export default function AccountMenu() {
  const { account, signOut } = useCrx()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    // .crx-acct: the positioned anchor for the popover (needs position:relative in the kit — see
    // the build report; until then .crx-menu falls back to anchoring on the fixed header, exactly
    // where the mobile menu already opens, so nothing breaks unstyled).
    <div ref={wrapRef} className="crx-acct">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Account: ${account.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="crx-cta crx-acct-chip"
      >
        <span className="crx-acct-avatar" aria-hidden="true">
          {account.initials}
        </span>
        <span className="crx-acct-name">{account.name}</span>
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          // Genuinely dynamic value — state-driven, so inline is the page convention's exception.
          style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.18s ease' }}
        >
          <path d="M6 9.5l6 6 6-6" />
        </svg>
      </button>

      {open && (
        // Not portaled: the header is fixed, not an overflow trap, so there is nothing to escape
        // from and staying in the tree keeps .crx-menu's tokens resolving (the original's own
        // reasoning). .crx-menu already carries the surface, rows, hover and active states.
        <div role="menu" aria-label="Account" className="crx-menu">
          <p className="crx-acct-email">{account.email}</p>
          <button
            type="button"
            role="menuitem"
            className="crx-acct-out"
            onClick={() => {
              setOpen(false)
              signOut()
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5v13A1.5 1.5 0 0 1 18.5 20H15M10 8l-4 4 4 4M6 12h9" />
            </svg>
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
