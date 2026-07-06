'use client'
import { useEffect, useState } from 'react'
import type { Mm3Worker } from '@/lib/mm3-data'

// The proof mechanic's third skin — same phase-driven pattern as MmAgentDemo (Autonomy
// OS) and Mm2UnitDemo (Mission Control), restyled to Capital Shift's electric palette.

export default function Mm3AgentDemo({ worker, offset = 0 }: { worker: Mm3Worker; offset?: number }) {
  const last = worker.steps.length
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPhase(last); return }
    let p = 0
    let t: ReturnType<typeof setTimeout>
    const advance = () => {
      p = p > last ? 0 : p + 1
      setPhase(p > last ? 0 : p)
      t = setTimeout(advance, p === last ? 2600 : p === 0 ? 900 : 1500)
    }
    t = setTimeout(advance, 1200 + offset)
    return () => clearTimeout(t)
  }, [last, offset])

  return (
    <div className="mm3-demo">
      {worker.steps.map((s, i) => {
        const state = phase > i ? 'done' : phase === i ? 'active' : 'idle'
        return (
          <div className={'mm3-demo-row is-' + state} key={i}>
            <span className="mm3-demo-dot" />
            <span className="mm3-demo-label">{state === 'done' ? s.done : s.label}</span>
          </div>
        )
      })}
      <div className={'mm3-demo-payoff' + (phase >= last ? ' is-in' : '')}>{worker.payoff}</div>
    </div>
  )
}
