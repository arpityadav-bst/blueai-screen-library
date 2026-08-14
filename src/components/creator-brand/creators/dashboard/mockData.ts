// Illustrative data for the returning-creator dashboard — same convention as every other number on
// this site (estimate.ts, the campaign form's rate card): nothing here is a researched figure, and
// none of it is fetched from anywhere. `$156` for the current balance is not a coincidence — it's the
// exact figure from the payout reference Appy supplied, kept rather than rounded to something
// "cleaner", so the numbers on screen still match what he already reviewed once.

export type JobAction = 'watch' | 'like' | 'comment'

export type CompletedJob = {
  id: string
  brand: string
  title: string
  actions: JobAction[]
  /** How long THIS creator ran it, not the campaign's own total window. */
  ranDays: number
  earned: number
  completedOn: string
  description: string
}

// "Spring Launch: Product Reveal Short" is the exact campaign name already live in the brand side's
// own report mock (public/creator-brand/campaign-report.html) — reused deliberately, not a
// coincidence, so the two mocks read as one world instead of two disconnected placeholders.
export const MOCK_COMPLETED_JOBS: CompletedJob[] = [
  {
    id: 'job-5',
    brand: 'Fernweh Coffee',
    title: 'Spring Launch: Product Reveal Short',
    actions: ['watch', 'like', 'comment'],
    ranDays: 14,
    earned: 30,
    completedOn: 'Aug 9, 2026',
    description:
      'Watched the full reveal short, liked it and left a genuine comment on it — verified on this account across the whole run.',
  },
  {
    id: 'job-4',
    brand: 'Northline Skate Co.',
    title: 'Summer Drop: Behind the Build',
    actions: ['watch', 'like'],
    ranDays: 9,
    earned: 22,
    completedOn: 'Jul 27, 2026',
    description: 'Watched the full behind-the-build video and liked it, verified on this account across the whole run.',
  },
  {
    id: 'job-3',
    brand: 'Aurora Home',
    title: 'Small Space, Big Ideas',
    actions: ['watch', 'like', 'comment'],
    ranDays: 21,
    earned: 34,
    completedOn: 'Jul 11, 2026',
    description:
      'Watched the full video, liked it and left a genuine comment — verified on this account across the whole run.',
  },
  {
    id: 'job-2',
    brand: 'Fernweh Coffee',
    title: 'Cold Brew, Warm Mornings',
    actions: ['watch', 'comment'],
    ranDays: 6,
    earned: 16,
    completedOn: 'Jun 30, 2026',
    description: 'Watched the full video and left a genuine comment — verified on this account across the whole run.',
  },
  {
    id: 'job-1',
    brand: 'Northline Skate Co.',
    title: 'Meet the Team',
    actions: ['watch', 'like'],
    ranDays: 8,
    earned: 18,
    completedOn: 'Jun 14, 2026',
    description: 'Watched the full video and liked it, verified on this account across the whole run.',
  },
]

export const MOCK_STATS = {
  completedJobs: MOCK_COMPLETED_JOBS.length,
  activeJobs: 2,
  /** The withdrawable balance — matches the payout reference exactly, see the file comment above. */
  balance: 156,
}
