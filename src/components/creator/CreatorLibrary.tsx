'use client'
import { motion } from 'framer-motion'
import { useStudio } from './CreatorStudio'

// "Your generations" — the user's library, shown ONLY after the first generate. Deliberately MINIMAL
// (app-like, not a marketing hero): a small left-aligned label + a compact left-aligned grid that
// fills as you create. Loading card while generating; finished renders auto-play (muted, looped).
const EASE = [0.22, 0.61, 0.36, 1] as const
const FALLBACK = 'linear-gradient(160deg,#1b1e38,#3a2d6b)' // brand duotone under the render, so a card is never blank

export function CreatorLibrary() {
  const { generations, generating, openGeneration } = useStudio()
  if (!generating && generations.length === 0) return null

  return (
    <section className="cr-library" id="library">
      <div className="cr-wrap">
        <div className="cr-lib-panel">
          <div className="cr-lib-head">
            <h2 className="cr-lib-title">
              Your generations
              {generations.length > 0 && <span className="cr-lib-count">{generations.length}</span>}
            </h2>
            <span className="cr-lib-note">Demo · sample renders</span>
          </div>

          <div className="cr-lib-grid">
            {generating && (
              <div className="cr-lib-card cr-lib-card--loading" aria-live="polite">
                <span className="cr-spinner cr-spinner--ink" aria-hidden="true" />
                <span className="cr-lib-loadtext">Generating…</span>
              </div>
            )}
            {generations.map((g, i) => (
              <motion.article
                className="cr-lib-card cr-lib-card--clickable" key={g.id} style={{ background: FALLBACK }}
                onClick={() => openGeneration(g)} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGeneration(g) } }}
                initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <video className="cr-lib-media" src={`/videos/${g.video}.mp4`} poster={`/videos/${g.video}.jpg`} autoPlay muted loop playsInline />
                {i === 0 && <span className="cr-lib-badge">New</span>}
                <div className="cr-lib-foot">
                  <b>{g.title}</b>
                  <span>Just now · {g.model}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
