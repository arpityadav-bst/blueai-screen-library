'use client'
import { useState, useEffect, useRef } from 'react'
import { Foundations } from '@/components/style-guide/Foundations'
import { ComponentsSection } from '@/components/style-guide/ComponentsSection'
import { SiteComponents } from '@/components/style-guide/SiteComponents'
import { AgentComponents } from '@/components/style-guide/AgentComponents'
import { MarketingPages } from '@/components/style-guide/MarketingPages'
import { PmComponentsA } from '@/components/style-guide/PmComponentsA'
import { PmComponentsB } from '@/components/style-guide/PmComponentsB'

// /style-guide — WSUP-style architecture: a left sidebar (grouped section nav with
// scroll-to + scroll-spy) + scrollable main. blueai-modern DS + PM supplement. Light theme.
// DS-only — page navigation lives on the root Screen Library index (`/`).
const NAV: { group: string; items: [string, string][] }[] = [
  { group: 'Foundations', items: [['colors', 'Colors'], ['type', 'Type scale'], ['icons', 'Icons'], ['scales', 'Spacing · Radius · Elevation']] },
  { group: 'Components', items: [['hero-nav', 'Hero nav (legacy)'], ['download-cta', 'Download CTA'], ['buttons', 'Buttons'], ['status', 'Status badges'], ['pill-badges', 'Pill badges'], ['credits', 'Credits pill'], ['pills', 'Suggested pills'], ['feature-cards', 'Feature cards'], ['bubbles', 'Message bubbles'], ['composer', 'Composer'], ['header', 'Panel header']] },
  { group: 'Site & patterns', items: [['site-header', 'Marketing header'], ['site-footer', 'Marketing footer'], ['site-buttons', 'CTA buttons + Arrow'], ['site-steps', 'Numbered steps'], ['site-hiw', 'How it works'], ['site-cta-band', 'Dark CTA band'], ['site-faq', 'FAQ accordion']] },
  { group: 'Agent pages', items: [['agent-form', 'Demo form kit'], ['agent-fields', 'Form fields'], ['agent-form-tabs', 'Tabbed form'], ['agent-upload', 'File upload'], ['agent-trades', 'Trade log + badges'], ['agent-video', 'Video card'], ['agent-openings', 'Openings card'], ['agent-portfolio', 'Portfolio card'], ['agent-odds', 'Odds table'], ['agent-caps', 'Capability card'], ['agent-more', 'More-agents card']] },
  { group: 'Marketing pages', items: [['seo-task', 'SEO task card'], ['seo-info', 'What-is card'], ['seo-stage', 'Comparison stage'], ['seo-hero', 'SEO hero (animated)'], ['seo-cta', 'SEO CTA band'], ['home-feature', 'Feature row'], ['home-skill', 'Skill card'], ['rw-card', 'Reddit post card'], ['rw-check', 'Quality-check row'], ['rw-faq', 'FAQ-grid card'], ['rw-collage', 'Collage hero']] },
  { group: 'App (PM)', items: [['app-cards', 'Cards'], ['app-overview', 'Overview cards'], ['app-inputs', 'Inputs & forms'], ['app-nav', 'Navigation'], ['app-credits', 'Credits'], ['app-icons', 'Icons']] },
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
        <nav className="flex-1 px-2.5 pb-6 pt-1">
          {NAV.map((g) => {
            const open = g.items.some(([id]) => id === active)
            return (
              <div key={g.group} className="mb-0.5">
                <button type="button" onClick={() => jumpTo(g.items[0][0])}
                  className={`flex w-full items-center gap-2 rounded-card px-2.5 py-2 text-left transition-colors ${open ? '' : 'hover:bg-surface'}`}>
                  <svg viewBox="0 0 24 24" className={`size-3 shrink-0 transition-transform ${open ? 'rotate-90 text-iris' : 'text-ink-muted'}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
                  <span className={`flex-1 text-[13px] font-semibold leading-tight ${open ? 'text-iris' : 'text-ink-heading'}`}>{g.group}</span>
                  <span className="shrink-0 text-2xs font-medium tabular-nums text-ink-muted">{g.items.length}</span>
                </button>
                {open && (
                  <div className="mb-1.5 ml-[18px] border-l border-divider pl-1.5">
                    {g.items.map(([id, label]) => (
                      <button key={id} type="button" onClick={() => jumpTo(id)}
                        className={`block w-full rounded-card px-2.5 py-1.5 text-left text-[13px] transition-colors ${active === id ? 'bg-bai-wash font-medium text-iris' : 'text-ink-body hover:bg-surface'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
        <div className="px-5 pb-7 text-2xs leading-relaxed text-ink-muted">BlueAI · Unified Design System</div>
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
            <h2 className="mb-1 text-xl font-semibold text-ink-display">Site chrome &amp; patterns</h2>
            <p className="mb-5 text-sm text-ink-muted">The shared marketing-site chrome (header/footer) + the recurring section patterns on the SEO homepage, social-rewards, developer, and the 4 agent pages.</p>
            <SiteComponents />
          </section>
          <section>
            <h2 className="mb-1 text-xl font-semibold text-ink-display">Agent page components</h2>
            <p className="mb-5 text-sm text-ink-muted">The bluestacks.ai agent-page demos — faithful interactive replicas of the live forms, plus each page's data sections.</p>
            <AgentComponents />
          </section>
          <section>
            <h2 className="mb-1 text-xl font-semibold text-ink-display">Marketing pages</h2>
            <p className="mb-5 text-sm text-ink-muted">Page-specific components &amp; patterns from the SEO homepage, the marketing homepage, and social-rewards.</p>
            <MarketingPages />
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
