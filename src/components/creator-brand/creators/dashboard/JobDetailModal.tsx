import Modal, { ModalHeader } from '../../Modal'
import type { CompletedJob } from './mockData'

const ACTION_LABEL: Record<string, string> = { watch: 'Watch', like: 'Like', comment: 'Comment' }

// One fact per cell, same shape StatCards uses (a small muted label under a real value) — kept
// unbordered here since four of these sitting in one row already reads as a group without needing a
// box around each one too.
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[15px] font-semibold text-ink-heading">{value}</p>
      <p className="mt-0.5 text-[12px] text-ink-muted">{label}</p>
    </div>
  )
}

export default function JobDetailModal({ job, onClose }: { job: CompletedJob | null; onClose: () => void }) {
  return (
    <Modal open={job !== null} onClose={onClose} size="sm" label={job ? job.title : 'Job details'}>
      {job && (
        <>
          <ModalHeader title={<h2 className="font-head text-[18px] font-bold text-ink-display">{job.title}</h2>} sub={job.brand} />

          <div className="px-6 py-5 sm:px-7">
            <p className="text-[14px] leading-relaxed text-ink-body-2">{job.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-divider pt-5 sm:grid-cols-4">
              <Fact label="Actions" value={job.actions.map((a) => ACTION_LABEL[a]).join(' + ')} />
              <Fact label="Ran for" value={`${job.ranDays} days`} />
              <Fact label="Completed" value={job.completedOn} />
              <Fact label="Earned" value={`$${job.earned}`} />
            </div>

            {/* Download invoice — INERT ON PURPOSE (Appy, 2026-08-14). Same convention as this
                site's other look-real-does-nothing controls (SignInDialog's provider buttons):
                shown because a real payout history needs one, wired to nothing because this is a
                design mock with no invoice to generate. A quiet outlined pill, not a filled button —
                it's a secondary action next to the job's own facts, not the thing this dialog is for. */}
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-1.5 rounded-pill border border-stroke-warm bg-white px-3.5 py-2 text-[13px] font-medium text-ink-body-2 transition-colors duration-base ease-out-bai hover:border-ink-heading hover:text-ink-heading"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
              </svg>
              Download invoice
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}
