'use client'

import { useState } from 'react'
import Reveal from '../../Reveal'
import { useApply } from '../ApplyState'
import StatCards from './StatCards'
import CashOutModal from './CashOutModal'
import { MOCK_STATS } from './mockData'

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
            the decision softens; if it becomes final, delete them rather than leaving dead code. */}
      </div>

      <CashOutModal open={cashOutOpen} balance={balance} onClose={() => setCashOutOpen(false)} onWithdrawn={() => setBalance(0)} />
    </section>
  )
}
