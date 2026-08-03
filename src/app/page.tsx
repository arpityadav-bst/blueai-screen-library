import type { Metadata } from 'next'
import { Wordmark } from '@/components/Wordmark'

// Root Screen Library — the handoff index (like WSUP's). Links to every blueAI page via
// full-page <a> (each route loads its own scoped CSS, so this avoids cross-route accumulation).
//
// REORGANISED 2026-08-01 around the scope pivot: this page used to list nine cards flat, with the
// ACTIVE surface (blueai-desktop) buried sixth and described as a "JS experiment", and the pinned
// design-system card pointing at the DORMANT marketing style guide. An index that misstates which
// work is current misleads every reviewer who lands here — grouping by status IS the information.
export const metadata: Metadata = {
  title: 'BlueAI — Screen Library',
  description:
    'Design-only handoff — the active BlueAI Terminal Modern prototype + its design system, and the dormant marketing pages kept on record.',
}

const ACTIVE = [
  {
    href: '/blueai-desktop',
    name: 'BlueAI Terminal Modern',
    desc: 'The product prototype — a BlueStacks window on the desktop; click it to slide out the terminal drawer. Login gate, chat, skills, scheduled tasks, credits, Telegram pairing, all states reachable via the dev preview panel.',
  },
  {
    href: '/blueai-desktop/style-guide.html',
    name: 'Terminal Modern — Design System',
    desc: 'Live style guide onto the product’s own stylesheet and icon set — tokens, scales and specimens are computed from the real files at load, and ds-drift-check.js gates every change.',
    ds: true,
  },
]

const DORMANT = [
  { href: '/seo', name: 'SEO Homepage', desc: 'Search-optimized marketing homepage — full sections + FAQ schema' },
  { href: '/hero-options', name: 'Hero Options', desc: 'The three hero directions, compared side by side' },
  { href: '/live-demo-v2', name: 'Live Demo Homepage', desc: 'The hire-a-worker funnel on the BlueAI design system — live widget, agent scenes, parallax, docking widget' },
  { href: '/ai-video-creator-v2', name: 'AI Video Creator — Studio (v2)', desc: 'Creative-tool concept for the Video Creator landing — WebGL hero, GSAP format galleries, templates, models and a parallax example reel. On the blueAI design system.' },
  { href: '/blueai-product', name: 'BlueAI Product', desc: 'Exact clone of the live BlueAI desktop app — the new-variant chat, task-progress + feedback, and all five tabs. Standalone replica, not on the marketing design system.' },
  { href: '/blueai-creators/site', name: 'Blue AI Creators — Website Draft 1', desc: '"The Payout" — the full 18-page waitlist-release site: creator zone + brand zone, receipt-motif design system, generated tactile props with parallax, GSAP hero moments. Own tokens and fonts, not on either BlueAI design system.' },
  { href: '/blueai-creators', name: 'Blue AI Creators — Onboarding Prototype', desc: 'Two-sided creator marketplace concept: creators paid cash for verified posts, brands hiring many small local creators. Eight hash-routed pages across both journeys, both ending at a waitlist. Standalone experiment on its own tokens — not on either BlueAI design system.' },
  { href: '/blueai-creators/diagrams.html', name: 'Blue AI Creators — Flows & Diagrams', desc: 'Companion to the prototype: page inventory, two swimlanes and a level-1 data flow diagram showing what each page captures. The written spec sits beside it at /blueai-creators/onboarding-flows.md.' },
  { href: '/moneymaker', name: 'Moneymaker — 1. Autonomy OS', desc: 'BlueAI as a moneymaker, variant 1: "The Autonomy OS". Light creator-v2 language — living gradient sky, 3D glass OS panel, GSAP parallax + pinned night-shift scene. Standalone experiment.' },
  { href: '/moneymaker/mission-control', name: 'Moneymaker — 2. Mission Control', desc: 'BlueAI as a moneymaker, variant 2: "Mission Control". SpaceX-launch-broadcast aesthetic — starfield, an ascending worker unit, telemetry mono, a flight-manifest waitlist. Standalone experiment.' },
  { href: '/moneymaker/capital-shift', name: 'Moneymaker — 3. The Capital Shift', desc: 'BlueAI as a moneymaker, variant 3: "The Capital Shift". Manifesto-led editorial big-type — the sell-time → sell-skill → sell-capital progression as the hero, procedural agent-network visualization. Standalone experiment.' },
  { href: '/style-guide', name: 'Marketing Design System', desc: 'Tokens, type and components behind the marketing pages above. Governs the dormant pages only — the active prototype has its own design system, linked at the top.' },
]

function Card({ p }: { p: { href: string; name: string; desc: string; ds?: boolean } }) {
  if (p.ds) {
    return (
      <a
        href={p.href}
        className="group flex items-center justify-between gap-6 rounded-field bg-bai-wash px-6 py-5 ring-1 ring-inset ring-[rgba(var(--bai-iris-rgb),.22)] transition-all hover:-translate-y-0.5 hover:shadow-float"
      >
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-card bg-bai-gradient text-white shadow-cta">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>
          </span>
          <div className="min-w-0">
            <p className="bai-section-label text-iris">Design system</p>
            <p className="font-head text-lg font-semibold tracking-tight text-ink-display">{p.name}</p>
            <p className="mt-0.5 text-sm text-ink-muted">{p.desc}</p>
          </div>
        </div>
        <span className="shrink-0 font-mono text-sm text-iris transition-transform group-hover:translate-x-0.5">{p.href} →</span>
      </a>
    )
  }
  return (
    <a
      href={p.href}
      className="group flex items-center justify-between gap-6 rounded-field border border-divider bg-canvas px-6 py-5 shadow-hairline transition-all hover:-translate-y-0.5 hover:border-[rgba(var(--bai-iris-rgb),.35)] hover:shadow-float"
    >
      <div className="min-w-0">
        <p className="font-head text-lg font-semibold tracking-tight text-ink-display">{p.name}</p>
        <p className="mt-0.5 text-sm text-ink-muted">{p.desc}</p>
      </div>
      <span className="shrink-0 font-mono text-sm text-ink-muted transition-colors group-hover:text-iris">{p.href} →</span>
    </a>
  )
}

export default function Home() {
  return (
    <main
      className="min-h-screen font-sans"
      style={{ background: 'radial-gradient(1100px 620px at 50% -12%, rgba(var(--bai-iris-rgb),.07), transparent 60%), var(--bai-page-grad)' }}
    >
      <div className="mx-auto max-w-[920px] px-6 py-16 md:py-24">
        <header className="mb-10">
          <Wordmark size={26} />
          <h1 className="mt-3 font-head text-4xl font-semibold tracking-tight-3 text-ink-display">Screen Library</h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-muted">
            Design-only handoff. Active work lives in the Terminal Modern prototype; the marketing
            pages below it are kept on record, not in progress.
          </p>
        </header>

        <p className="bai-section-label mb-3 text-iris">Active — where work is happening</p>
        <div className="space-y-3">
          {ACTIVE.map((p) => <Card key={p.href} p={p} />)}
        </div>

        <p className="bai-section-label mb-3 mt-12 text-ink-muted">Dormant — kept on record (2026-07-25 scope pivot)</p>
        <div className="space-y-3 opacity-80">
          {DORMANT.map((p) => <Card key={p.href} p={p} />)}
        </div>

        <footer className="mt-12 text-2xs text-ink-muted">An AI worker by now.gg, Inc. · design-only handoff replica</footer>
      </div>
    </main>
  )
}
