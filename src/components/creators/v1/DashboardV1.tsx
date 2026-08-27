'use client'

import { useState } from 'react'
import { useCrx } from '../flow/CrxState'
import EarningsPanel from '../dashboard/EarningsPanel'
import CashOutModal from '../dashboard/CashOutModal'
import Transactions from '../dashboard/Transactions'
import HowEarningWorksV1 from './HowEarningWorksV1'
import ProgressBandV1 from './ProgressBandV1'
import { MOCK_STATS, MOCK_TRANSACTIONS, type Transaction } from '../dashboard/mockData'

// VERSION B's dashboard, SECOND SHAPE (2026-08-27, Abhisht: "UI-wise option A looks better but it
// has Programs in it... what about the layout? in the new version the cash is displayed at the
// top" → port A's shell, swap the vocabulary). The first restore (stat-card boxes, retired same
// day with StatCardsV1) was the v1 dashboard verbatim; this is Version A's dashboard with the
// program noun swapped for the month:
//
//   Welcome + Refresh  →  Your earnings (balance leads + ledger)  →  Your progress (Active/Past)
//   →  How earning works
//
// Every structural decision here is A's, on purpose (EARNINGS FIRST — Appy 2026-08-25, "ends
// before means"; earned-till-date derived from the ledger; the quiet refresh pill): when a
// reviewer flips A↔B the only thing that changes is the vocabulary, which keeps the review on the
// actual question. Old B's "Completed jobs" box is gone (Abhisht, 2026-08-27: drop it) — the Past
// tab's count is the only completed-count this screen needs.
export default function DashboardV1() {
  const { account } = useCrx()
  const [balance, setBalance] = useState(MOCK_STATS.balance)
  const [cashOutOpen, setCashOutOpen] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)

  // Derived from the ledger, not held as state — Version A's 2026-08-25 rule, kept for the same
  // reason: earned-till-date IS the money that has left, so it cannot drift from the list.
  const earnedTillDate = transactions.reduce((sum, t) => sum + t.amount, 0)

  // Stub spin, same figures after — Version A's refresh verbatim (a mock that invents new numbers
  // on click teaches a reviewer something untrue about the product).
  function refresh() {
    setSpinning(true)
    window.setTimeout(() => setSpinning(false), 600)
  }

  // A withdrawal must leave a trace: the cash-out prepends its own row (the original's rule).
  function handleWithdrawn() {
    setTransactions((prev) => [
      { id: `txn-out-${prev.length + 1}`, date: 'Just now', label: 'Cash out to PayPal', amount: balance },
      ...prev,
    ])
    setBalance(0)
  }

  return (
    <section className="crx-dash">
      <div className="crx-dash-head">
        <div>
          <h1 className="crx-dash-title">Welcome back, {account.name.split(' ')[0]}.</h1>
          <p className="crx-dash-sub">Here&apos;s how your BlueAI account is doing.</p>
        </div>
        <div className="crx-dash-refresh">
          <button
            type="button"
            className={`crx-refresh${spinning ? ' spin' : ''}`}
            aria-label="Refresh dashboard"
            onClick={refresh}
          >
            <RefreshIcon />
            <span className="crx-refresh-l" aria-live="polite">
              {spinning ? 'Refreshing' : 'Refresh now'}
            </span>
          </button>
        </div>
      </div>

      {/* EARNINGS FIRST — A's order, already argued and settled there ("the balance is the only
          figure on this screen with an action attached... ends before means"). */}
      <div className="crx-dash-band">
        <div className="crx-sect-head">
          <h2 className="crx-panel-title">Your earnings</h2>
          <span className="crx-sect-note">
            Earned till date <b>${earnedTillDate}</b>
          </span>
        </div>
        <EarningsPanel balance={balance} onCashOut={() => setCashOutOpen(true)}>
          <Transactions items={transactions} />
        </EarningsPanel>
      </div>

      <div className="crx-dash-band">
        <ProgressBandV1 />
      </div>

      <div className="crx-dash-band">
        <div className="crx-sect-head">
          <h2 className="crx-panel-title">How earning works</h2>
        </div>
        <HowEarningWorksV1 />
      </div>

      <CashOutModal open={cashOutOpen} balance={balance} onClose={() => setCashOutOpen(false)} onWithdrawn={handleWithdrawn} />
    </section>
  )
}

// Version A's rotate-cw construction verbatim (see Dashboard.tsx for the distorted-arc history
// this replaced) — copied, not imported, matching this repo's frozen-tree convention for chrome
// that two variants share by coincidence rather than by contract.
function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  )
}
