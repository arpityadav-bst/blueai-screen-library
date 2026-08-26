import { EARNING } from './mockData'

// The static explainer band: how the money works (three steps) and the payout rules, one card, not
// two. All of this is prose that never changes.
//
// VERTICAL LISTS IN A FULL-WIDTH BAND (2026-08-18, two rounds of direct feedback). Round one killed
// the tall card sitting BESIDE Transactions (a growing list and fixed prose can never agree on a
// height); round two killed the horizontal replacement, steps as three columns and rules as a
// dot-separated strip ("not a fan of horizontal lists, can u make them vertical"). So: the band
// stays full width below Transactions, and inside it the steps and the rules are BOTH vertical
// lists, sharing the width as two halves. That works here for the same reason the Transactions
// pairing failed: both halves are fixed prose of similar length, so neither leaves a dead zone
// under the other.
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
  'Open BlueAI and turn on Moneymaker. It runs agency campaigns on your account.',
  `Do this on any ${EARNING.daysRequired} days in a month.`,
  `Every month you hit ${EARNING.daysRequired} days, $${EARNING.monthlyPayment} is added to your earnings.`,
]

// Terse on purpose, and nothing here the cash-out modal doesn't already promise: the 7-10 business
// days and the finality are quoted from its confirmation copy, so the rules list and the modal can
// never disagree about what happens to a withdrawal.
const RULES = ['Paid monthly', 'PayPal only', 'Transfers take 7-10 business days', 'Withdrawals are final']

export default function HowEarningWorks() {
  return (
    <div className="rounded-field border border-divider bg-white p-5 sm:p-6">
      {/* The hairline between the halves is a divider on the right half, not a border on the left,
          so on mobile (stacked) it sits between the two lists and never dangles at the bottom. */}
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-0">
        <div className="sm:pr-8">
          <h2 className="font-head text-[16px] font-bold text-ink-display">How earning works</h2>
          <ol className="mt-4 flex flex-col gap-4">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                {/* Small numbered dots, not StepCards' editorial "01" numerals: that treatment sells
                    a marketing narrative; this band answers a support question on a working screen. */}
                <span className="cb-tabular mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-circle bg-surface text-[11.5px] font-bold text-ink-heading">
                  {i + 1}
                </span>
                <p className="text-[13.5px] leading-relaxed text-ink-body-2">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-divider pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
          <h3 className="font-head text-[16px] font-bold text-ink-display">Payout rules</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {RULES.map((rule) => (
              <li key={rule} className="flex items-baseline gap-2.5 text-[13.5px] text-ink-body-2">
                <span className="h-[4px] w-[4px] shrink-0 translate-y-[-2px] rounded-circle bg-ink-muted" aria-hidden="true" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
