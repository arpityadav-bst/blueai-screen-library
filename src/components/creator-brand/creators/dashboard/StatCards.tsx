import { WalletIcon } from '../apply/introIcons'
import { YesIcon } from '../../controls/choiceIcons'

// REBUILT 2026-08-14 against direct feedback on the first version, which stacked icon-over-figure-
// over-label vertically — closer to a stat TILE than a dashboard card, and it read as under-designed
// specifically because of that: too much empty vertical space per card for how little each one says.
// The brand side's own report (campaign-report.html's `.state` rows: icon LEFT, figure+label stacked
// to its right, one compact horizontal band) already had the better shape; this now matches it.
//
// NO HOVER ON Completed — it doesn't open anything, and a hover effect on a control that does
// nothing on click is a promise the card doesn't keep. Earned DOES get one, because Cash Out is a
// real action living on that card.
//
// ACTIVE JOBS CARD REMOVED (2026-08-14, direct feedback: "we don't need it here") — was a third card
// in a 3-up grid; the grid is 2-up now rather than 2 cards inside a 3-column track with an empty slot.
//
// EARNED IS NOT A COLOURED BLOCK ANY MORE — the first version washed the whole card in a flat accent
// tint at rest, which read as a stuck/broken hover state rather than a deliberate highlight (exact
// feedback: "already looking like it's hovered, and it's very weird"). Distinguished instead by three
// small, real signals — an accent icon instead of a neutral one, the figure itself in green (money),
// and the one button on the row — same restraint the rest of this card uses, not a fourth colour.
const CARD = 'flex items-center gap-4 rounded-field border border-divider bg-white p-4 sm:p-5'
const ICON_WRAP = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-circle'

function Figure({ tone = 'default', children }: { tone?: 'default' | 'success'; children: React.ReactNode }) {
  // cb-tabular: a figure that can't jitter in width as it changes (Cash Out moves this one to $0)
  // reads as more considered than one that can — same reasoning the hero's own earnings ticker uses.
  return (
    <span
      className={`cb-tabular font-head text-[24px] font-bold leading-tight ${
        tone === 'success' ? 'text-status-success' : 'text-ink-display'
      }`}
    >
      {children}
    </span>
  )
}

export default function StatCards({
  completedJobs,
  balance,
  onCashOut,
}: {
  completedJobs: number
  balance: number
  onCashOut: () => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className={CARD}>
        <span className={`${ICON_WRAP} bg-status-success-soft text-status-success`}>
          <YesIcon size={18} />
        </span>
        <div className="min-w-0">
          <Figure>{completedJobs}</Figure>
          <p className="mt-0.5 truncate text-[13px] text-ink-muted">Completed jobs</p>
        </div>
      </div>

      <div className={`${CARD} transition-all duration-base ease-out-bai hover:-translate-y-0.5 hover:shadow-float`}>
        <span className={`${ICON_WRAP} bg-[rgba(var(--cb-accent-rgb),0.1)] text-[var(--cb-accent)]`}>
          <WalletIcon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <Figure tone="success">${balance}</Figure>
          <p className="mt-0.5 truncate text-[13px] text-ink-muted">Earned</p>
        </div>
        {/* Compact pill, not this site's big gradient CTA — Cash Out is a frequent, low-drama action
            checked routinely, and the gradient pill is reserved for "decide to do this" moments
            elsewhere (Apply Now, Submit application). DISABLED at $0 rather than a no-op handler —
            a button that looks pressable and does nothing on click is worse than one that can't be
            pressed yet. */}
        <button
          type="button"
          onClick={onCashOut}
          disabled={balance <= 0}
          className="shrink-0 rounded-pill border border-[rgba(var(--cb-accent-rgb),0.35)] bg-white px-3.5 py-2 text-[13px] font-semibold text-[var(--cb-accent)] transition-all duration-base ease-out-bai hover:bg-[rgba(var(--cb-accent-rgb),0.08)] disabled:pointer-events-none disabled:border-divider disabled:text-ink-muted disabled:opacity-60"
        >
          Cash out
        </button>
      </div>
    </div>
  )
}
