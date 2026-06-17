import { HTMLAttributes } from 'react'

// Product DS — the one canonical surface card (unifies the 3 drifting recipes the audit found).
// Hairline-over-shadow per house style. Padding is the caller's choice.
export function Card({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-field border border-divider bg-canvas shadow-hairline ${className}`} {...props}>
      {children}
    </div>
  )
}
