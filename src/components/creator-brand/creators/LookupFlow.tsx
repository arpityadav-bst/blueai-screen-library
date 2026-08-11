'use client'

import { useEffect, useState } from 'react'
import EarningsReveal from './EarningsReveal'
import ManualDetails from './ManualDetails'
import { estimateFromHandle, estimateFromManual, type Estimate } from './estimate'

// Single source of truth for the scan's length — the state transition and the visual sweep both
// read it, so they can't drift apart.
const SCAN_DURATION_MS = 1300

type Phase = { at: 'scanning' } | { at: 'manual' } | { at: 'result'; estimate: Estimate; source: 'auto' | 'manual' }

// Everything that happens AFTER a handle is submitted. All of it used to replace the hero's input
// card in place; it's a dialog body now, so the input the reader typed into never moves and a
// second lookup needs no reload.
//
// `mode` comes from the state toggler, and changing it RESTARTS the scan rather than swapping the
// end state underneath the reader. That's deliberate: the two outcomes differ in what happens
// during the scan, not just after it, and a reviewer flipping the toggle wants to see the whole
// path — the same reason blueai-desktop's preview panel outranks its modals instead of being
// blocked by them.
export default function LookupFlow({ handle, mode }: { handle: string; mode: 'auto' | 'manual' }) {
  const [phase, setPhase] = useState<Phase>({ at: 'scanning' })
  const label = `@${handle} on YouTube`

  useEffect(() => {
    setPhase({ at: 'scanning' })
    const t = window.setTimeout(() => {
      setPhase(
        mode === 'auto'
          ? { at: 'result', estimate: estimateFromHandle(handle, 'youtube'), source: 'auto' }
          : { at: 'manual' }
      )
    }, SCAN_DURATION_MS)
    return () => window.clearTimeout(t)
  }, [handle, mode])

  if (phase.at === 'scanning') {
    return (
      <div className="px-6 py-12 text-center sm:px-10">
        {/* Was a 3px dot with a ping ring and a one-third-width bar. At dialog scale that read as
            a loading fragment rather than as work happening, so the pulse is now the size of the
            thing it represents: a ring around the channel being read. */}
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-circle bg-bai-gradient opacity-25" />
          <span className="absolute inset-2 rounded-circle bg-bai-wash" />
          <span className="relative h-3 w-3 rounded-circle bg-bai-gradient" />
        </div>
        <p className="mt-6 text-[15px] font-semibold text-ink-display">Reading {label}</p>
        <p className="mt-1 text-[13px] text-ink-muted">Checking your size and what you post about…</p>
        {/* --cb-track, not bg-canvas: canvas is white, so the unfilled part of this bar was
            invisible on a white panel and the sweep looked like a bar with no track. */}
        <div className="mx-auto mt-6 h-1.5 w-full max-w-[260px] overflow-hidden rounded-pill bg-[var(--cb-track)]">
          <div className="h-full w-1/3 rounded-pill bg-bai-gradient" style={{ animation: `cb-scan ${SCAN_DURATION_MS}ms ease-in-out infinite` }} />
        </div>
      </div>
    )
  }

  if (phase.at === 'manual') {
    return (
      <ManualDetails
        handleLabel={`@${handle}`}
        onSubmit={(followers, category) =>
          setPhase({ at: 'result', estimate: estimateFromManual(followers, category), source: 'manual' })
        }
      />
    )
  }

  return <EarningsReveal estimate={phase.estimate} handleLabel={label} source={phase.source} />
}
