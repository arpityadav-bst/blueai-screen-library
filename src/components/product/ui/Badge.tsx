import { ReactNode, ButtonHTMLAttributes } from 'react'

// Product DS — badge-family by role (taste rule: status=squared, pill=round, chip=selectable).
type Status = 'success' | 'warning' | 'danger' | 'info' | 'scheduled' | 'jobs'
const STATUS: Record<Status, string> = {
  success:   'bg-status-success-soft text-status-success-ink',
  warning:   'bg-status-warning-soft text-status-warning-ink',
  danger:    'bg-status-danger-soft text-status-danger-ink',
  info:      'bg-status-info-soft text-status-info-ink',
  scheduled: 'bg-status-scheduled-soft text-status-scheduled-ink',
  jobs:      'bg-status-jobs-soft text-status-jobs-ink',
}

// Squared status chip — job states, etc.
export function Badge({ status = 'info', children }: { status?: Status; children: ReactNode }) {
  return <span className={`inline-flex items-center rounded-badge px-2 py-0.5 text-2xs font-semibold ${STATUS[status]}`}>{children}</span>
}

// Round emphasis pill — Verified, counts. `tone` picks a status palette, else neutral.
export function Pill({ tone, className = '', children }: { tone?: Status; className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-2xs font-semibold ${tone ? STATUS[tone] : 'bg-surface text-ink-muted'} ${className}`}>
      {children}
    </span>
  )
}

// Selectable chip (reason chips, filters).
export function Chip({ selected, className = '', children, ...p }: { selected?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors duration-fast
        ${selected ? 'border-ink-heading bg-ink-heading text-white' : 'border-divider bg-canvas text-ink-body hover:bg-surface'}
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
      {...p}
    >
      {children}
    </button>
  )
}
