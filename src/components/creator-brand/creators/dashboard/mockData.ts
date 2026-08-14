// Illustrative data for the returning-creator dashboard — same convention as every other number on
// this site (estimate.ts, the campaign form's rate card): nothing here is a researched figure, and
// none of it is fetched from anywhere. `$156` for the current balance is not a coincidence — it's the
// exact figure from the payout reference Appy supplied, kept rather than rounded to something
// "cleaner", so the numbers on screen still match what he already reviewed once.
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

export const MOCK_STATS = {
  completedJobs: MOCK_COMPLETED_JOBS.length,
  /** The withdrawable balance — matches the payout reference exactly, see the file comment above. */
  balance: 156,
}
