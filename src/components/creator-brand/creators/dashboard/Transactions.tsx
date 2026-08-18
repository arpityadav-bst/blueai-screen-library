import type { Transaction } from './mockData'

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
// Amounts in neutral ink, not red and not signed: every row is the creator moving their own money
// out, which is neither a gain to celebrate nor a loss to warn about. Green stays reserved for the
// Earned figure, the one place money arrives.
export default function Transactions({ items }: { items: Transaction[] }) {
  return (
    <div className="rounded-field border border-divider bg-white p-5 sm:p-6">
      <h2 className="font-head text-[16px] font-bold text-ink-display">Transactions</h2>
      <ul className="mt-2 divide-y divide-divider">
        {items.map((t) => (
          <li key={t.id} className="flex items-baseline gap-3 py-3">
            {/* Fixed-width tabular date column so the labels rag into a clean left edge. */}
            <span className="cb-tabular w-[88px] shrink-0 text-[12.5px] text-ink-muted">{t.date}</span>
            <span className="min-w-0 flex-1 truncate text-[14px] text-ink-body-2">{t.label}</span>
            <span className="cb-tabular shrink-0 text-[14px] font-semibold text-ink-heading">${t.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
