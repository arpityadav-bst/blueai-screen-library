'use client'
import { useState, useEffect, useRef } from 'react'
import { Foundations } from '@/components/style-guide/Foundations'
import { ComponentsSection } from '@/components/style-guide/ComponentsSection'
import { PmComponentsA } from '@/components/style-guide/PmComponentsA'
import { PmComponentsB } from '@/components/style-guide/PmComponentsB'

// /style-guide — WSUP-style architecture: a left sidebar (grouped section nav with
// scroll-to + scroll-spy) + scrollable main. blueai-modern DS + PM supplement. Light theme.
// DS-only — page navigation lives on the root Screen Library index (`/`).
const NAV: { group: string; items: [string, string][] }[] = [
  { group: 'Foundations', items: [['colors', 'Colors'], ['type', 'Type scale'], ['scales', 'Spacing · Radius · Elevation']] },
  { group: 'Components', items: [['hero-nav', 'Marketing nav'], ['buttons', 'Buttons'], ['status', 'Status badges'], ['pill-badges', 'Pill badges'], ['pills', 'Suggested pills'], ['feature-cards', 'Feature cards'], ['bubbles', 'Message bubbles'], ['composer', 'Composer'], ['header', 'Panel header']] },
  { group: 'App components (PM)', items: [['app-cards', 'Cards'], ['app-overview', 'Overview cards'], ['app-inputs', 'Inputs & forms'], ['app-nav', 'Navigation'], ['app-credits', 'Credits'], ['app-icons', 'Icons']] },
]
const SECTION_IDS = NAV.flatMap((g) => g.items.map(([id]) => id))
const FLAT_ITEMS = NAV.flatMap((g) => g.items) // [id, label][] — flattened for the mobile chip nav

export default function StyleGuide() {
  const [active, setActive] = useState('colors')
  const barRef = useRef<HTMLDivElement>(null)
  const lockRef = useRef(false) // ignore scroll-spy briefly while a click-scroll is animating

  // jump to a section. On mobile the chip bar is sticky, so offset the scroll to clear it.
  const jumpTo = (id: string, withOffset = false) => {
    setActive(id)
    lockRef.current = true
    window.setTimeout(() => { lockRef.current = false }, 700)
    const el = document.getElementById(id)
    if (!el) return
    if (withOffset) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' })
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (lockRef.current) return // a chip/sidebar click is driving the scroll — don't fight it
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-8% 0px -72% 0px' },
    )
    SECTION_IDS.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  // keep the active chip centered in the mobile section nav as you scroll
  useEffect(() => {
    barRef.current?.querySelector<HTMLElement>(`[data-chip="${active}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [active])

  return (
    <div className="min-h-screen bg-canvas font-sans md:flex md:h-screen md:overflow-hidden">
      {/* ── mobile section nav — sticky scrollable chips (desktop uses the sidebar) ── */}
      <nav ref={barRef} className="sticky top-0 z-30 flex items-center gap-2 overflow-x-auto border-b border-divider bg-canvas px-4 py-2.5 md:hidden">
        {FLAT_ITEMS.map(([id, label]) => (
          <button key={id} type="button" data-chip={id} onClick={() => jumpTo(id, true)}
            className={`shrink-0 whitespace-nowrap rounded-pill px-3 py-1.5 text-xs font-semibold transition-colors ${active === id ? 'bg-bai-wash text-iris' : 'bg-surface text-ink-body'}`}>
            {label}
          </button>
        ))}
      </nav>

      {/* ── sidebar (desktop only — on mobile it would eat the screen; content scrolls normally) ── */}
      <aside className="hidden w-[224px] shrink-0 flex-col overflow-y-auto border-r border-divider md:flex md:h-full">
        <div className="px-5 pb-4 pt-7">
          <p className="bai-section-label text-iris">BlueAI</p>
          <p className="mt-0.5 font-head text-base font-semibold text-ink-display">Style Guide</p>
        </div>
        <nav className="flex-1 px-3 pb-6">
          {NAV.map((g) => (
            <div key={g.group} className="mb-4">
              <p className="px-2 pb-1.5 text-2xs font-semibold uppercase tracking-wide text-ink-muted">{g.group}</p>
              {g.items.map(([id, label]) => (
                <button key={id} type="button"
                  onClick={() => jumpTo(id)}
                  className={`block w-full rounded-card px-2 py-1.5 text-left text-sm transition-colors ${active === id ? 'bg-bai-wash font-semibold text-iris' : 'text-ink-body hover:bg-surface'}`}>
                  {label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="px-5 pb-7 text-2xs leading-relaxed text-ink-muted">blueai-modern + PM<br />Design tokens</div>
      </aside>

      {/* ── main ── */}
      <main className="w-full px-5 py-8 md:flex-1 md:overflow-y-auto md:px-10 md:py-10">
        <header className="mb-12 border-b border-divider pb-6">
          <p className="bai-section-label text-iris">BlueAI · blueai-modern</p>
          <h1 className="mt-1 font-head text-4xl font-semibold tracking-tight-3 text-ink-display">Style <span className="text-gradient">Guide</span></h1>
          <p className="mt-2 max-w-xl text-sm text-ink-muted">The blueai-modern design system + PM supplement (status · accent). Iris→Cyan gradient on a cool neutral ramp, Inter + Space Grotesk + Bricolage. Light theme.</p>
        </header>

        <div className="space-y-14">
          <Foundations />
          <section>
            <h2 className="mb-5 text-xl font-semibold text-ink-display">Components</h2>
            <ComponentsSection />
          </section>
          <section>
            <h2 className="mb-1 text-xl font-semibold text-ink-display">App components</h2>
            <p className="mb-5 text-sm text-ink-muted">From the PM design system (the shipping web-app) — the in-app product surfaces, documented here for the full blueAI DS reference.</p>
            <div className="space-y-10">
              <PmComponentsA />
              <PmComponentsB />
            </div>
          </section>
        </div>

        <footer className="mt-16 border-t border-divider pt-6 text-2xs text-ink-muted">
          Source: BlueAI.fig “New UX” (blueai-modern) + the shipping web-app DS (blueai-pm). Tokens → <span className="font-mono">globals.css</span> + <span className="font-mono">tailwind.config.ts</span>.
        </footer>
      </main>
    </div>
  )
}
