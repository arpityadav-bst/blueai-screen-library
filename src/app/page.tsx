import type { Metadata } from 'next'
import { Wordmark } from '@/components/Wordmark'

// Root Screen Library — the handoff index (like WSUP's). Links to every blueAI page via
// full-page <a> (each route loads its own scoped CSS, so this avoids cross-route accumulation).
export const metadata: Metadata = {
  title: 'BlueAI — Screen Library',
  description: 'Design-only handoff — the blueAI marketing pages + the blueai-modern design system.',
}

const PAGES = [
  { href: '/seo', name: 'SEO Homepage', desc: 'Search-optimized marketing homepage — full sections + FAQ schema' },
  { href: '/hero-options', name: 'Hero Options', desc: 'The three hero directions, compared side by side' },
  { href: '/live-demo-v2', name: 'Live Demo Homepage', desc: 'The hire-a-worker funnel on the BlueAI design system — live widget, agent scenes, parallax, docking widget' },
]

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
            Design-only handoff — the blueAI marketing pages + the blueai-modern design system. Open any page below.
          </p>
        </header>

        <div className="space-y-3">
          {PAGES.map((p) => (
            <a
              key={p.href}
              href={p.href}
              className="group flex items-center justify-between gap-6 rounded-field border border-divider bg-canvas px-6 py-5 shadow-hairline transition-all hover:-translate-y-0.5 hover:border-[rgba(var(--bai-iris-rgb),.35)] hover:shadow-float"
            >
              <div className="min-w-0">
                <p className="font-head text-lg font-semibold tracking-tight text-ink-display">
                  {p.name}
                  {'star' in p && p.star ? <span className="ml-2 align-middle text-sm font-medium text-iris">★ Recommended</span> : null}
                </p>
                <p className="mt-0.5 text-sm text-ink-muted">{p.desc}</p>
              </div>
              <span className="shrink-0 font-mono text-sm text-ink-muted transition-colors group-hover:text-iris">{p.href} →</span>
            </a>
          ))}
        </div>

        {/* Style Guide — the design-system reference; set apart + pinned at the bottom */}
        <a
          href="/style-guide"
          className="group mt-6 flex items-center justify-between gap-6 rounded-field bg-bai-wash px-6 py-5 ring-1 ring-inset ring-[rgba(var(--bai-iris-rgb),.22)] transition-all hover:-translate-y-0.5 hover:shadow-float"
        >
          <div className="flex min-w-0 items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-card bg-bai-gradient text-white shadow-cta">
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>
            </span>
            <div className="min-w-0">
              <p className="bai-section-label text-iris">Design system</p>
              <p className="font-head text-lg font-semibold tracking-tight text-ink-display">Style Guide</p>
              <p className="mt-0.5 text-sm text-ink-muted">Design tokens, type, and components — the foundation behind every page above.</p>
            </div>
          </div>
          <span className="shrink-0 font-mono text-sm text-iris transition-transform group-hover:translate-x-0.5">/style-guide →</span>
        </a>

        <footer className="mt-12 text-2xs text-ink-muted">An AI worker by now.gg, Inc. · design-only handoff replica</footer>
      </div>
    </main>
  )
}
