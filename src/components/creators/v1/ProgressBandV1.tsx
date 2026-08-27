'use client'

import { useState } from 'react'
import { EARNING } from '../dashboard/mockData'

// VERSION B's progress band (2026-08-27, Abhisht: port Version A's dashboard shell, swap the
// program vocabulary — "the month IS the program" in the v1 model, so every program-shaped
// element here has an exact month-shaped equivalent). Header is "Your progress" (his call, over
// "This month": it names what the reader checks, and it stays honest when windows are per-user
// 30 days rather than calendar months). Tabs keep Version A's own labels — Active / Past — which
// were already noun-free, so the band reads identically across versions except the header.
//
// STRUCTURE MIRRORS EnrolledPrograms.tsx DELIBERATELY (.crx-sect-head + .crx-progtabs +
// .crx-progtile): when a reviewer flips A↔B, the only thing that should change is vocabulary.
// What it deliberately does NOT carry over: the info glyph and the terms sheet (B has no
// per-program terms — the one rule lives in the explainer band below), and any counts-of-programs
// anywhere.

// One row per finished window, the FB-bonuses ledger model Version A's Past tab uses: EVERY month
// lands with a figure, $0 included — ending is what files a month, not the outcome. Timeline is
// coherent with mockData's own story (joined Nov 2025; Nov missed at 14 days; Dec–Feb qualified
// and were paid out as the $90 row; Mar–Jul qualified and are the $150 balance; Aug in flight).
// Days above the 20 floor on some months on purpose — running more than the minimum is the
// normal case, and a column of identical 20s would read as fake.
type PastMonth = { id: string; month: string; days: number; earned: number }
const PAST_MONTHS: PastMonth[] = [
  { id: 'm-2026-07', month: 'Jul 2026', days: 22, earned: EARNING.monthlyPayment },
  { id: 'm-2026-06', month: 'Jun 2026', days: 20, earned: EARNING.monthlyPayment },
  { id: 'm-2026-05', month: 'May 2026', days: 24, earned: EARNING.monthlyPayment },
  { id: 'm-2026-04', month: 'Apr 2026', days: 21, earned: EARNING.monthlyPayment },
  { id: 'm-2026-03', month: 'Mar 2026', days: 20, earned: EARNING.monthlyPayment },
  { id: 'm-2026-02', month: 'Feb 2026', days: 23, earned: EARNING.monthlyPayment },
  { id: 'm-2026-01', month: 'Jan 2026', days: 20, earned: EARNING.monthlyPayment },
  { id: 'm-2025-12', month: 'Dec 2025', days: 21, earned: EARNING.monthlyPayment },
  { id: 'm-2025-11', month: 'Nov 2025', days: 14, earned: 0 },
]

// The month in flight. 12 of 20 keeps the bar mid-story (the state a routine visit actually
// sees); the goal-met branch below is real code, just dormant at this figure.
const DAYS_THIS_MONTH = 12

export default function ProgressBandV1() {
  const [tab, setTab] = useState<'active' | 'past'>('active')
  const met = DAYS_THIS_MONTH >= EARNING.daysRequired

  return (
    <div>
      <div className="crx-sect-head">
        <h2 className="crx-panel-title">Your progress</h2>
        {/* Always both tabs, same reasoning as Version A's band: a new partner learns on day one
            that months end and accumulate. The Past count doubles as "months completed", which is
            also what retired old B's "Completed jobs" box (Abhisht, 2026-08-27: drop it) — the
            only count this screen needs is already on the tab. */}
        <div className="crx-progtabs" role="tablist" aria-label="Progress">
          {(['active', 'past'] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={tab === t ? 'crx-progtab on' : 'crx-progtab'}
            >
              {t === 'active' ? 'Active' : 'Past'}
              <span className="crx-progtab-n">{t === 'active' ? 1 : PAST_MONTHS.length}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 'active' ? (
        <div className="crx-progtiles">
          {/* Version A's quest tile, month-shaped: name + window edge, one bar. No info glyph —
              there is no per-program sheet to open; the one rule lives in How earning works. */}
          <article className="crx-progtile">
            <div className="crx-progtile-id">
              <span className="crx-progtile-name">This month</span>
              <span className="crx-progtile-ends">Ends Aug 31</span>
            </div>
            <div className="crx-progtile-conds">
              <div className="crx-cond">
                <div className="crx-cond-line">
                  <span className="crx-cond-label">Days run</span>
                  <span className="crx-cond-count">
                    <b>{DAYS_THIS_MONTH}</b> of {EARNING.daysRequired} days
                  </span>
                </div>
                <div
                  className="crx-bar"
                  role="progressbar"
                  aria-valuenow={DAYS_THIS_MONTH}
                  aria-valuemin={0}
                  aria-valuemax={EARNING.daysRequired}
                  aria-label="Days run"
                >
                  <span
                    className="crx-bar-fill"
                    style={{ width: `${Math.min(100, (DAYS_THIS_MONTH / EARNING.daysRequired) * 100)}%` }}
                  />
                </div>
              </div>
              {/* Version A's goal-met line, month vocabulary: what it earned, and when the count
                  starts again — the two questions a full bar leaves open. */}
              {met && (
                <p className="crx-progtile-met">
                  <span className="crx-progtile-met-ic" aria-hidden="true">
                    <TickIcon />
                  </span>
                  <span>
                    <b>${EARNING.monthlyPayment} earned this month</b> · Counting starts again Sep 1
                  </span>
                </p>
              )}
            </div>
          </article>
        </div>
      ) : (
        /* The finished months, as ledger rows rather than tiles: nine windows as tiles is a wall,
           and a closed month is a record, not a task — the same reasoning that keeps Version A's
           ended tiles bar-free applies harder at this volume. Row anatomy is Transactions' own
           (date / label / amount), so the two ledgers on this page read as one convention. Mint
           on the qualifying months' amounts: this is money ARRIVING, the one thing mint is for. */
        <div className="crx-panel">
          <ul className="crx-rows crx-bal-rows">
            {PAST_MONTHS.map((m) => (
              <li key={m.id} className="crx-row">
                <span className="crx-row-date">{m.month}</span>
                <span className="crx-row-label">{m.days} days run</span>
                {m.earned > 0 ? (
                  <span className="crx-row-amt in">+${m.earned}</span>
                ) : (
                  <span className="crx-row-amt dim">$0</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 12.5l5 5L19.5 6.5" />
    </svg>
  )
}
