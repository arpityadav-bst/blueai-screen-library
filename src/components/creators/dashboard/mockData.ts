// Ported VERBATIM from the frozen creator-brand tree
// (src/components/creator-brand/creators/dashboard/mockData.ts) — data, figures and the reasoning
// comments all carry over unchanged; only the file's home moved to the /creators dark flow.
//
// Illustrative data for the returning-creator dashboard, same convention as every other number on
// this site (estimate.ts, the campaign form's rate card): nothing here is a researched figure, and
// none of it is fetched from anywhere.
//
// MONTHLY MODEL (2026-08-18, PM direction): creators are NOT paid per job. They run the Moneymaker
// skill in BlueAI on at least EARNING.daysRequired days in a month; each qualifying month adds one
// flat payment. Completed jobs stay on the dashboard as an activity stat only, fully decoupled from
// money.
//
// BALANCE CHANGED $156 -> $150 with that model. $156 was the exact figure from the payout reference
// Appy supplied and was kept unrounded on purpose; but the live marketing step 4 (HowItWorks.tsx,
// the PM's own copy) promises "$30 per month", and no whole number of $30 months reaches $156. The
// two surfaces reading as one world wins over preserving the reference figure, so the balance is now
// 5 qualifying months x $30. Every dollar figure in this file must stay a multiple of
// EARNING.monthlyPayment, balance and cash-out rows alike: under the monthly model any other number
// is money that cannot exist.
//
// TRIMMED TO id/brand/title ONLY (2026-08-14, direct feedback): the completed-jobs list used to carry
// actions/ranDays/earned/completedOn/description for a row+modal pairing that no longer exists — "only
// the name of the job and the product name, that's it... no price per job, no date, no arrow, no inner
// pop up." Removing the fields with the feature they served, rather than leaving them unread, is what
// keeps this file honest about what the dashboard actually shows.

export type CompletedJob = {
  id: string
  brand: string
  title: string
}

// "Spring Launch: Product Reveal Short" is the exact campaign name already live in the brand side's
// own report mock (public/creator-brand/campaign-report.html) — reused deliberately, not a
// coincidence, so the two mocks read as one world instead of two disconnected placeholders.
export const MOCK_COMPLETED_JOBS: CompletedJob[] = [
  { id: 'job-5', brand: 'Fernweh Coffee', title: 'Spring Launch: Product Reveal Short' },
  { id: 'job-4', brand: 'Northline Skate Co.', title: 'Summer Drop: Behind the Build' },
  { id: 'job-3', brand: 'Aurora Home', title: 'Small Space, Big Ideas' },
  { id: 'job-2', brand: 'Fernweh Coffee', title: 'Cold Brew, Warm Mornings' },
  { id: 'job-1', brand: 'Northline Skate Co.', title: 'Meet the Team' },
]

// The one rule the dashboard explains. daysRequired is illustrative (PM: "20 for now");
// monthlyPayment is NOT free to change alone, it is quoted from the marketing page's step 4 and the
// transaction rows below multiply out of it.
export const EARNING = {
  daysRequired: 20,
  monthlyPayment: 30,
}

export type Transaction = {
  id: string
  /** Display-ready date string. Static in the mock; the runtime cash-out row labels itself instead. */
  date: string
  label: string
  amount: number
}

// CASH-OUTS ONLY (2026-08-18, direct feedback on the first version, which listed one +$30 row per
// qualifying month): "march, august etc payments dont need to be there, they just add to complexity."
// A creator who cashes out after three months sees ONE $90 row, not three $30 rows plus a withdrawal;
// the row summarizes the months it covered, and the Earned tile is where the accruing months show up.
// So every row in this list is money LEAVING, which is also why the Transaction type carries no
// in/out kind any more: there is only one kind.
//
// The single mock row is the user's own worked example (3 qualifying months x $30, withdrawn as $90).
// Timeline it implies, kept coherent on purpose: Maya qualified Dec-Feb (paid $90), cashed out
// March 8, then qualified Mar-Jul, which is the $150 sitting in the balance now.
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'txn-1', date: 'Mar 8, 2026', label: 'Cash out to PayPal', amount: 90 },
]

export const MOCK_STATS = {
  // COMPLETED PROGRAMS, NOT JOBS (Abhisht, 2026-08-24): jobs are internal to programs — "the
  // number of jobs, BlueAI runs etc will be a part of the program" — so the user-facing count is
  // programs finished. Two, to sit plausibly beside the three active enrollments and the March
  // cash-out. MOCK_COMPLETED_JOBS stays for the same reason it survived the per-job-list cut.
  completedPrograms: 2,
  /** The withdrawable balance: the 5 qualifying months since the March cash-out, x $30 each. */
  balance: 5 * EARNING.monthlyPayment,
}
