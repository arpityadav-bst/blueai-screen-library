// THE EARNINGS SECTION — balance, what has been paid out, and the ledger behind both.
// Descends from StatCards.tsx (itself ported from the frozen creator-brand tree), renamed with the
// rebuild below because the component stopped being a row of stat cards.
//
// NO ICONS ANY MORE. TickIcon and WalletIcon were deleted with the tiles they sat in: one icon
// circle per stat earned its place only while there were three cards to tell apart at a glance. A
// single hero figure in mint is already unmistakable, and a 44px circle beside it would be
// decoration on the element that needs none. CashOutModal still draws that circle for its success
// state, from .crx-stat-icon.money in the kit — which is the only reason that rule survived.
// What DID carry over from StatCards' own notes: mint is reserved strictly for money, and no hover
// on anything that opens nothing. Both still hold, applied to one figure instead of three.
//
// THE EARNINGS SECTION — balance, what has been paid out, and the ledger behind both.
//
// WAS "StatCards": three equal tiles (Completed programs / Earned till date / Balance) with no
// heading over them, and Transactions as a separate panel below. Rebuilt 2026-08-25 (Appy: "we have
// Your program mini title and then 3 cards not related to Your program"). Three things were wrong
// and they compounded:
//
//   1. The row was the only group on the dashboard with NO heading, sitting directly under one that
//      lives on the page rather than inside a panel. An unlabelled band under a page-level heading
//      is read as part of it, so the money tiles read as belonging to "Your program".
//   2. It could not be labelled honestly, which is the deeper tell. Completed programs is a PROGRAM
//      fact; the other two are money. Name the row "Your earnings" and one of the three becomes
//      actively wrong rather than merely ambiguous. A group that resists a name is not one group.
//   3. Transactions is the LEDGER for Balance, and a panel boundary plus a fresh heading presented
//      it as an unrelated subject — the number and the record explaining it, filed apart.
//
// BALANCE IS NOT A STAT, it is the screen's primary action: the only tile carrying a control, and
// on a money product the thing the person came for. It led as one of three equal tiles. Here it is
// the hero and the ledger follows a rule below it. The other two figures both left for the section
// heads their subjects belong to — Completed programs to the programs head, Earned till date to this
// section's own (2026-08-25) — which leaves this panel saying exactly one thing.
export default function EarningsPanel({
  balance,
  onCashOut,
  children,
}: {
  balance: number
  onCashOut: () => void
  /** the ledger rows — passed in rather than imported so this panel owns layout, not data */
  children?: React.ReactNode
}) {
  return (
    <div className="crx-panel crx-bal-panel">
      <div className="crx-bal">
        <div className="crx-bal-main">
          {/* .crx-subhead, the same mono small-caps every other label on this dashboard wears —
              STEPS, PAYOUT RULES, the completed-count eyebrow (Appy, 2026-08-25: "both labels
              should be like how other labels are there on this dashboard"). It was a plain 0.8rem
              line, which is the one label on the page that looked like body copy. */}
          <span className="crx-subhead">Balance</span>
          {/* tabular, like the tile figure it replaces: a number that cannot jitter in width as it
              changes (Cash out takes it to $0) reads as more considered than one that can */}
          <span className="crx-bal-fig">${balance}</span>
          {/* "Earned till date" MOVED OUT to the section head (Dashboard.tsx, 2026-08-25) — see
              there for why. This panel now holds only the withdrawable figure and its action. */}
        </div>
        {/* Quiet ghost pill, not this page's big gradient CTA — Cash out is a frequent, low-drama
            action checked routinely; the gradient stays reserved for "decide to do this" moments.
            DISABLED at $0 rather than a no-op handler. */}
        <button type="button" onClick={onCashOut} disabled={balance <= 0} className="crx-btn-quiet crx-cashout">
          Cash out
        </button>
      </div>
      {children}
    </div>
  )
}
