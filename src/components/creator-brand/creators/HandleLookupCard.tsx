'use client'

import { useState } from 'react'
import { estimateFromHandle, type Estimate } from './estimate'
import EarningsReveal from './EarningsReveal'

type Mode = 'idle' | 'scanning' | 'found'

// Single source of truth for the "scanning" state's length — both the state-transition
// timeout and the visual sweep animation read from this, so they can't drift apart.
const SCAN_DURATION_MS = 1300

// YouTube is the only live platform right now, so there's nothing to pick — no tab row needed.
const PLATFORM = 'youtube'

export default function HandleLookupCard() {
  const [handle, setHandle] = useState('')
  const [mode, setMode] = useState<Mode>('idle')
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [label, setLabel] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!handle.trim()) return
    const clean = handle.trim().replace(/^@/, '')
    setMode('scanning')
    setLabel(`@${clean} on YouTube`)
    window.setTimeout(() => {
      setEstimate(estimateFromHandle(clean, PLATFORM))
      setMode('found')
    }, SCAN_DURATION_MS)
  }

  if (mode === 'found' && estimate) {
    return <EarningsReveal estimate={estimate} handleLabel={label} />
  }

  if (mode === 'scanning') {
    return (
      <div className="shadow-float rounded-credits border border-stroke-warm bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bai-gradient opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-bai-gradient" />
          </span>
          <span className="text-[14px] font-medium text-ink-body-2">Reading {label} &amp; your interests…</span>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-pill bg-canvas">
          <div
            className="h-full w-1/3 bg-bai-gradient"
            style={{ animation: `cb-scan ${SCAN_DURATION_MS}ms ease-in-out infinite` }}
          />
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="shadow-hairline flex items-center gap-1.5 rounded-pill border border-divider bg-white py-1.5 pl-4 pr-1.5 focus-within:border-iris"
    >
      <span className="text-[13px] text-ink-muted">@</span>
      <input
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder="yourchannel"
        className="w-full bg-transparent text-[13px] text-ink-heading outline-none placeholder:text-ink-muted"
      />
      <button
        type="submit"
        className="shrink-0 rounded-pill bg-cta-gradient px-4 py-2 text-[12.5px] font-semibold text-white shadow-cta transition-transform hover:-translate-y-0.5 hover:shadow-cta-hover"
      >
        See what you could earn
      </button>
    </form>
  )
}
