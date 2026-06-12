import type { CSSProperties } from 'react'
import { RW_CARDS, REDDIT_URL } from '@/lib/rewards-data'
import { Arrow } from '@/components/Arrow'

const Up = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 4l7 8h-4v7H9v-7H5z" /></svg>
const Cmt = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-5A8 8 0 1 1 21 11.5z" /></svg>

// Scattered "Reddit collage" — cards bleed off both edges, rotated/scaled/faded, middle card most
// prominent. Positions/transforms captured from the live bluestacks.ai/social-rewards hero.
type Pos = { left?: number; right?: number; top: number; rot: number; sc: number; op: number }
const POS: Pos[] = [
  { left: -4, top: 150, rot: -10, sc: 0.86, op: 0.5 },
  { left: 26, top: 250, rot: -5, sc: 0.95, op: 0.85 },
  { left: 66, top: 372, rot: -2, sc: 0.88, op: 0.6 },
  { right: -22, top: 150, rot: 10, sc: 0.86, op: 0.5 },
  { right: 24, top: 250, rot: 5, sc: 0.95, op: 0.85 },
  { right: 42, top: 372, rot: 2, sc: 0.88, op: 0.6 },
]

function Card({ c }: { c: (typeof RW_CARDS)[number] }) {
  return (
    <div className="sr-card">
      <div className="sr-card-top">
        <span className="sr-dot" />
        <span className="sr-rsub">r/BlueStacks</span>
        <span className="sr-user">{c.user}</span>
        <span className="sr-badge">+1,000</span>
      </div>
      <p>{c.text}</p>
      <div className="sr-meta"><span><Up />{c.up}</span><span><Cmt />{c.c}</span></div>
    </div>
  )
}

export function RewardsHero() {
  return (
    <section className="sr-hero">
      <div className="sr-collage" aria-hidden="true">
        {RW_CARDS.map((c, i) => {
          const p = POS[i]
          const style: CSSProperties = { top: `${p.top}px`, transform: `rotate(${p.rot}deg) scale(${p.sc})`, opacity: p.op }
          if (p.left != null) style.left = `${p.left}px`
          else style.right = `${p.right}px`
          return <div className="sr-card-pos" key={c.user} style={style}><Card c={c} /></div>
        })}
      </div>
      <div className="sr-hero-text">
        <h1 className="sr-h1">Earn <span className="site-grad">up to 1,000</span> AI Credits for BlueAI</h1>
        <p className="sr-sub">Using BlueAI or building skills? Share genuine feedback or a skill you built on r/BlueStacks, and get rewarded up to 1,000 free AI credits.</p>
        <div className="sr-hero-cta">
          <a className="site-btn" href={REDDIT_URL} target="_blank" rel="noopener noreferrer">Post on r/BlueStacks<Arrow /></a>
        </div>
      </div>
    </section>
  )
}
