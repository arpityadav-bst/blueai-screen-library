'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GradientCanvas } from './GradientCanvas'
import { useStudio } from './CreatorStudio'
import { CreatorSelect } from './CreatorSelect'
import { Sparkle } from '@/components/Sparkle'
import { Arrow } from '@/components/Arrow'
import { CREATOR_HERO, HERO_STYLES, HERO_ASPECTS, HERO_PILLS } from '@/lib/creator-data'

// Hero: a living iris→cyan WebGL gradient under a frosted "create a video in one shot" prompt.
// Design-only — the prompt + Generate are inert. Content rises in on load (framer-motion).
const EASE = [0.22, 0.61, 0.36, 1] as const
const rise = (d: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } as const, transition: { duration: 0.6, delay: d, ease: EASE } })

// Typewriter: types each example out, holds, deletes, moves to the next, looping. Renders in a ghost
// layer over the (readOnly) textarea so it gets a real blinking caret. Pauses when `enabled` is false
// (i.e. once the user picks a pill). Reduced motion → just show the first example, static.
function useTypewriter(phrases: readonly string[], enabled: boolean) {
  const [typed, setTyped] = useState('')
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTyped(phrases[0]); return }
    let p = 0, c = 0, del = false
    let t: ReturnType<typeof setTimeout>
    const tick = () => {
      const full = phrases[p]
      c += del ? -1 : 1
      setTyped(full.slice(0, c))
      if (!del && c === full.length) { del = true; t = setTimeout(tick, 1900); return }
      if (del && c === 0) { del = false; p = (p + 1) % phrases.length; t = setTimeout(tick, 260); return }
      t = setTimeout(tick, del ? 12 : 30)
    }
    t = setTimeout(tick, 650)
    return () => clearTimeout(t)
  }, [phrases, enabled])
  return typed
}

// A little frame glyph whose proportions match the aspect ratio (square / tall / wide).
const aspectIcon = (v: string) => {
  const box: number[] = ({ '1:1': [5, 5, 14, 14], '9:16': [8, 3, 8, 18], '16:9': [3, 7, 18, 10] } as Record<string, number[]>)[v] ?? [4, 6, 16, 12]
  return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} rx="2" /></svg>
}

export function CreatorHero() {
  // Editable, design-only prompt. The typewriter is an animated PLACEHOLDER (only when empty +
  // unfocused); clicking in clears it so you can type. Pills fill the field; Generate runs the
  // login-gated studio flow (shared state in CreatorStudio): sign in → 1 free render → library.
  const { prompt, setPrompt, style, setStyle, generating, requestGenerate } = useStudio()
  const [focused, setFocused] = useState(false)
  const [aspect, setAspect] = useState<string>('Auto')
  const styleOptions = HERO_STYLES.map((s) => ({ value: s.value, hint: s.hint }))
  const aspectOptions = HERO_ASPECTS.map((a) => ({ value: a.value, label: a.label, hint: a.hint, icon: aspectIcon(a.value) }))
  const showGhost = prompt === '' && !focused
  const typed = useTypewriter(CREATOR_HERO.examples, showGhost)

  return (
    <header className="cr-hero">
      <GradientCanvas />
      <div className="cr-hero-inner">
        <motion.span className="cr-eyebrow" {...rise(0.04)}>{CREATOR_HERO.eyebrow}</motion.span>
        <motion.h1 className="cr-h1" {...rise(0.12)}>{CREATOR_HERO.title[0]}<span className="cr-grad">{CREATOR_HERO.title[1]}</span></motion.h1>
        <motion.p className="cr-sub" {...rise(0.2)}>{CREATOR_HERO.sub}</motion.p>

        <motion.div className="cr-prompt" {...rise(0.3)}>
          <div className="cr-prompt-field">
            <textarea
              className="cr-prompt-input" rows={3} value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              aria-label="Describe your video"
            />
            {showGhost && <div className="cr-prompt-ghost" aria-hidden="true">{typed}<span className="cr-caret" /></div>}
          </div>
          <div className="cr-prompt-bar">
            <div className="cr-prompt-controls">
              <CreatorSelect value={style} options={styleOptions} onChange={setStyle} label="Art style" heading="Choose a style" icon={<Sparkle size={15} />} />
              <CreatorSelect value={aspect} options={aspectOptions} onChange={setAspect} label="Aspect ratio" heading="Choose aspect ratio" />
            </div>
            <button type="button" className={`cr-go${generating ? ' is-busy' : ''}`} aria-label="Generate video" aria-busy={generating} onClick={requestGenerate}>
              {generating ? <span className="cr-spinner" aria-hidden="true" /> : <Arrow size={18} />}
            </button>
          </div>
        </motion.div>

        <motion.div className="cr-pills" {...rise(0.4)}>
          {HERO_PILLS.map((p) => (
            <button
              type="button" key={p.label}
              className={`cr-pill${prompt === p.prompt ? ' is-active' : ''}`}
              aria-pressed={prompt === p.prompt}
              onClick={() => setPrompt(p.prompt)}
            >
              <span aria-hidden="true">{p.icon}</span>{p.label}
            </button>
          ))}
        </motion.div>
      </div>
    </header>
  )
}
