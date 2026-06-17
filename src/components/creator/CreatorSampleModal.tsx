'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStudio } from './CreatorStudio'

// Sample-gallery popup — opens when a gallery tile is clicked. Layout ADAPTS to the clip's aspect:
// portrait (9:16) = video left / info right; landscape (16:9) or square (1:1) = video top / info below
// (so wide clips aren't crushed into a portrait frame). Shows the prompt + a "Copy the prompt" action.
const EASE = [0.22, 0.61, 0.36, 1] as const

export function CreatorSampleModal() {
  const { openSample, closeSample } = useStudio()
  const [copied, setCopied] = useState(false)
  if (!openSample) return null

  const copy = () => {
    try { navigator.clipboard?.writeText(openSample.prompt) } catch { /* clipboard unavailable — still show feedback */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const ratio = openSample.ratio ?? '9/16'
  const portrait = ratio === '9/16'
  const tint = openSample.tint ?? '#1b1e38'
  const posterBg = `center / cover no-repeat url(/videos/${openSample.video}.jpg), ${tint}`

  const media = (cls: string, style: React.CSSProperties) => (
    <div className={cls} style={style}>
      {openSample.clip && (
        <video src={`/videos/${openSample.video}.mp4`} poster={`/videos/${openSample.video}.jpg`} autoPlay muted loop playsInline controls />
      )}
    </div>
  )

  const info = (
    <div className="cr-gen-info">
      <span className="cr-eyebrow-sm">Made with BlueAI</span>
      <h3 className="cr-gen-title">{openSample.title}</h3>
      <p className="cr-gen-meta">{openSample.meta}</p>
      <p className="cr-gen-promote">The prompt</p>
      <p className="cr-sample-prompt">{openSample.prompt}</p>
      <button type="button" className={`cr-dl-cta cr-sample-copy${copied ? ' is-copied' : ''}`} onClick={copy}>
        {copied ? (
          <><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6L9 17l-5-5" /></svg> Copied</>
        ) : (
          <><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg> Copy the prompt</>
        )}
      </button>
    </div>
  )

  return (
    <motion.div
      className="cr-modal-scrim" onClick={closeSample}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
    >
      <motion.div
        className={`cr-modal cr-genmodal${portrait ? '' : ' cr-genmodal--stack'}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.32, ease: EASE }}
      >
        <button type="button" className="cr-modal-x" onClick={closeSample} aria-label="Close">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        {portrait ? (
          <div className="cr-gen-detail">
            {media('cr-gen-video', { background: openSample.clip ? tint : posterBg })}
            {info}
          </div>
        ) : (
          <div className="cr-gen-stack">
            {media('cr-gen-media-wide', { aspectRatio: ratio.replace('/', ' / '), background: openSample.clip ? tint : posterBg })}
            {info}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
