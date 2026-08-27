// VERSION B (2026-08-26, Abhisht: a variant with no 'program' vocabulary anywhere — the term
// arrived late via engg and was never agreed internally). The ORIGINAL v1 explainer's monthly
// Moneymaker copy, which never says 'program'; Version A's generic program copy lives in
// ../dashboard/HowEarningWorks.tsx untouched.
//
// RESHAPED 2026-08-27 to Version A's section anatomy when B's dashboard adopted A's shell
// (DashboardV1): the section title is hoisted to the page level, so both halves here open on the
// same .crx-subhead labels A's panel uses ("Steps" / "Payout rules") — the two dashboards must
// differ in vocabulary, never in structure. Split/stacking reasoning inherited from A's file.
import { EARNING } from '../dashboard/mockData'

// COPY DECISIONS (2026-08-18, with the PM — still binding):
// - "Moneymaker" is a plain feature name with an everyday verb ("turn on"), never "the Moneymaker
//   skill": "skill" is internal vocabulary.
// - "automatically" is BANNED (PM: "we cant say automatically"), synonyms included.
// - Step 3 names the real numbers (20 days, $30): the card exists to answer "how is my payment
//   calculated", and an answer without the numbers isn't one.
// - "It runs TASKS on your account" (Abhisht, 2026-08-27): no counterparty noun — who the work
//   comes from varies (brands, agencies, other third parties), so the copy names nobody — and
//   "tasks" is the home page's own word for the work, kept identical on purpose.
const STEPS = [
  'Open BlueAI and turn on Moneymaker. It runs tasks on your account.',
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
          {/* "Steps" names the FORM of the content, not its topic — Version A's reasoning: the
              topic is already the hoisted section heading, and repeating it 12px lower is what
              hoisting was meant to stop. */}
          <h3 className="crx-subhead">Steps</h3>
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
          <h3 className="crx-subhead">Payout rules</h3>
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
