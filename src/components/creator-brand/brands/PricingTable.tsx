// The old-way / BlueAI comparison table, on its own so the `#pricing` SECTION and the pricing
// POPUP render the same one. The hero's "See how pricing works" opens a dialog now instead of
// scrolling (designer, 2026-08-11) — and a dialog showing a second, hand-copied version of this
// table is how the two start disagreeing about what BlueAI charges for.
//
// No Reveal in here, deliberately: the section wraps this in one, and a scroll-triggered fade
// inside a dialog is animating against a trigger that has nothing to do with the dialog opening.

const ROWS = [
  { label: 'What you pay for', old: 'Follower count', bai: 'A flat rate per verified engagement' },
  { label: 'Who you reach', old: 'One large influencer', bai: 'Thousands of real accounts, spread out' },
  { label: 'How it feels to viewers', old: 'Reads as an ad', bai: 'Reads as real engagement' },
  { label: 'Negotiating rates', old: 'Back-and-forth over email or DM', bai: 'You set the budget and window' },
  { label: 'Checking the work happened', old: 'Manual, on trust', bai: 'BlueAI verifies every interaction' },
  { label: 'Paying out', old: 'Invoices, manual transfers', bai: 'Automatic, once engagement clears' },
]

// Small stroke glyphs rather than the strikethrough this table used to run on every "old way"
// cell. Six struck-through lines read as damage to the layout, and they also made the old column
// compete for attention by adding a heavy horizontal rule to each row. An icon carries the same
// meaning at a fraction of the ink.
const Cross = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="mt-[4px] shrink-0 text-stroke-warm sm:mt-0" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const Check = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="mt-[4px] shrink-0 text-iris sm:mt-0" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

// Grid template is shared by the header and every row, declared once so they can't drift out of
// alignment. The BlueAI column is the widest of the three: it carries the longest copy AND it's
// the column the section exists to sell.
const COLS = 'sm:grid sm:grid-cols-[1.15fr_1fr_1.25fr]'

// A flat iris tint, not bg-bai-wash. The wash is a gradient, and applying a gradient per-row
// restarts it in every cell — six visible bands instead of one column. A flat alpha tiles
// seamlessly, so the six cells read as a single continuous highlight down the table.
const HILITE = 'bg-[rgba(var(--bai-iris-rgb),0.05)]'

export default function PricingTable() {
  return (
    <>
      {/* Header is desktop-only — below sm there are no columns for it to label, and the per-row
          cross/check carry the same distinction there. */}
      <div className={`hidden border-b border-divider text-[11px] font-semibold uppercase tracking-label ${COLS}`}>
        <span className="px-6 py-3.5" />
        <span className="px-6 py-3.5 text-ink-muted">The old way</span>
        {/* text-gradient, not text-iris. Flat iris was the one saturated accent in the section and
            it read as a stray coloured label; the iris→cyan gradient is the accent this site
            actually uses for emphasis. */}
        <span className={`px-6 py-3.5 ${HILITE}`}>
          <span className="text-gradient">With BlueAI</span>
        </span>
      </div>

      {ROWS.map((r) => (
        <div key={r.label} className={`border-b border-divider last:border-b-0 ${COLS}`}>
          <div className="flex items-center px-6 pt-5 sm:py-4 sm:pt-4">
            <span className="text-[14px] font-semibold text-ink-heading">{r.label}</span>
          </div>

          <div className="flex items-start gap-2.5 px-6 pt-2.5 sm:items-center sm:py-4 sm:pt-4">
            <Cross />
            <span className="text-[13px] text-ink-muted">{r.old}</span>
          </div>

          {/* The tint fills the whole cell, and the cell stretches to the row's height (grid's
              default align-items: stretch), which is what makes the highlight a continuous band
              rather than six detached chips. */}
          <div className={`mt-3 flex items-start gap-2.5 px-6 py-3 sm:mt-0 sm:items-center sm:py-4 ${HILITE}`}>
            <Check />
            <span className="text-[13px] font-medium text-ink-display">{r.bai}</span>
          </div>
        </div>
      ))}
    </>
  )
}
