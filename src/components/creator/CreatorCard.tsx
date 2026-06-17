'use client'
import { useRef } from 'react'
import { useStudio, type Sample } from './CreatorStudio'

// A format tile for the gallery rows. Background is a real poster (/videos/<slug>.jpg) layered over
// a brand-duotone fallback, so it's never blank if the still is missing. Tiles flagged `clip` play
// their /videos/<slug>.mp4 muted on hover (lazy). Clicking a tile opens the sample popup (copy-prompt).
const FALLBACK = 'linear-gradient(160deg,#1b1e38,#3a2d6b)'

export function CreatorCard({ card, ratio }: { card: Sample; ratio: '9/16' | '16/9' }) {
  const { openSampleModal } = useStudio()
  const vid = useRef<HTMLVideoElement>(null)
  const cls = `cr-card cr-card--clickable ${ratio === '9/16' ? 'cr-card--v' : 'cr-card--h'}`
  const tint = card.tint ?? FALLBACK
  const isClip = !!(card.clip && card.video)

  const enter = () => { vid.current?.play().catch(() => {}) }
  const leave = () => { const v = vid.current; if (v) { v.pause(); v.currentTime = 0 } }
  const open = () => openSampleModal({ ...card, ratio })

  const bg = card.video && !isClip ? `center / cover no-repeat url(/videos/${card.video}.jpg), ${tint}` : (isClip ? undefined : tint)

  return (
    <article
      className={cls} style={bg ? { background: bg } : undefined}
      role="button" tabIndex={0} onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }}
      onMouseEnter={isClip ? enter : undefined} onMouseLeave={isClip ? leave : undefined}
    >
      {isClip && (
        <video
          ref={vid} className="cr-card-media" src={`/videos/${card.video}.mp4`} poster={`/videos/${card.video}.jpg`}
          muted loop playsInline preload="none" tabIndex={-1} aria-hidden="true"
        />
      )}
      <span className="cr-card-cue" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      </span>
      <div className="cr-card-foot">
        <b>{card.title}</b>
        <span>{card.meta}</span>
      </div>
    </article>
  )
}
