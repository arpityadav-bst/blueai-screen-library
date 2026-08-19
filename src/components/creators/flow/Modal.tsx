'use client'

import { useEffect, useRef, type ReactNode } from 'react'

// The /creators dialog primitive — the shell only. The kit (creators.css, flow-kit section) owns
// both rules this file consumes: .crx-modal-scrim (fixed inset, z-100, flex-centred, the site scrim
// rgba(5,6,15,.72) + 3px blur) and body.crx-lock (scroll lock). Children provide their own card —
// the sign-in dialog paints its own now.gg surface; kit-styled dialogs bring .crx-modal themselves.
//
// NO PORTAL, deliberately (vs the frozen creator-brand Modal.tsx, which had to portal past two
// overflow-hidden hero sections). This page has no overflow trap around any dialog trigger, and
// staying in the tree keeps the modal inside .crx so kit classes in children resolve their tokens —
// the exact caveat creators.css leaves against .crx-modal-scrim.
//
// SCRIM CLICK closes via a target === currentTarget check rather than a separate scrim element:
// the kit's scrim class IS the centring flex container, so a click on the panel bubbles here with a
// different target and is correctly ignored.
//
// crx-lock is shared with the boot intro (added on mount, removed at the intro's finish). Safe:
// no dialog can open during the intro — every trigger is inside the reveal-gated page chrome.
export default function Modal({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean
  onClose: () => void
  /** Accessible name for the dialog — required; the shell has no fixed title of its own. */
  label: string
  children: ReactNode
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const restoreTo = useRef<HTMLElement | null>(null)

  // Escape on the document, not the overlay — it works whatever the children did with focus.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Body scroll lock via the kit's namespaced class, plus a focus move-in/restore: closing a
  // dialog opened from a mid-page CTA must not drop the next Tab at the top of the document.
  useEffect(() => {
    if (!open) return
    document.body.classList.add('crx-lock')
    restoreTo.current = document.activeElement as HTMLElement | null
    overlayRef.current?.focus()
    return () => {
      document.body.classList.remove('crx-lock')
      restoreTo.current?.focus?.()
    }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      className="crx-modal-scrim"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {children}
    </div>
  )
}
