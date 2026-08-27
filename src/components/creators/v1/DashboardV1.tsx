'use client'

import { useState } from 'react'
import { useCrx } from '../flow/CrxState'
import StatCardsV1 from './StatCardsV1'
import HowEarningWorksV1 from './HowEarningWorksV1'
import CashOutModal from '../dashboard/CashOutModal'
import Transactions from '../dashboard/Transactions'
import { MOCK_COMPLETED_JOBS, MOCK_STATS, MOCK_TRANSACTIONS, type Transaction } from '../dashboard/mockData'

// VERSION B (2026-08-26): the ORIGINAL v1 returning-member dashboard, restored from origin/main —
// stats, transactions, monthly explainer; no programs band, no tabs, no history, because none of
// those concepts exist in this variant's vocabulary. Version A's program-aware Dashboard lives in
// ../dashboard/Dashboard.tsx untouched. The one adaptation from the verbatim original: the
// completed-jobs count reads MOCK_COMPLETED_JOBS.length directly (MOCK_STATS lost that field when
// Version A moved counting onto the past-programs list).
export default function DashboardV1() {
  const { account } = useCrx()
  const [balance, setBalance] = useState(MOCK_STATS.balance)
  const [cashOutOpen, setCashOutOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)

  // A withdrawal must leave a trace (the original's rule): the cash-out prepends its own row.
  function handleWithdrawn() {
    setTransactions((prev) => [
      { id: `txn-out-${prev.length + 1}`, date: 'Just now', label: 'Cash out to PayPal', amount: balance },
      ...prev,
    ])
    setBalance(0)
  }

  return (
    <section className="crx-dash">
      <h1 className="crx-dash-title">Welcome back, {account.name.split(' ')[0]}.</h1>
      <p className="crx-dash-sub">Here&apos;s how your BlueAI account is doing.</p>

      <div className="crx-dash-band">
        <StatCardsV1 completedJobs={MOCK_COMPLETED_JOBS.length} balance={balance} onCashOut={() => setCashOutOpen(true)} />
      </div>

      <div className="crx-dash-band">
        <Transactions items={transactions} />
      </div>
      <div className="crx-dash-band">
        <HowEarningWorksV1 />
      </div>

      <CashOutModal open={cashOutOpen} balance={balance} onClose={() => setCashOutOpen(false)} onWithdrawn={handleWithdrawn} />
    </section>
  )
}
