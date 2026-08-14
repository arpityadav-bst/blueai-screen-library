import { Arrow } from '@/components/Arrow'
import type { CompletedJob } from './mockData'

// REBUILT 2026-08-14 against direct feedback: the first version was one bordered box with divider
// lines between rows and no hover at all — flat, and specifically called out as worse than the
// brand side's own report (campaign-report.html's `.clist .row`), which already had the right idea:
// each row its OWN card, and a real hover — border colour shifts toward the accent, a soft shadow
// lifts in, and the whole row rises 1px. Same formula here, this site's tokens instead of the
// brand report's `--iris`.
const ACTION_LABEL: Record<string, string> = { watch: 'Watch', like: 'Like', comment: 'Comment' }

export default function JobList({ jobs, onSelect }: { jobs: CompletedJob[]; onSelect: (job: CompletedJob) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {jobs.map((job) => (
        <button
          key={job.id}
          type="button"
          onClick={() => onSelect(job)}
          className="group flex w-full items-center gap-4 rounded-field border border-divider bg-white p-4 text-left transition-all duration-base ease-out-bai hover:-translate-y-0.5 hover:border-[rgba(var(--cb-accent-rgb),0.3)] hover:shadow-float sm:p-5"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14.5px] font-semibold text-ink-heading">{job.title}</p>
            {/* brand · actions · duration, one line — the same "small facts in a row" shape the
                job detail modal's own fact grid restates in full, so this line is the summary, not
                a second, competing source of truth. */}
            <p className="mt-1 truncate text-[12.5px] text-ink-muted">
              {job.brand} · {job.actions.map((a) => ACTION_LABEL[a]).join(' + ')} · {job.ranDays} days
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="cb-tabular text-[16px] font-bold text-ink-heading">${job.earned}</p>
            <p className="mt-0.5 text-[11.5px] text-ink-muted">{job.completedOn}</p>
          </div>
          <Arrow size={13} className="shrink-0 text-ink-muted transition-colors duration-base ease-out-bai group-hover:text-[var(--cb-accent)]" />
        </button>
      ))}
    </div>
  )
}
