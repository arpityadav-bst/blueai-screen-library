'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GradientCanvas } from './GradientCanvas'
import { useStudio } from './CreatorStudio'
import { Sparkle } from '@/components/Sparkle'
import { Arrow } from '@/components/Arrow'
import { CREATOR_HERO, HERO_MODELS, HERO_PILLS } from '@/lib/creator-data'

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

export function CreatorHero() {
  // Editable, design-only prompt. The typewriter is an animated PLACEHOLDER (only when empty +
  // unfocused); clicking in clears it so you can type. Pills fill the field; Generate runs the
  // login-gated studio flow (shared state in CreatorStudio): sign in → 1 free render → library.
  const { prompt, setPrompt, model, setModel, generating, requestGenerate } = useStudio()
  const [focused, setFocused] = useState(false)
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
            <span className="cr-model"><Sparkle size={15} />
              <select className="cr-model-sel" value={model} onChange={(e) => setModel(e.target.value)} aria-label="Model">
                {HERO_MODELS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </span>
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
