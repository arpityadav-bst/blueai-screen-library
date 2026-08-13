'use client'

import { useEffect, useRef, useState } from 'react'
import { useApply } from './ApplyState'

// The signed-in account control in the header: a minimal trigger that opens a popover menu with Log
// out. Structure and behaviour follow blueai-desktop's kebab menu, which the designer named as the
// reference (read-only — nothing in that tree was touched, and this is not a VDA pass).
//
// WHAT WAS BORROWED, and the numbers are that file's, translated from its dark shell to this light
// marketing surface rather than copied as literals:
//   · TRIGGER HOVER. `.bai-icbtn` is a bare transparent control that grows a background on hover
//     (`background: var(--bai-pill)`) and lifts its icon colour to `--bai-text-hi`, over
//     `transition: background/color var(--bai-t-150)`. Here that is --cb-hover + ink-heading at
//     150ms. The previous version of this chip had NO hover state at all, which is what made it read
//     as a label rather than a control.
//   · OFFSET. `.bai-menu` sits at `calc(100% + 6px)` from its trigger. Same 6px here — but TOP, not
//     bottom: that menu opens upward because it lives at the bottom of the app window, and this one
//     hangs off a sticky header at the top of the page. The offset is the borrowed part, not the
//     direction.
//   · SURFACE. Panel background + 1px hairline + radius + a soft drop shadow + 4px of padding, with
//     ~2px between items — `.bai-menu`'s own recipe.
//   · ITEM HOVER. `.bai-menu-item:hover { background: var(--bai-hover-acc) }` — every row is a full
//     hover target with its own rounding inside the panel's padding, not bare text.
//
// The chip is deliberately NOT a card, a pill with a border, or a CTA: in blueai-desktop the account
// control is the quietest thing in its row, and it earns its presence on hover. Same here — over the
// hero it must not compete with the page's own primary action.
export default function AccountMenu() {
  const { account, signOut } = useApply()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Outside-click and Escape, both bound only while open — a listener that outlives the menu it
  // closes is how a page ends up swallowing unrelated clicks. Escape returns focus to the trigger;
  // an outside click must not, or it would yank focus off whatever was just clicked.
  useEffect(() => {
    if (!open) return
    // pointerdown, not mousedown — Popover.tsx already does this and explains why. On touch,
    // mousedown is a SYNTHESIZED event fired after touchend, and iOS Safari withholds it from targets
    // it considers non-clickable, so tapping plain page copy could leave this menu open with no way
    // out short of a keyboard Escape.
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
    <div ref={wrapRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Account: ${account.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        // duration-base is this site's 150ms, matching --bai-t-150 on the reference control.
        className="flex min-h-[44px] items-center gap-2 rounded-pill py-2 pl-2 pr-3 text-ink-muted transition-colors duration-base ease-out-bai hover:bg-[var(--cb-hover)] hover:text-ink-heading active:bg-[var(--cb-hover)]"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-circle bg-bai-gradient text-[10px] font-bold text-white">
          {account.initials}
        </span>
        {/* The name hides below sm rather than shrinking: the avatar alone identifies the session, and
            at that width the header is already down to the wordmark and this control. */}
        <span className="hidden text-[14px] font-medium sm:block">{account.name}</span>
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
          className={`shrink-0 transition-transform duration-base ease-out-bai ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9.5l6 6 6-6" />
        </svg>
      </button>

      {open && (
        // z-[60] clears the sticky header's own z-50. Not portaled: the header is not an overflow-
        // hidden container (unlike the heroes, which is why Modal has to portal), so there is nothing
        // here to escape from and a portal would only cost the anchoring.
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-[calc(100%+6px)] z-[60] flex w-[196px] flex-col rounded-field border border-divider bg-white p-1.5 shadow-float"
        >
          {/* NO DIVIDER, AND NO NAME (designer, 2026-08-13). Two bits of chrome removed for one reason
              each. The name was already sitting in the trigger two pixels above this panel, so the menu
              was printing it twice. And a rule between two items in a 196px panel is a lot of structure
              to separate a label from the only thing you can click — the space does that on its own,
              which is what makes this read as quiet rather than as a small dialog.
              What is left is the one thing the trigger genuinely cannot show: which account. */}
          <div className="px-2.5 pb-2 pt-1">
            <span className="block truncate text-[11.5px] text-ink-muted">{account.email}</span>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              signOut()
            }}
            className="flex min-h-[44px] items-center gap-2 rounded-card px-2.5 py-3 text-left text-[13px] text-ink-body-2 transition-colors duration-fast ease-out-bai hover:bg-[var(--cb-hover)] hover:text-ink-heading active:bg-[var(--cb-hover)]"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
              <path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5v13A1.5 1.5 0 0 1 18.5 20H15M10 8l-4 4 4 4M6 12h9" />
            </svg>
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
