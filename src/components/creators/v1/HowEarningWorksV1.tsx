// VERSION B (2026-08-26, Abhisht: a variant with no 'program' vocabulary anywhere — the term
// arrived late via engg and was never agreed internally). This is the ORIGINAL v1 explainer,
// restored verbatim from origin/main: the monthly Moneymaker copy, which never says 'program'.
// Version A's generic program copy lives in ../dashboard/HowEarningWorks.tsx untouched.
import { EARNING } from '../dashboard/mockData'

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
// COPY DECISIONS (2026-08-18, with the PM):
// - "Moneymaker" is written as a plain feature name with an everyday verb ("turn on"), never "the
//   Moneymaker skill": "skill" is BlueAI's internal vocabulary and this page's readers haven't
//   installed the product yet.
// - "automatically" is BANNED from this copy (PM, 2026-08-18: "we cant say automatically"), which is
//   also why the marketing step 4's phrasing is not quoted verbatim here any more. Do not sneak a
//   synonym in ("on its own", "hands-free", "while you sleep") — the directive is about the claim,
//   not the word.
// - Step 3 names the real numbers (20 days, $30) instead of "qualify for a payment": the card exists
//   to answer "how is my payment calculated", and an answer without the numbers isn't one.
// - The $30 is the PM's own figure from the marketing page's step 4 (HowItWorks.tsx).
const STEPS = [
  'Open BlueAI and turn on Moneymaker. It runs brand campaigns on your account.',
  `Do this on any ${EARNING.daysRequired} days in a month.`,
  `Every month you hit ${EARNING.daysRequired} days, $${EARNING.monthlyPayment} is added to your earnings.`,
]

// Terse on purpose, and nothing here the cash-out modal doesn't already promise: the 7-10 business
// days and the finality are quoted from its confirmation copy, so the rules list and the modal can
// never disagree about what happens to a withdrawal.
const RULES = ['Paid monthly', 'PayPal only', 'Transfers take 7-10 business days', 'Withdrawals are final']

export default function HowEarningWorksV1() {
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
