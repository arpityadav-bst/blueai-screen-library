import type { Transaction } from './mockData'

// Ported from the frozen creator-brand tree (creator-brand/creators/dashboard/Transactions.tsx).
// Copy + logic verbatim; skin swapped to the /creators kit (.crx-panel + the .crx-rows divided list,
// which was written for exactly this component).
//
// Cash-out history, and nothing else. The first version listed one +$30 credit per qualifying month
// with cash-outs interleaved; cut on direct feedback (2026-08-18): a creator who cashes out after
// three months should see one $90 row, not three credits and a withdrawal. The accruing months
// already show up in the Earned tile, so listing them here narrated the same money twice. This list
// is what fixes the old seam where withdrawing zeroed the balance with no trace anywhere:
// Dashboard.tsx prepends a row when the modal completes.
//
// DELIBERATELY NOT the dead JobList resurrected: rows are withdrawals, never jobs. The PM rule that
// killed the per-job list (2026-08-14: no job names, no brands, aggregates only) still stands.
//
// Amounts in neutral ink, not red and not signed (.crx-row-amt is --ink-inverse by design): every
// row is the creator moving their own money out, which is neither a gain to celebrate nor a loss to
// warn about. Mint stays reserved for the Earned figure, the one place money arrives.
export default function Transactions({ items }: { items: Transaction[] }) {
  return (
    <div className="crx-panel">
      <h2 className="crx-panel-title">Transactions</h2>
      <ul className="crx-rows">
        {items.map((t) => (
          <li key={t.id} className="crx-row">
            {/* Fixed-width tabular date column so the labels rag into a clean left edge —
                .crx-row-date carries the original's own trick. */}
            <span className="crx-row-date">{t.date}</span>
            <span className="crx-row-label">{t.label}</span>
            <span className="crx-row-amt">${t.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
