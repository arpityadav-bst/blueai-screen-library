'use client'
import { useRef } from 'react'

// A format tile for the gallery rows. Background is a real poster (/videos/<slug>.jpg) layered over
// a brand-duotone fallback, so it's never blank if the still is missing. Tiles flagged `clip` carry
// a /videos/<slug>.mp4 that plays muted on hover (lazy: preload="none", loads only on first hover).
type Card = { title: string; meta: string; tint?: string; video?: string; clip?: boolean }
const FALLBACK = 'linear-gradient(160deg,#1b1e38,#3a2d6b)'

export function CreatorCard({ card, ratio }: { card: Card; ratio: '9/16' | '16/9' }) {
  const vid = useRef<HTMLVideoElement>(null)
  const cls = `cr-card ${ratio === '9/16' ? 'cr-card--v' : 'cr-card--h'}`
  const tint = card.tint ?? FALLBACK
  const isClip = !!(card.clip && card.video)

  const enter = () => { vid.current?.play().catch(() => {}) }
  const leave = () => { const v = vid.current; if (v) { v.pause(); v.currentTime = 0 } }

  const bg = card.video && !isClip ? `center / cover no-repeat url(/videos/${card.video}.jpg), ${tint}` : (isClip ? undefined : tint)

  return (
    <article
      className={cls} style={bg ? { background: bg } : undefined}
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
