'use client'

import { useState } from 'react'
import Reveal from '../../Reveal'
import { useApply } from '../ApplyState'
import StatCards from './StatCards'
import CashOutModal from './CashOutModal'
import Transactions from './Transactions'
import HowEarningWorks from './HowEarningWorks'
import { MOCK_STATS, MOCK_TRANSACTIONS, type Transaction } from './mockData'

// The returning creator's dashboard — CreatorsTop.tsx's third state, replacing both the marketing
// hero AND the application (a returning creator has nothing to apply for). page.tsx also drops
// HowItWorks/Platforms/FAQ/ApplyCTA/Footer entirely in this state — this component IS the page.
//
// NO PixelRain (removed 2026-08-14, Appy) — the ambient twinkle earns its place over a marketing
// hero trying to hold attention before a decision; a dashboard someone checks routinely is a working
// screen, not a pitch, and the animated canvas under real numbers read as noise rather than mood.
// data-cb-nogate stays: Backdrop's orbs/star still shouldn't fade in gradually the way they do over
// the signed-out hero (that gate is specifically for NOT competing with a first impression, which
// this screen isn't).
//
// GRID FIX (2026-08-14) — this used to put px-6 on the outer <section> and max-w-content on an inner
// div with NO padding of its own, which is a different box model than Header.tsx's (mx-auto
// max-w-content px-6, all three on the SAME element). Two different formulas for "inset from the
// viewport edge" landed at two different numbers — Header's content sat 24px further in than this
// section's did, on both sides, at any width wide enough for max-w-content to actually cap. Fixed by
// copying Header's exact structure: one element carries mx-auto, max-w-content AND px-6 together.
export default function Dashboard() {
  const { account } = useApply()
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
    <section id="hero" data-cb-nogate="true" className="relative overflow-hidden pb-20 pt-10 sm:pt-14">
      <div className="relative z-[1] mx-auto max-w-content px-6">
        <Reveal>
          {/* First name only — "Welcome back, Maya." reads as a greeting; the full name is already
              one glance away in the header's own account chip, so repeating it here would be the
              same fact stated twice in the same screen. */}
          <h1 className="font-head text-[26px] font-bold leading-tight text-ink-display sm:text-[30px]">
            Welcome back, {account.name.split(' ')[0]}.
          </h1>
          <p className="mt-2 text-[15px] text-ink-body-2">Here&apos;s how your BlueAI account is doing.</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-8">
          <StatCards
            completedJobs={MOCK_STATS.completedJobs}
            balance={balance}
            onCashOut={() => setCashOutOpen(true)}
          />
        </Reveal>

        {/* NO PER-JOB LIST (PM, 2026-08-14 meeting): individual completed jobs — names and the brands
            behind them — must not be shown to creators. Aggregate numbers are fine, so the count tile
            in StatCards stays. JobList.tsx and MOCK_COMPLETED_JOBS remain on disk unimported in case
            the decision softens; if it becomes final, delete them rather than leaving dead code.
            Transactions below is NOT that list coming back: its rows are months and withdrawals. */}

        {/* STACKED FULL-WIDTH BANDS, NOT COLUMNS (2026-08-18, direct feedback: "the layout looks a
            bit odd"). The first pass put Transactions and the explainer side by side in a 3/2 split,
            and a 2-row list next to a tall prose card left a dead zone under the shorter column: a
            growing list and fixed prose can never agree on a height. Stacked, neither has a
            neighbour to be unequal to. Data before help: Transactions first because a returning
            creator checks history routinely, the explainer is read once. mt-4 matches the card
            grid's gap so the bands read as part of one group. NO progress meter toward the 20 days
            (offered 2026-08-18, cut as dev work the program's stage doesn't justify yet); the
            requirement is stated as copy in HowEarningWorks instead. */}
        <Reveal delay={0.16} className="mt-4">
          <Transactions items={transactions} />
        </Reveal>
        <Reveal delay={0.24} className="mt-4">
          <HowEarningWorks />
        </Reveal>
      </div>

      <CashOutModal open={cashOutOpen} balance={balance} onClose={() => setCashOutOpen(false)} onWithdrawn={handleWithdrawn} />
    </section>
  )
}
