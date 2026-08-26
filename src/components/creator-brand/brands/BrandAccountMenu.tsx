'use client'

import { useEffect, useRef, useState } from 'react'
import { useBrandSession } from './BrandSession'

// The signed-in BRAND account control in the header (2026-08-18, FE review: a signed-in brand had
// no way to reach its campaigns and no Log out anywhere on the site). Trigger, popover, offset,
// surface and outside-click/escape handling are all the creators' AccountMenu.tsx recipe; read that
// file for where each number comes from. Two overlays sharing one recipe on purpose, not one shared
// component: the creators' menu renders a mock now.gg account with a fixed identity, this one
// renders whatever the sign-in gate captured (a work email, or nothing for the Google stub), and
// it carries a second row the creators' menu has no equivalent of, the campaigns dashboard link.
//
// TWO ROWS, LEFT-ALIGNED, unlike the creators' single centred Log out: with two actionable rows
// this reads as a menu list, so both rows take MobileMenu's own item treatment (full-width hover
// target, icon + label flush left) rather than the lone-button centring AccountMenu justified for
// exactly one row.
export default function BrandAccountMenu() {
  const { email, signOut } = useBrandSession()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // The dashboard (campaign-report.html) derives its chip from the same stored email the same way:
  // local part for the name, its first two letters for the avatar, "Your brand" / BR when the
  // Google stub left no email. Matching its derivation keeps one visitor one identity across the
  // marketing page and the dashboard.
  const handle = email ? email.split('@')[0] : null
  const initials = handle ? handle.slice(0, 2).toUpperCase() : 'BR'

  // Outside-click and Escape, bound only while open. Same listeners, same reasoning as AccountMenu:
  // pointerdown rather than mousedown for iOS Safari, Escape returns focus to the trigger, an
  // outside click must not steal focus from whatever was clicked.
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
    <div ref={wrapRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Agency account: ${handle ?? 'your agency'}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[44px] items-center gap-2 rounded-pill py-2 pl-2 pr-3 text-ink-muted transition-colors duration-base ease-out-bai hover:bg-[var(--cb-hover)] hover:text-ink-heading active:bg-[var(--cb-hover)]"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-circle bg-bai-gradient text-[10px] font-bold text-white">
          {initials}
        </span>
        {/* Name hides below sm rather than shrinking, same as the creators' chip: the avatar alone
            identifies the session at widths where the header is down to the wordmark and this. */}
        <span className="hidden text-[14px] font-medium sm:block">{handle ?? 'Your agency'}</span>
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
        // z-[60] clears the sticky header's z-50; not portaled, the header clips nothing. Wider than
        // the creators' 196px because a work email is longer than a person's name; still truncated.
        <div
          role="menu"
          aria-label="Agency account"
          className="absolute right-0 top-[calc(100%+6px)] z-[60] flex w-[224px] flex-col gap-0.5 rounded-field border border-divider bg-white p-1.5 shadow-float"
        >
          {/* The one thing the trigger cannot show: the full account identity. No email exists for
              the Google stub, so say what the session is instead of printing an empty line. */}
          <div className="px-2.5 pb-2 pt-1">
            <span className="block truncate text-[11.5px] text-ink-muted">{email ?? 'Signed in with Google'}</span>
          </div>
          <a
            role="menuitem"
            href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/creator-brand/campaign-report.html`}
            onClick={() => setOpen(false)}
            className="flex min-h-[44px] items-center gap-2 rounded-card px-2.5 text-[13px] text-ink-body-2 transition-colors duration-fast ease-out-bai hover:bg-[var(--cb-hover)] hover:text-ink-heading active:bg-[var(--cb-hover)]"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
              <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 9h16M9 9v11" />
            </svg>
            Your campaigns
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              signOut()
            }}
            className="flex min-h-[44px] items-center gap-2 rounded-card px-2.5 py-3 text-[13px] text-ink-body-2 transition-colors duration-fast ease-out-bai hover:bg-[var(--cb-hover)] hover:text-ink-heading active:bg-[var(--cb-hover)]"
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
