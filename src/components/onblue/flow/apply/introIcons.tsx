// Glyphs for StepIntro's "About the program" points — SVGs ported verbatim from
// creator-brand/creators/apply/introIcons.tsx. Same conventions as choiceIcons.tsx so the whole
// form's icon language stays one family: 24 viewBox, currentColor stroke (which is what lets the
// kit's .crx-intro-ic iris tint colour them for free), round caps/joins, aria-hidden.
type P = { size?: number; className?: string }
const box = (size: number, className: string) => ({
  viewBox: '0 0 24 24',
  width: size,
  height: size,
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  className,
})

/** The rollout seam ("access starts on your PC, phones and robots come next") — two waves, the second still faint.
    UNUSED SINCE 2026-08-24: the row it drew was cut from StepIntro when the apply flow moved under
    the programs home, which never sells other machines. Kept, not deleted, and parked here rather
    than left silently orphaned — StepIntro's own note says the row returns if the multi-machine
    pitch returns to this funnel, and this is the glyph it returns with. Same call, and the same
    reasoning, as MOCK_COMPLETED_JOBS surviving the per-job-list cut. If that pitch is settled as
    gone, delete both together. */
export function WaveIcon({ size = 18, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <path d="M3 15c3-4.5 6-4.5 9 0s6 4.5 9 0" />
      <path d="M3 9c3-4.5 6-4.5 9 0s6 4.5 9 0" opacity="0.45" />
    </svg>
  )
}

/** The run cadence ("at least 20 days each month") — a calendar with one date filled in. */
export function CadenceIcon({ size = 18, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <rect x="4" y="5.5" width="16" height="14" rx="2" />
      <path d="M4 9.5h16M8.5 3.5v3M15.5 3.5v3" />
      <rect x="13.2" y="13" width="3.4" height="3.2" rx="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** The invite email + download link ("once accepted, we'll email you"). */
export function MonitorIcon({ size = 18, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <rect x="3" y="4" width="18" height="12.5" rx="2" />
      <path d="M9.5 20.5h5M12 16.5v4" />
      <path d="M12 7v5M9.8 10l2.2 2 2.2-2" />
    </svg>
  )
}

/** "A few minutes" per job. */
export function ClockIcon({ size = 18, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

/** $30/month, paid via PayPal. */
export function WalletIcon({ size = 18, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <rect x="3" y="6.5" width="18" height="12.5" rx="2.2" />
      <path d="M3 10.2h13.5a2.3 2.3 0 0 1 0 4.6H3" />
      <circle cx="16" cy="12.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Program Terms. */
export function DocumentIcon({ size = 18, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <path d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5v4h4" />
      <path d="M8.5 12h7M8.5 15.3h7M8.5 8.7h3" />
    </svg>
  )
}
