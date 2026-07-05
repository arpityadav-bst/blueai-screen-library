'use client'
import { useEffect, useState } from 'react'

// Live proof mini-demos — one tiny scripted job-window per agent (phase-driven, house
// precedent: the legacy agent scenes). Each loops: work happens step by step, then the
// payoff lands as a soft chip. No charts, no tickers — an agent doing its job.
// Reduced-motion → rests at the completed state.

type Step = { label: string; done?: string }
type Scene = { steps: Step[]; payoff: string }

const SCENES: Record<string, Scene> = {
  create: {
    steps: [
      { label: 'Drafting “Black hole facts”…', done: 'Drafted “Black hole facts”' },
      { label: 'Rendering + captions…', done: 'Rendered with captions' },
      { label: 'Publishing to your channel…', done: 'Published ✓' },
    ],
    payoff: '+$3.22 ad revenue',
  },
  predict: {
    steps: [
      { label: 'Watching rate-cut market · 62%…', done: 'Odds crossed your bar' },
      { label: 'Taking a small position…', done: 'Position placed ✓' },
      { label: 'Waiting for resolution…', done: 'Resolved YES' },
    ],
    payoff: '+$18.75 payout',
  },
  trade: {
    steps: [
      { label: 'Rule armed · covered call…', done: 'Your rule triggered' },
      { label: 'Sizing inside your risk caps…', done: 'Sized to your caps' },
      { label: 'Executing…', done: 'Executed ✓' },
    ],
    payoff: '+$41.20 premium',
  },
  flip: {
    steps: [
      { label: 'Found: vintage lens, 31% under…', done: 'Underpriced find' },
      { label: 'Negotiating with the seller…', done: 'Bought at $89' },
      { label: 'Relisting at market…', done: 'Sold at $117 ✓' },
    ],
    payoff: '+$27.40 margin',
  },
}

// phase 0..steps.length-1 = working through steps · phase = steps.length → payoff lands · then hold + restart
export default function MmAgentDemo({ kind, offset = 0 }: { kind: string; offset?: number }) {
  const scene = SCENES[kind] || SCENES.create
  const last = scene.steps.length
  const [phase, setPhase] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setReduced(true); setPhase(last); return }
    let p = 0
    let t: ReturnType<typeof setTimeout>
    const advance = () => {
      p = p > last ? 0 : p + 1                                   // …last = payoff · last+1 resets
      setPhase(p > last ? 0 : p)
      t = setTimeout(advance, p === last ? 2600 : p === 0 ? 900 : 1500)
    }
    t = setTimeout(advance, 1200 + offset)                        // staggered starts so cards never sync
    return () => clearTimeout(t)
  }, [kind, last, offset])

  return (
    <div className="mm-demo" aria-hidden="true">
      {scene.steps.map((s, i) => {
        const state = phase > i ? 'done' : phase === i ? 'active' : 'idle'
        return (
          <div className={'mm-demo-row is-' + state} key={i}>
            <span className="mm-demo-dot" />
            <span className="mm-demo-label">{state === 'done' && s.done ? s.done : s.label}</span>
          </div>
        )
      })}
      <div className={'mm-demo-payoff' + (phase >= last ? ' is-in' : '')}>
        <span>✦</span> {scene.payoff}
      </div>
      {reduced && null}
    </div>
  )
}
