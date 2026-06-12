'use client'
import { useState } from 'react'
import '@/styles/style-guide.css'

// Live, interactive motion demos for the Foundations "Motion" panel — hover/replay triggered
// (idle at rest, no continuous loops). Shows the system's real motions instead of describing them.
const eo = { transitionTimingFunction: 'var(--ease-out)' } // the real --ease-out token

export function MotionDemo() {
  const [revKey, setRevKey] = useState(0)
  return (
    <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
      {/* Easing curve */}
      <figure className="m-0">
        <svg width="76" height="58" viewBox="0 0 76 58" className="rounded-card border border-divider bg-canvas">
          <line x1="10" y1="50" x2="66" y2="50" stroke="var(--bai-divider)" strokeWidth="1" />
          <line x1="10" y1="50" x2="10" y2="8" stroke="var(--bai-divider)" strokeWidth="1" />
          <path d="M10 50 C20 26 30 10 66 10" fill="none" stroke="var(--bai-iris)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <figcaption className="mt-1.5 text-2xs text-ink-muted">ease-out · <span className="font-mono">.22,.61,.36,1</span></figcaption>
      </figure>

      {/* Hover-lift (the CTA motion) */}
      <div>
        <div className="grid h-12 w-32 cursor-default place-items-center rounded-pill bg-cta-gradient text-xs font-semibold text-white shadow-cta transition-transform duration-200 hover:-translate-y-1.5" style={eo}>hover to lift</div>
        <p className="mt-1.5 text-2xs text-ink-muted">hover-lift · .18s</p>
      </div>

      {/* Arrow slide */}
      <div className="group">
        <div className="inline-flex h-12 items-center gap-1.5 text-sm font-semibold text-iris">Continue <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5" style={eo}>→</span></div>
        <p className="mt-1.5 text-2xs text-ink-muted">arrow-slide on hover</p>
      </div>

      {/* Duration comparison — hover to feel fast vs slow */}
      <div className="group">
        <div className="space-y-2">
          {[['fast', '.15s', 'duration-150'], ['base', '.2s', 'duration-200'], ['slow', '.6s', 'duration-[600ms]']].map(([n, ms, dur]) => (
            <div key={n} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-circle bg-iris transition-transform ${dur} group-hover:translate-x-14`} style={eo} />
              <span className="text-2xs text-ink-muted">{n} · {ms}</span>
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-2xs text-ink-muted">hover to compare</p>
      </div>

      {/* Scroll-reveal — replayable */}
      <div>
        <div key={revKey} className="sg-reveal grid h-12 w-32 place-items-center rounded-field border border-divider bg-canvas text-2xs text-ink-muted">scroll-reveal</div>
        <button type="button" onClick={() => setRevKey((k) => k + 1)} className="mt-1.5 text-2xs font-semibold text-iris hover:underline">↻ Replay reveal</button>
      </div>

      {/* Reduced-motion note */}
      <p className="basis-full text-2xs leading-relaxed text-ink-muted">All scroll / loop motion is gated on <span className="font-mono">prefers-reduced-motion</span>; the scroll-reveal is fade + 20px rise, once on enter.</p>
    </div>
  )
}
