'use client'

import { CBButton } from './Button'
import { useCBModal, type ModalKind } from './ModalHost'

// Client triggers for the popups. Two shapes, because the CTAs they replace were two shapes:
// a real button and the hero's quiet text link under it.
//
// ModalCTA renders CBButton rather than re-styling one — CBButton already spreads
// ButtonHTMLAttributes, so onClick was always available; it just needed a client component to be
// called from. Anything that changes about the site's primary pill still changes here for free.

export function ModalCTA({
  kind,
  children,
  variant,
  size,
  className,
}: {
  kind: ModalKind
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'lg'
  className?: string
}) {
  const { open } = useCBModal()
  return (
    <CBButton variant={variant} size={size} className={className} onClick={() => open(kind)}>
      {children}
    </CBButton>
  )
}

/**
 * The quiet secondary action — a <button> wearing a link's clothes. It is NOT an <a>: it navigates
 * nowhere now, and an anchor with no href is a keyboard trap dressed as a link.
 */
export function ModalTextLink({ kind, children }: { kind: ModalKind; children: React.ReactNode }) {
  const { open } = useCBModal()
  return (
    <button
      type="button"
      onClick={() => open(kind)}
      className="text-[13px] font-normal text-ink-muted underline decoration-1 underline-offset-4 opacity-70 transition-opacity duration-base ease-out-bai hover:text-ink-heading hover:opacity-100"
    >
      {children}
    </button>
  )
}
