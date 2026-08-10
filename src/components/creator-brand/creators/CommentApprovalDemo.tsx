'use client'

import { useState } from 'react'

// You're always in the loop on what gets posted as "you" — a concrete, visible trust
// mechanic rather than a vague "we're careful" claim. Auto-approve is opt-in, not default.
export default function CommentApprovalDemo() {
  const [auto, setAuto] = useState(false)

  return (
    <div className="shadow-float rounded-credits border border-stroke-warm bg-white p-6">
      <p className="text-[12px] font-semibold uppercase tracking-label text-ink-muted">Before it posts, as you</p>
      <div className="mt-3 rounded-chat border border-divider bg-canvas p-4">
        <p className="text-[13px] text-ink-muted">Ready to go out under your name:</p>
        <p className="mt-2 rounded-field bg-white px-3 py-2.5 text-[14px] text-ink-heading shadow-hairline">
          &ldquo;This actually made me want to try it myself, great breakdown 👏&rdquo;
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="rounded-pill bg-ink-display px-4 py-2 text-[12px] font-semibold text-white transition-transform active:scale-95"
          >
            Approve
          </button>
          <button
            type="button"
            className="rounded-pill border border-stroke-warm px-4 py-2 text-[12px] font-semibold text-ink-body-2 transition-colors hover:border-ink-heading"
          >
            Edit first
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAuto((a) => !a)}
        className="mt-4 flex w-full items-center justify-between gap-3 rounded-field border border-stroke-warm px-3.5 py-2.5"
      >
        <span className="text-left text-[12px] text-ink-body-2">
          Auto-approve future comments <span className="text-ink-muted">(off by default)</span>
        </span>
        <span
          className={`relative h-5 w-9 shrink-0 rounded-pill transition-colors ${auto ? 'bg-iris' : 'bg-stroke'}`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-circle bg-white shadow-hairline transition-transform ${
              auto ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </span>
      </button>
    </div>
  )
}
