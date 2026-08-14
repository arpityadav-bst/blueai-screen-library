import type { CompletedJob } from './mockData'

// TRIMMED TO A PLAIN LIST (2026-08-14, direct feedback): this used to be a row of clickable cards
// opening JobDetailModal — title+meta on the left, earned+date on the right, a hover lift, an arrow.
// All of it is gone on purpose: "only the name of the job and the product name, that's it... it
// doesn't open any pop up, nada." No button, no onClick, no onSelect prop, no arrow, no hover — a
// hover effect on a row that does nothing on click is a promise the row doesn't keep (same principle
// StatCards.tsx already applies to its own Completed/Active cards).
export default function JobList({ jobs }: { jobs: CompletedJob[] }) {
  return (
    <div className="flex flex-col gap-3">
      {jobs.map((job) => (
        <div key={job.id} className="rounded-field border border-divider bg-white p-4 sm:p-5">
          <p className="text-[14.5px] font-semibold text-ink-heading">{job.title}</p>
          <p className="mt-1 text-[12.5px] text-ink-muted">{job.brand}</p>
        </div>
      ))}
    </div>
  )
}
