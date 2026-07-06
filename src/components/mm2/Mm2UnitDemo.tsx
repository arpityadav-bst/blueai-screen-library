'use client'
import { useEffect, useState } from 'react'
import type { Mm2Unit } from '@/lib/mm2-data'

// A worker unit's live telemetry readout — same phase-driven proof mechanic as the
// Autonomy OS variant's MmAgentDemo (working → done → payoff → loop), restyled as a
// mission-control log: ">> " prefixed lines, mono, GO/amber status dot.

export default function Mm2UnitDemo({ unit, offset = 0 }: { unit: Mm2Unit; offset?: number }) {
  const last = unit.steps.length
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
    <div className="mm2-log">
      {unit.steps.map((s, i) => {
        const state = phase > i ? 'done' : phase === i ? 'active' : 'idle'
        return (
          <div className={'mm2-log-row is-' + state} key={i}>
            <span className="mm2-log-caret">{state === 'done' ? '✓' : '>>'}</span>
            <span className="mm2-log-text">{state === 'done' ? s.done : s.label}</span>
          </div>
        )
      })}
      <div className={'mm2-payoff' + (phase >= last ? ' is-in' : '')}>{unit.payoff}</div>
    </div>
  )
}
