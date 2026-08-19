'use client'

import { useState } from 'react'
import { useCrx } from '../flow/CrxState'
import StatCards from './StatCards'
import CashOutModal from './CashOutModal'
import Transactions from './Transactions'
import HowEarningWorks from './HowEarningWorks'
import { MOCK_STATS, MOCK_TRANSACTIONS, type Transaction } from './mockData'

// Ported from the frozen creator-brand tree (creator-brand/creators/dashboard/Dashboard.tsx).
// Logic + copy verbatim; skin swapped to the /creators kit. The returning creator's view — replaces
// both the marketing hero AND the application (a returning creator has nothing to apply for).
//
// Page grid: one centered max-width 1100px column (.crx-dash), the same content width every section
// of this page uses (main, .sleep, .below, .closer are all 1100px). Left-aligned — a dashboard is a
// working screen, not the page's centered pitch copy.
//
// No ambient animation imported here on purpose (the light original dropped its PixelRain for the
// same reason): a dashboard someone checks routinely is a working screen, not a pitch, and animated
// noise under real numbers reads as noise rather than mood.
export default function Dashboard() {
  const { account } = useCrx()
  const [balance, setBalance] = useState(MOCK_STATS.balance)
  const [cashOutOpen, setCashOutOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)

  // A withdrawal must leave a trace: before this list existed, cashing out zeroed the balance with
  // no record anywhere on the screen, which read as the money vanishing. "Just now" instead of a
  // real date because the mock's static rows live in a fixed illustrative "present" (Aug 2026) that
  // the user's actual clock has no business contradicting.
  function handleWithdrawn() {
    setTransactions((prev) => [
      { id: `txn-out-${prev.length + 1}`, date: 'Just now', label: 'Cash out to PayPal', amount: balance },
      ...prev,
    ])
    setBalance(0)
  }

  return (
    <section className="crx-dash">
      {/* First name only — "Welcome back, Maya." reads as a greeting; the full name is already one
          glance away in the header's own account chip, so repeating it here would be the same fact
          stated twice in the same screen. */}
      <h1 className="crx-dash-title">Welcome back, {account.name.split(' ')[0]}.</h1>
      <p className="crx-dash-sub">Here&apos;s how your BlueAI account is doing.</p>

      <div className="crx-dash-band">
        <StatCards completedJobs={MOCK_STATS.completedJobs} balance={balance} onCashOut={() => setCashOutOpen(true)} />
      </div>

      {/* NO PER-JOB LIST (PM, 2026-08-14 meeting): individual completed jobs — names and the brands
          behind them — must not be shown to creators. Aggregate numbers are fine, so the count tile
          in StatCards stays. MOCK_COMPLETED_JOBS remains in mockData unimported in case the decision
          softens. Transactions below is NOT that list coming back: its rows are withdrawals. */}

      {/* STACKED FULL-WIDTH BANDS, NOT COLUMNS (2026-08-18, direct feedback: "the layout looks a
          bit odd"). The first pass put Transactions and the explainer side by side in a 3/2 split,
          and a 2-row list next to a tall prose card left a dead zone under the shorter column: a
          growing list and fixed prose can never agree on a height. Stacked, neither has a neighbour
          to be unequal to. Data before help: Transactions first because a returning creator checks
          history routinely, the explainer is read once. The band gap matches the stat grid's gap so
          the bands read as one group. NO progress meter toward the 20 days (offered 2026-08-18, cut
          as dev work the program's stage doesn't justify yet); the requirement is stated as copy in
          HowEarningWorks instead. */}
      <div className="crx-dash-band">
        <Transactions items={transactions} />
      </div>
      <div className="crx-dash-band">
        <HowEarningWorks />
      </div>

      <CashOutModal open={cashOutOpen} balance={balance} onClose={() => setCashOutOpen(false)} onWithdrawn={handleWithdrawn} />
    </section>
  )
}
