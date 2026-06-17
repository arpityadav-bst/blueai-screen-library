'use client'
import { ReactNode, useEffect } from 'react'

// Product DS — modal sheet (header + close + Escape) and a compact confirm dialog.
// Positioned absolute within the product frame (the route shell is `relative`).
export function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-[rgba(var(--bai-ink-rgb),0.5)] p-5 pb-20"
    >
      <div className="max-h-[88%] w-full max-w-[360px] overflow-y-auto rounded-field bg-canvas shadow-overlay">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-divider bg-canvas px-5 py-4">
          <h2 className="text-h3 font-semibold text-ink-heading">{title}</h2>
          <button
            onClick={onClose} aria-label="Close"
            className="rounded-card p-1 text-ink-muted transition-colors duration-fast hover:bg-surface hover:text-ink-body focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, title, body, confirmLabel = 'Confirm', danger, onCancel, onConfirm }: {
  open: boolean; title: string; body: string; confirmLabel?: string; danger?: boolean; onCancel: () => void; onConfirm: () => void
}) {
  if (!open) return null
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
      className="absolute inset-0 z-[60] flex items-center justify-center bg-[rgba(var(--bai-ink-rgb),0.45)] p-6"
    >
      <div className="w-full max-w-[340px] rounded-field bg-canvas p-5 shadow-overlay">
        <h2 className="mb-2 text-lg font-bold text-ink-heading">{title}</h2>
        <p className="mb-5 text-base leading-snug text-ink-muted">{body}</p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className="flex-1 rounded-card border border-divider bg-canvas py-2.5 text-base font-semibold text-ink-body transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 rounded-card py-2.5 text-base font-bold text-white transition-[filter] hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${danger ? 'bg-status-danger focus-visible:outline-status-danger' : 'bg-accent focus-visible:outline-accent'}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
