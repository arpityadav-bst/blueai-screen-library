'use client'
import { useState } from 'react'
import { Arrow } from '@/components/Arrow'
import { Check } from '@/components/agent/glyphs'

// Faithful interactive replica of the live bluestacks.ai "Generate a video" demo.
// Design-only (submit inert). Reuses the shared .jmf-* form primitives.
const STYLES = ['Faceless short', 'Micro-drama', 'Explainer', 'Talking-head reel']
const PLATFORMS = ['YouTube Shorts', 'TikTok', 'Instagram Reels']
const LENGTHS = ['15 sec', '30 sec', '60 sec']

export function CreatorForm() {
  const [style, setStyle] = useState('Faceless short')
  const [platforms, setPlatforms] = useState<string[]>(['YouTube Shorts'])
  const [length, setLength] = useState('30 sec')
  const togglePlat = (p: string) => setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
  return (
    <form className="jmf-card" onSubmit={(e) => e.preventDefault()}>
      <div className="jmf-head">
        <h2 className="jmf-title">Generate a video</h2>
        <p className="jmf-sub">Describe it. The agent makes your video and emails you the link.</p>
      </div>

      <label className="jmf-field">
        <span className="jmf-lbl">What should the video be about?</span>
        <textarea className="jmf-input jmf-textarea" rows={2} placeholder="e.g. A 3-part mafia micro-drama about a betrayal, or 5 mind-blowing space facts" />
      </label>

      <div className="jmf-field">
        <span className="jmf-lbl">Style</span>
        <div className="jmf-pills">
          {STYLES.map((s) => (
            <button type="button" key={s} className={`jmf-pill${style === s ? ' is-on' : ''}`} aria-pressed={style === s} onClick={() => setStyle(s)}>
              {style === s && <Check />}{s}
            </button>
          ))}
        </div>
      </div>

      <div className="jmf-field">
        <span className="jmf-lbl">Platforms</span>
        <div className="jmf-pills">
          {PLATFORMS.map((p) => {
            const on = platforms.includes(p)
            return (
              <button type="button" key={p} className={`jmf-pill${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => togglePlat(p)}>
                {on && <Check />}{p}
              </button>
            )
          })}
        </div>
      </div>

      <div className="jmf-field">
        <span className="jmf-lbl">Length</span>
        <div className="jmf-pills">
          {LENGTHS.map((l) => (
            <button type="button" key={l} className={`jmf-pill${length === l ? ' is-on' : ''}`} aria-pressed={length === l} onClick={() => setLength(l)}>
              {length === l && <Check />}{l}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="jmf-submit">Generate my video<Arrow size={18} /></button>
    </form>
  )
}
