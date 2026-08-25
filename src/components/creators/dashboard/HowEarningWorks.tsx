// Ported from the frozen creator-brand tree (creator-brand/creators/dashboard/HowEarningWorks.tsx).
// Copy verbatim; skin swapped to the /creators kit. Steps ride the kit's .crx-intro-row (icon-circle
// + sentence — the same row anatomy the light original's numbered dots had); rules ride .crx-rows,
// the kit's divided list.
//
// The static explainer band: how the money works (three steps) and the payout rules, one card, not
// two. All of this is prose that never changes.
//
// VERTICAL LISTS IN A FULL-WIDTH BAND (2026-08-18, two rounds of direct feedback). Round one killed
// the tall card sitting BESIDE Transactions (a growing list and fixed prose can never agree on a
// height); round two killed the horizontal replacement, steps as three columns and rules as a
// dot-separated strip ("not a fan of horizontal lists, can u make them vertical"). So: the band
// stays full width below Transactions, and inside it the steps and the rules are BOTH vertical
// lists, sharing the width as two halves (.crx-earn-split, stacking at the page's 880 breakpoint).
// That works here for the same reason the Transactions pairing failed: both halves are fixed prose
// of similar length, so neither leaves a dead zone under the other.
//
// COPY DECISIONS:
// - GENERIC, NOT ONE PROGRAM'S TERMS (Abhisht, 2026-08-24): the old steps quoted the monthly
//   Moneymaker program (20 days, $30/month) as if it were the system; earning is program-based
//   now and the numbers live per-program in the tiles and the info sheet. This band's job moved
//   from "name the real numbers" (the 2026-08-18 rule, superseded with the PM's numbers) to
//   "explain the system" — which is what let Moneymaker and the figures come off it.
// - "automatically" is STILL BANNED (PM, 2026-08-18: "we cant say automatically"). Do not sneak a
//   synonym in ("on its own", "hands-free", "while you sleep") — the directive is about the claim,
//   not the word.
const STEPS = [
  'Join a program. Each one has its own goal and its own reward.',
  'Run BlueAI. The work it completes counts toward your program goals.',
  'Meet a program’s goal and its reward is added to your earnings.',
]

// Terse on purpose, and nothing here the cash-out modal doesn't already promise: the 7-10 business
// days and the finality are quoted from its confirmation copy, so the rules list and the modal can
// never disagree about what happens to a withdrawal. "Paid monthly" (one program's schedule) became
// the per-program line in the same 2026-08-24 generic pass that rewrote the steps.
const RULES = ['Each program pays on its own schedule', 'PayPal only', 'Transfers take 7-10 business days', 'Withdrawals are final']

export default function HowEarningWorks() {
  return (
    <div className="crx-panel">
      <div className="crx-earn-split">
        <div className="crx-earn-half">
          <h2 className="crx-panel-title">How earning works</h2>
          <ol className="crx-earn-steps">
            {STEPS.map((step, i) => (
              <li key={i} className="crx-intro-row">
                {/* Numbered circles, not editorial "01" numerals: that treatment sells a marketing
                    narrative; this band answers a support question on a working screen. */}
                <span className="crx-intro-ic">{i + 1}</span>
                <p className="crx-intro-body">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="crx-earn-half">
          <h3 className="crx-panel-title">Payout rules</h3>
          <ul className="crx-rows crx-earn-rules">
            {RULES.map((rule) => (
              <li key={rule} className="crx-row">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
