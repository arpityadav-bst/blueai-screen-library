'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Arrow } from '@/components/Arrow'
import { useCBModal } from './ModalHost'
import { useApply } from './creators/ApplyState'
import { HEADER_NAV, OTHER, type NavAudience } from './nav'

// THE DESKTOP HEADER, COLLAPSED INTO ONE TRIGGER (designer, 2026-08-13) — below `lg` there's no
// room for a nav row AND a CTA side by side, so this is what the desktop header's own three pieces
// (HEADER_NAV, the cross-audience link, the primary CTA) become on a phone: one hamburger, one
// popover carrying all three. Not a new pattern — structure, offset, surface and outside-click/
// escape handling all borrow AccountMenu.tsx's own recipe, which already solved "a small menu
// anchored to this sticky header" once. Two overlays doing the same job with different code is
// how they drift apart the first time one gets a fix the other doesn't.
//
// NOT RENDERED for a signed-in creator, dashboard included (signedIn covers both — 2026-08-14):
// HeaderCTA already swaps the CTA for AccountMenu whenever signedIn is true, and AccountMenu is
// compact enough to stay on screen at every width rather than move behind a second tap. This
// component exists specifically to replace the CTA below `lg` — signed in, there is no CTA here to
// replace, so it renders nothing and AccountMenu carries on unchanged.
export default function MobileMenu({ active }: { active: NavAudience }) {
  const { open: openModal } = useCBModal()
  const { signedIn } = useApply()
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

  if (active === 'creators' && signedIn) return null

  // Same-page anchor scroll, same mechanism Header.tsx's own nav links use — close the menu first
  // so the reader sees the page move, not a popover sitting on top of it.
  function go(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={wrapRef} className="relative lg:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        ref={triggerRef}
        className="flex h-11 w-11 items-center justify-center rounded-pill text-ink-muted transition-colors duration-base ease-out-bai hover:bg-[var(--cb-hover)] hover:text-ink-heading active:bg-[var(--cb-hover)]"
      >
        {/* Two glyphs, swapped rather than morphed — same "it's a different state, render it
            plainly" call AccountMenu.tsx made for its own chevron, just without a rotation to
            animate between (a hamburger and a close mark share no strokes to tween between). */}
        {open ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        // z-[60] clears the sticky header's own z-50, same reasoning as AccountMenu's panel.
        <div
          role="menu"
          aria-label="Menu"
          className="absolute right-0 top-[calc(100%+6px)] z-[60] flex w-[230px] flex-col gap-0.5 rounded-field border border-divider bg-white p-1.5 shadow-float"
        >
          {/* HEADER_NAV, not the footer's full NAV — same scope the desktop nav row already
              carries (nav.ts's own note explains why the header is deliberately shorter than the
              footer). Translating the desktop header faithfully means giving mobile what desktop
              already has, not more. */}
          {HEADER_NAV[active].map((item) => (
            <a
              key={item.label}
              href={item.href}
              role="menuitem"
              onClick={(e) => go(e, item.href)}
              className="flex min-h-[44px] items-center rounded-card px-2.5 text-[14px] font-medium text-ink-body-2 transition-colors duration-fast ease-out-bai hover:bg-[var(--cb-hover)] hover:text-ink-heading"
            >
              {item.label}
            </a>
          ))}

          <Link
            href={`/creator-brand/${OTHER[active]}`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex min-h-[44px] items-center gap-1.5 rounded-card px-2.5 text-[14px] font-medium text-ink-body-2 transition-colors duration-fast ease-out-bai hover:bg-[var(--cb-hover)] hover:text-ink-heading"
          >
            {active === 'creators' ? 'For Brands' : 'For Creators'}
            <Arrow size={12} className="-rotate-45" />
          </Link>

          <div className="my-1 border-t border-divider" />

          {/* Same action HeaderCTA's desktop button opens — this popover replaces where that
              button would have shown, not what it does. */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              openModal(active === 'creators' ? 'signin' : 'campaign')
            }}
            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-pill bg-cta-gradient px-4 text-[14px] font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:shadow-cta-hover"
          >
            {active === 'creators' ? 'Apply Now' : 'Create a campaign'}
            <Arrow size={13} />
          </button>
        </div>
      )}
    </div>
  )
}
