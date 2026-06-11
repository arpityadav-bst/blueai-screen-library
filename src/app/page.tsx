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
  { href: '/hero/stage', name: 'Hero · Stage', desc: 'Rich two-scene agent hero + homepage body', star: true },
  { href: '/hero/stage-original', name: 'Hero · Stage Original', desc: 'Big stage + thumbnail rail + homepage body' },
  { href: '/hero/3-cards', name: 'Hero · 4 Cards', desc: 'Four animated agent cards in a row + homepage body' },
  { href: '/style-guide', name: 'Style Guide', desc: 'Design tokens, type, and components' },
]

export default function Home() {
  return (
    <main
      className="min-h-screen font-sans"
      style={{ background: 'radial-gradient(1100px 620px at 50% -12%, rgba(123,76,255,.07), transparent 60%), linear-gradient(180deg, #f5f6fd 0%, #eef1fb 100%)' }}
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
              className="group flex items-center justify-between gap-6 rounded-field border border-divider bg-canvas px-6 py-5 shadow-[0_1px_2px_rgba(8,10,31,.04)] transition-all hover:-translate-y-0.5 hover:border-[rgba(123,76,255,.35)] hover:shadow-float"
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

        <footer className="mt-12 text-2xs text-ink-muted">An AI worker by now.gg, Inc. · design-only handoff replica</footer>
      </div>
    </main>
  )
}
