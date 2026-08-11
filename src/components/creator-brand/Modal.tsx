'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import CTAGrid from './CTAGrid'

// ONE dialog primitive for all four of this site's popups (campaign form, pricing table, waitlist,
// handle lookup). Two visual variants because the site genuinely has two surfaces and the designer
// asked the waitlist popup to carry "the same grid lines and colors" as the closing band:
//
//   light — white card on the marketing DS. Forms and tables.
//   band  — the dark bg-cta-band + receding CTAGrid, i.e. CTABand's own treatment lifted into a
//           dialog. NOT a re-implementation: it renders the same CTAGrid component the section
//           does, so the grid can't drift between the two.
//
// PORTALS TO document.body, and that isn't optional here: both heroes are
// `overflow-hidden` sections (they crop their own edge cards), so a dialog rendered in the tree
// under a CTA that lives inside one would be clipped by it.
//
// THE OVERLAY SCROLLS, NOT THE PANEL. A panel with its own overflow-y:auto would clip the
// campaign form's date-picker and country dropdown the moment either opened near the panel's
// bottom edge — the exact problem blueai-desktop had to portal its picker out of a subpane to
// solve. Here the scroll container is the full-viewport overlay instead, so a popover only ever
// meets the viewport edge, which is the boundary its own flip logic already measures against.

type Variant = 'light' | 'band'

const PANEL: Record<Variant, string> = {
  light: 'bg-white border border-stroke-warm',
  band: 'bg-cta-band',
}

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-[580px]',
  lg: 'max-w-[720px]',
  xl: 'max-w-[1040px]',
}

// Anything focusable, minus things a trap should skip.
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Modal({
  open,
  onClose,
  variant = 'light',
  size = 'md',
  label,
  children,
}: {
  open: boolean
  onClose: () => void
  variant?: Variant
  size?: keyof typeof SIZES
  /** Accessible name for the dialog — required, since none of these have a fixed title. */
  label: string
  children: ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreTo = useRef<HTMLElement | null>(null)
  // Portals need a client-side document; this keeps the first server pass rendering nothing.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Scroll lock, with the scrollbar's width handed back as padding — without it, hiding the
  // page's scrollbar widens the layout by ~15px and everything behind the scrim jumps sideways
  // as the dialog opens.
  useEffect(() => {
    if (!open) return
    const gap = window.innerWidth - document.documentElement.clientWidth
    const prev = { overflow: document.body.style.overflow, pad: document.body.style.paddingRight }
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    return () => {
      document.body.style.overflow = prev.overflow
      document.body.style.paddingRight = prev.pad
    }
  }, [open])

  // Focus moves in on open and back to the trigger on close. Without the restore, closing a
  // dialog opened from a mid-page CTA drops the caret at the top of the document, and the next
  // Tab starts the page over.
  //
  // THE PANEL, not the first focusable — and that's a correction, not a preference. Focusing the
  // first focusable put the caret on the CLOSE button (it's rendered before the children), which
  // both buried the lede and silently killed the waitlist input's autoFocus: React implements
  // autoFocus as an imperative focus() during commit, and this effect ran after it and took it
  // back. Panel-first also avoids the campaign form's opening focus landing on a progress-rail
  // segment. A dialog that wants a specific field focused marks it `data-autofocus` — an explicit
  // opt-in beats guessing from DOM order, and unlike the autoFocus prop it survives being read
  // back out of the DOM.
  useEffect(() => {
    if (!open) return
    restoreTo.current = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    const wanted = panel?.querySelector<HTMLElement>('[data-autofocus]')
    ;(wanted ?? panel)?.focus()
    return () => restoreTo.current?.focus?.()
  }, [open])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      // Trap: a dialog you can Tab out of leaves keyboard users driving the page behind the
      // scrim, which they can't see.
      const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
      if (items.length === 0) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      } else if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      }
    },
    [onClose]
  )

  if (!mounted || !open) return null

  return createPortal(
    // z-[100] clears the sticky header (z-50). The state toggler deliberately sits above this —
    // see PreviewToggler.tsx for why a design-handoff control outranks the prototype's own chrome.
    <div
      className="cb-scope fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      {/* The scrim is its own element rather than a background on the scroll container, so a
          click lands on IT and not on the padding around the panel — closing a dialog because
          you clicked 2px of dead space beside it is indistinguishable from a misfire. */}
      <div className="cb-scrim fixed inset-0 bg-[rgba(16,18,34,0.58)] backdrop-blur-[3px]" onClick={onClose} />

      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          ref={panelRef}
          tabIndex={-1}
          className={`cb-modal shadow-overlay relative w-full overflow-hidden rounded-credits outline-none ${PANEL[variant]} ${SIZES[size]}`}
        >
          {/* Its own id prefix — the closing band's CTAGrid is on the page at the same time, and
              four duplicated SVG ids is a bug waiting for someone to change one band's geometry. */}
          {variant === 'band' && <CTAGrid idPrefix="cbGridModal" />}
          {/* Close sits above the grid in the band variant, hence the z. Its hit area is 36px
              while the glyph is 14 — the smallest control in the dialog shouldn't also be the
              hardest to hit. */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`absolute right-3.5 top-3.5 z-20 flex h-9 w-9 items-center justify-center rounded-circle transition-colors duration-base ease-out-bai ${
              variant === 'band'
                ? 'text-white/50 hover:bg-white/10 hover:text-white'
                : 'text-ink-muted hover:bg-canvas hover:text-ink-heading'
            }`}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  )
}
