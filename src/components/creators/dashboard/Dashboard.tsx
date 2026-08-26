'use client'

import { useState } from 'react'
import { useCrx } from '../flow/CrxState'
import EnrolledPrograms from './EnrolledPrograms'
import EarningsPanel from './EarningsPanel'
import CashOutModal from './CashOutModal'
import Transactions from './Transactions'
import HowEarningWorks from './HowEarningWorks'
import { MOCK_STATS, MOCK_TRANSACTIONS, type Transaction } from './mockData'
import type { EnrolledProgram } from '../programs/programData'

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
// The first version of this glyph was DISTORTED and the path says why: `a8 8 0 1 0 -2.3 5.7` asked
// for a large-arc sweep between two points about 6 units apart on a radius of 8, which SVG resolves
// as a lopsided near-loop nowhere near centred on the box. Replaced with the standard rotate-cw
// construction — one arc plus a polyline arrowhead, both on the same 9-unit radius — instead of
// nudging the numbers until it looked less wrong.
function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  )
}

export default function Dashboard({
  enrollments,
}: {
  enrollments?: EnrolledProgram[]
}) {
  const { account } = useCrx()
  const [balance, setBalance] = useState(MOCK_STATS.balance)
  const [cashOutOpen, setCashOutOpen] = useState(false)
  const [spinning, setSpinning] = useState(false)

  function refresh() {
    setSpinning(true)
    // 600ms is the spin's own duration — long enough to read as work, short enough that nobody
    // waits. It resolves to the same figures on purpose; see the note at the control.
    window.setTimeout(() => setSpinning(false), 600)
  }
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)

  // EARNED TILL DATE COUNTS PAID-OUT MONEY ONLY (Abhisht, 2026-08-24: "make that 0... if i cashout
  // 150, then i have earned 0 + 150 = 150 till date") — balance is money accrued, earned-till-date
  // is money RECEIVED.
  //
  // DERIVED FROM THE LEDGER, not held as state starting at 0 (2026-08-25). His rule and this mock's
  // own data disagreed, and the regroup made it visible: every row in MOCK_TRANSACTIONS is a
  // cash-out, and there is already one — $90 on Mar 8, whose own note describes Maya qualifying
  // Dec-Feb and being PAID for it. So by the rule above she has received $90 while the tile said
  // $0, with the contradicting row on the same screen. Separated by a panel that was survivable;
  // sitting two lines apart it is not.
  // Summing the rows satisfies the rule instead of restating it: earned-till-date IS the money that
  // has left, so it cannot drift from the list again, and the cash-out handler no longer has to
  // remember to move two numbers. FLAGGED for the PM — if he wants the tile to open at $0, the
  // thing to change is the seeded row, not this sum.
  const earnedTillDate = transactions.reduce((sum, t) => sum + t.amount, 0)

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
      {/* THE GREETING NOW SHARES A ROW WITH THE REFRESH (Abhisht item 3, 2026-08-25; Appy: "3 can
          be subtle and minimal"). It goes here rather than per-section because there is one dataset
          behind all three sections — a refresh on each would imply they reload independently, which
          would be a lie about the model.
          SUBTLE COMES FROM SIZE AND INK, not from hiding the control. It is a caption-scale pill in
          the page's mono voice, next to an h1 — a prominent Refresh button on a screen whose figures
          move once a month would suggest the numbers are volatile, and they are not.
          Two earlier attempts are worth recording because both were wrong in the same direction:
          first a labelled timestamp doing the talking ("Updated just now") with a bare 30px glyph
          beside it, then the same glyph alone. The timestamp reported a non-event and the glyph asked
          the reader to recognise 13px of arrow. The label was the missing piece both times. */}
      <div className="crx-dash-head">
        <div>
          <h1 className="crx-dash-title">Welcome back, {account.name.split(' ')[0]}.</h1>
          <p className="crx-dash-sub">Here&apos;s how your BlueAI account is doing.</p>
        </div>
        {/* NO TIMESTAMP (Appy, 2026-08-25: "updated just now, no need for this text"). It was there
            to say where the data stood, and on a screen whose figures move once a month that is a
            caption reporting that nothing has happened — it spent the row's quiet slot on a
            non-event. The control now carries both states itself, which is one element instead of
            two saying overlapping things. */}
        <div className="crx-dash-refresh">
          {/* STUB, like every other action on this design-only route: there is no endpoint to hit,
              so it spins, says "Refreshing", and resolves to the same figures. Deliberately NOT
              faking changed numbers — a mock that invents new ones on click teaches a reviewer
              something untrue about the product. */}
          <button
            type="button"
            className={`crx-refresh${spinning ? ' spin' : ''}`}
            aria-label="Refresh dashboard"
            onClick={refresh}
          >
            <RefreshIcon />
            {/* THE LABEL IS THE WHOLE STATE MODEL NOW — "Refresh now" at rest, "Refreshing" while it
                spins (Appy). An icon-only button asked the reader to recognise a symbol, and 13px of
                arrow is a small thing to have to recognise; a label that also reports progress means
                the spin is decoration rather than the only feedback.
                aria-live sits on the label rather than the button, so the change is announced without
                the whole control being re-read on every press. */}
            <span className="crx-refresh-l" aria-live="polite">
              {spinning ? 'Refreshing' : 'Refresh now'}
            </span>
          </button>
        </div>
      </div>

      {/* THREE LABELLED SECTIONS, GROUPED BY THE QUESTION BEING ASKED (2026-08-25, Appy) — how much
          can I take out, am I on track, how does this work. It was four bands where one had no
          heading at all and the money was split across two of them; EarningsPanel.tsx carries the
          full diagnosis of the grouping. */}

      {/* EARNINGS FIRST, and this REVERSES 2026-08-24 (Appy, 2026-08-25: "shift earning up and Your
          program down"). The order it replaces was Abhisht's, matching the dev build, on the
          argument that a routine visit asks "am I on track" — which is still the most FREQUENT
          question, and is why the case was close.
          What the reversal buys: the balance is the only figure on this screen with an action
          attached, and a money product that opens on progress toward money rather than on the money
          reads as burying the point. Ends before means.
          WHAT IT COSTS, recorded because it will show up in review before it shows up here: a
          brand-new partner has no balance and nothing paid out, so their dashboard now opens on two
          zeros where it used to open on visible progress ("12 of 20 days"). If that lands badly for
          the launch cohort, the fix is probably not another flip — it is an empty state for this
          section, or a compact balance strip above the program band rather than a full section.

          ONE SECTION, NOT TWO. Balance, what has been paid out, and the ledger behind both share a
          heading and a panel — the number and the record explaining it. The 2026-08-18 finding that
          put Transactions on its own full-width band still holds for the SHAPE (stacked, never in a
          column beside the fixed-height explainer, which left a dead zone under the shorter one);
          what is retired is the idea that it was a separate subject. */}
      <div className="crx-dash-band">
        <div className="crx-sect-head">
          <h2 className="crx-panel-title">Your earnings</h2>
          {/* EARNED TILL DATE SITS IN THE HEAD (Appy, 2026-08-25: "just how we have 0 completed on
              the same row as Your program"), which is the same slot and the same .crx-sect-note
              voice the programs section uses for its completed count. The two are the same KIND of
              fact: a lifetime total that qualifies the section without being what the section is
              for. Inside the panel it was a third line under the balance, competing with the figure
              nobody opens this screen to ask about; up here it is a footnote to the heading, and
              the panel is left saying exactly one thing.
              PAID-OUT money (Abhisht, 2026-08-24) — Balance accrues, cashing out moves it here, so
              the two figures are a see-saw. That is also why the amount stays in body ink rather
              than mint: mint belongs to the ONE figure answering "what can I take out now". */}
          <span className="crx-sect-note">
            Earned till date <b>${earnedTillDate}</b>
          </span>
        </div>
        <EarningsPanel
          balance={balance}
          onCashOut={() => setCashOutOpen(true)}
        >
          <Transactions items={transactions} />
        </EarningsPanel>
      </div>

      {/* NO PER-JOB LIST (PM, 2026-08-14 meeting): individual completed jobs — names and the brands
          behind them — must not be shown to creators. Aggregate numbers are fine; as of 2026-08-25
          the completed count is the Past tab's own badge inside this section rather than a figure
          passed down from here, which is why the prop is gone. MOCK_COMPLETED_JOBS remains in
          mockData unimported in case the per-job decision softens. The ledger above is NOT that list
          coming back: its rows are withdrawals. */}
      <div className="crx-dash-band">
        <EnrolledPrograms enrollments={enrollments} />
      </div>
      {/* THE THIRD SECTION LABEL, hoisted out of the panel 2026-08-25 (Appy). All three now sit on
          the page in the same row treatment, so placement encodes hierarchy instead of encoding
          what happens to be underneath: the programs section could never take a panel (a panel
          around a stack of bounded tiles double-borders every one of them), which is the accident
          that put two labels on the page and left the third on a card. */}
      <div className="crx-dash-band">
        <div className="crx-sect-head">
          <h2 className="crx-panel-title">How earning works</h2>
        </div>
        <HowEarningWorks />
      </div>

      <CashOutModal open={cashOutOpen} balance={balance} onClose={() => setCashOutOpen(false)} onWithdrawn={handleWithdrawn} />
    </section>
  )
}
