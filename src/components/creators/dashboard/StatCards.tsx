// Ported from the frozen creator-brand tree (creator-brand/creators/dashboard/StatCards.tsx).
// Logic + copy verbatim; skin swapped to the /creators kit (creators.css .crx-stat family).
//
// REBUILT 2026-08-14 (in the light original) against direct feedback on its first version, which
// stacked icon-over-figure-over-label vertically — closer to a stat TILE than a dashboard card, and
// it read as under-designed specifically because of that: too much empty vertical space per card for
// how little each one says. The horizontal band (icon LEFT, figure+label stacked to its right) is
// the better shape, and .crx-stat is that shape.
//
// NO HOVER ON Completed — it doesn't open anything, and a hover effect on a control that does
// nothing on click is a promise the card doesn't keep. Earned's hover lives on the Cash out button
// itself here (.crx-btn-quiet's own hover), the one real action on the row.
//
// ACTIVE JOBS CARD REMOVED (2026-08-14, direct feedback: "we don't need it here") — 2-up grid.
//
// EARNED IS NOT A COLOURED BLOCK — the light original washed the whole card in a flat accent tint
// at rest, which read as a stuck hover state ("already looking like it's hovered, and it's very
// weird"). Distinguished instead by three small, real signals: the mint icon, the figure itself in
// mint (this page's money colour, .crx-stat-fig.money), and the one button on the row.
//
// TINT SWAP vs the light original (deliberate): there, Completed wore the success tint and Earned
// the brand accent. This page's kit reserves mint STRICTLY for money/success, so mint moves to the
// Earned card (icon + figure) and Completed takes the kit's neutral iris icon wash.

function TickIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 12.5l5 5L19.5 6.5" />
    </svg>
  )
}

function WalletIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="6" width="18" height="14" rx="2.5" />
      <path d="M3 10h18" opacity="0" />
      <path d="M16 6V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1" />
      <circle cx="16.5" cy="13" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function StatCards({
  completedPrograms,
  earnedTillDate,
  balance,
  onCashOut,
}: {
  completedPrograms: number
  earnedTillDate: number
  balance: number
  onCashOut: () => void
}) {
  return (
    <div className="crx-stat-grid">
      <div className="crx-stat">
        <span className="crx-stat-icon">
          <TickIcon />
        </span>
        <div className="crx-stat-body">
          {/* .crx-stat-fig is tabular already — a figure that can't jitter in width as it changes
              (Cash out moves Balance's to $0) reads as more considered than one that can. */}
          {/* Programs, not jobs (Abhisht, 2026-08-24): jobs are internal to programs, so the
              user-facing count is programs finished — same reasoning that renamed the surface. */}
          <span className="crx-stat-fig">{completedPrograms}</span>
          <span className="crx-stat-label">Completed programs</span>
        </div>
      </div>

      {/* PAID-OUT money (Abhisht, 2026-08-24): "Earned till date" counts what has actually been
          cashed out — it starts at $0 and each completed cash-out ADDS the withdrawn amount, so
          the two money tiles are a see-saw: Balance accrues, cashing out moves it here. Neutral
          ink and a neutral icon: mint stays on the ONE figure that answers "what can I take out
          right now", so the two money tiles can't be misread as the same number twice. */}
      <div className="crx-stat">
        <span className="crx-stat-icon">
          <WalletIcon />
        </span>
        <div className="crx-stat-body">
          <span className="crx-stat-fig">${earnedTillDate}</span>
          <span className="crx-stat-label">Earned till date</span>
        </div>
      </div>

      <div className="crx-stat">
        <span className="crx-stat-icon money">
          <WalletIcon />
        </span>
        <div className="crx-stat-body">
          <span className="crx-stat-fig money">${balance}</span>
          <span className="crx-stat-label">Balance</span>
        </div>
        {/* Quiet ghost pill, not this page's big gradient CTA — Cash out is a frequent, low-drama
            action checked routinely; the gradient stays reserved for "decide to do this" moments
            (the original's own rule). DISABLED at $0 rather than a no-op handler — a button that
            looks pressable and does nothing on click is worse than one that can't be pressed yet. */}
        <button type="button" onClick={onCashOut} disabled={balance <= 0} className="crx-btn-quiet crx-cashout">
          Cash out
        </button>
      </div>
    </div>
  )
}
