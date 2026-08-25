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
  {
    // RENAMED + RE-POINTED 2026-08-19 (Appy): was "Creator ↔ Brand" -> /creator-brand/creators,
    // describing both audiences under one shell. The creator side of that shell is now superseded
    // by the standalone Creator website below (full flow, its own design language); this card
    // narrows to what's actually still live and finalized here — the brand side — and points
    // straight at its own route rather than the creators entry into a shared shell.
    href: '/creator-brand/brands',
    name: 'Brand website',
    desc: 'The brand-side acquisition flow: post a job, outcome-based pricing, a live job-post form. On the blueai-modern marketing design system. (The partner side moved to its own site — see Partner website below.)',
  },
  {
    // RENAMED + RE-POINTED 2026-08-19 (Appy): was "Creator Homepage — 'The AI You Own'" ->
    // /experiments/robots/index.html, the PM's raw pulled mock (Phase 1 of
    // public/experiments/robots/PLAN.md). All four phases are done now — header, an 8-dimension
    // visual UX audit + fixes, and the full creator flow (sign-in, 5-step application, dashboard,
    // logout) built into it, on this site's own dark theme — so the card points at the real route,
    // not the mock it started from. The mock itself stays on record at /experiments/robots/.
    href: '/creators',
    // "Partner", not "Creator" (Appy, 2026-08-25), following the audience rename on the route
    // itself. The cross-reference in the Brand card above moves with it — a card renamed without
    // its referrer is how an index starts pointing at a name that no longer exists.
    // DELIBERATELY NOT PROPAGATED to /creator-brand, whose cards, copy and whole For Creators /
    // For Brands axis keep the old word: that site is frozen, and its two-audience split is its
    // proposition rather than a label. The two surfaces disagreeing is a real state of the product,
    // not a miss.
    name: 'Partner website',
    desc: 'The full partner side: an AI-worker homepage ("The AI You Own"), sign in, a 5-step application, a returning-partner dashboard with cash-out, and logout — all in its own dark, futuristic design language. Design-only, same convention as every other page here.',
  },
]

// MAINTAINED — not where new work happens, but updated from time to time as the real product
// and the marketing system move. Distinct from DORMANT: these are expected to change again.
const MAINTAINED = [
  { href: '/style-guide', name: 'Marketing Design System', desc: 'Tokens, type and components behind the marketing pages below. Governs those pages only — the active prototype has its own design system, linked at the top.' },
  { href: '/blueai-product', name: 'BlueAI Product', desc: 'Exact clone of the live BlueAI desktop app — the new-variant chat, task-progress + feedback, and all five tabs. Standalone replica, not on the marketing design system.' },
]

// EXPERIMENTS — deliberately not a product surface. Standalone static pages that
// share nothing with the products: no --bai-* tokens, no marketing design system,
// no VDA scope. Each one owns its own stylesheet and its own README. They live here
// only so they can be navigated to; grouping them apart is the point.
const EXPERIMENTS = [
  {
    // Linked at index.html deliberately, NOT via an extensionless rewrite: this page
    // uses relative asset paths, and at /experiments/intelligence-hero the browser
    // would resolve them against /experiments/ and serve the page unstyled.
    href: '/experiments/intelligence-hero/index.html',
    name: 'Own an AI That Works For You',
    desc: 'The BlueAI worker page: deploy a worker on your own PC, it finds real work from brands, completes it, and pays you $30 a month via PayPal. Four machines (PC earning now, the rest soon), a four-step apply flow, and a scroll-scrubbed overnight scene. Vanilla HTML/CSS/JS, its own design language.',
  },
]

const DORMANT = [
  { href: '/seo', name: 'SEO Homepage', desc: 'Search-optimized marketing homepage — full sections + FAQ schema' },
  { href: '/hero-options', name: 'Hero Options', desc: 'The three hero directions, compared side by side' },
  { href: '/live-demo-v2', name: 'Live Demo Homepage', desc: 'The hire-a-worker funnel on the BlueAI design system — live widget, agent scenes, parallax, docking widget' },
  { href: '/ai-video-creator-v2', name: 'AI Video Creator — Studio (v2)', desc: 'Creative-tool concept for the Video Creator landing — WebGL hero, GSAP format galleries, templates, models and a parallax example reel. On the blueAI design system.' },
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
            Design-only handoff. Active work lives in the Terminal Modern prototype and the
            Creator&nbsp;↔&nbsp;Brand site; below that, pages are maintained occasionally, run as
            standalone experiments, or kept on record.
          </p>
        </header>

        <p className="bai-section-label mb-3 text-iris">Active — where work is happening</p>
        <div className="space-y-3">
          {ACTIVE.map((p) => <Card key={p.href} p={p} />)}
        </div>

        <p className="bai-section-label mb-3 mt-12 text-ink-muted">Maintained — updated from time to time</p>
        <div className="space-y-3">
          {MAINTAINED.map((p) => <Card key={p.href} p={p} />)}
        </div>

        <p className="bai-section-label mb-3 mt-12 text-ink-muted">Experiments — outside every product surface</p>
        <div className="space-y-3">
          {EXPERIMENTS.map((p) => <Card key={p.href} p={p} />)}
        </div>

        <p className="bai-section-label mb-3 mt-12 text-ink-muted">Dormant — kept on record</p>
        <div className="space-y-3 opacity-80">
          {DORMANT.map((p) => <Card key={p.href} p={p} />)}
        </div>

        <footer className="mt-12 text-2xs text-ink-muted">An AI worker by now.gg, Inc. · design-only handoff replica</footer>
      </div>
    </main>
  )
}
