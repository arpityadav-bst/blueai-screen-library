'use client'
// The shared marketing-site chrome + patterns used across every inner page (SEO homepage,
// social-rewards, developer, the 4 agent pages). Renders the REAL MarketingHeader/Footer/SiteFaq
// so the docs can't drift; patterns are sample markup under .v-site (the live scope).
import '@/styles/site.css'
import '@/styles/style-guide.css'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { SiteFaq } from '@/components/site/SiteFaq'
import { Arrow } from '@/components/Arrow'
import { PreviewAnatomy, Tok } from '@/components/style-guide/Anatomy'

function Block({ id, title, note, full, children }: { id: string; title: string; note?: React.ReactNode; full?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-8 rounded-field border border-divider bg-surface p-5${full ? ' lg:col-span-2' : ''}`}>
      <p className="bai-section-label mb-1">{title}</p>
      {note && <p className="mb-4 text-2xs leading-relaxed text-ink-muted">{note}</p>}
      {children}
    </section>
  )
}

export function SiteComponents() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* The REAL shared header on every page (replaces the legacy HeroNav as the production nav).
          Heavy treatment, stacked: full-width preview on top, anatomy below. */}
      <PreviewAnatomy
        id="site-header"
        layout="stack"
        title="Marketing header"
        note="The shared header on every page — frosted sticky bar, centered links, brand-colored social, the Download CTA, and a mobile hamburger."
        preview={<div className="overflow-hidden rounded-card border border-divider"><MarketingHeader /></div>}
        rows={[
          { code: <>.bai-hdr · sticky top-0 z-50 · backdrop-blur(10px) · border-b</>, role: 'Bar — sticky, frosted-glass blur over a hairline bottom border' },
          { code: <>.bai-hdr-inner · max-w-1640 · px-48 py-13 · flex justify-between</>, role: 'Layout — centered max-width row, brand left / actions right' },
          { code: <>.bai-hdr-brand · img 32 + Wordmark → /seo</>, role: 'Brand — icon + wordmark, links to the marketing home' },
          { code: <>.bai-hdr-links · gap-30 · 15px / 500 · <Tok to="icons">External</Tok> ↗</>, role: 'Nav — primary links; external ones get the ↗ glyph' },
          { code: <>.bai-hdr-social · is-discord / is-x / is-reddit</>, role: 'Social — each glyph in its platform brand color' },
          { code: <>.bai-hdr-cta · <Tok to="tok-cta-gradient">cta-gradient</Tok> · radius-pill · <Tok to="tok-shadow-cta">shadow-cta</Tok> + <Tok to="icons">Arrow</Tok></>, role: 'CTA — the brand Download pill with a trailing sliding arrow' },
          { code: <>.bai-hdr-burger + .bai-hdr-menu + scrim · ≤1080</>, role: 'Mobile — links collapse to a hamburger → opaque menu + scrim' },
        ]}
      />

      {/* The REAL shared footer */}
      <Block id="site-footer" full title="Marketing footer"
        note="The shared footer — brand lockup · tagline · social · link columns · copyright.">

        <div className="overflow-hidden rounded-card border border-divider"><MarketingFooter /></div>
      </Block>

      {/* CTA button family + the Arrow brand primitive */}
      <Block id="site-buttons" title="CTA buttons + Arrow"
        note="Primary CTA pill + hairline secondary. The → Arrow trails every primary CTA and slides on hover.">

        <div className="v-site sg-demo flex flex-wrap items-center gap-4">
          <a className="site-btn" href="#0">Download BlueAI<Arrow /></a>
          <a className="site-btn-ghost" href="#0">Learn more</a>
        </div>
      </Block>

      {/* Numbered steps */}
      <Block id="site-steps" title="Numbered steps"
        note="Gradient-numbered vertical step list.">

        <div className="v-site sg-demo"><div className="site-steps">
          {[['01', 'Post on r/BlueStacks', 'Share genuine feedback or a skill you built.'], ['02', 'Open our Discord', 'Head to the #claim-free-credits channel.']].map(([n, t, d]) => (
            <div className="site-step" key={n}><span className="site-step-n">{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>
          ))}
        </div></div>
      </Block>

      {/* How it works 4-up */}
      <Block id="site-hiw" title="How it works"
        note="Numbered how-it-works grid — per-agent heading.">

        <div className="v-site sg-demo"><div className="site-hiw">
          {[['Tell us your targets', 'Roles, locations, seniority.'], ['We run the agent', 'It searches live roles that fit.'], ['Matches by email', 'A shortlist with apply links.'], ['Apply on autopilot', 'Download BlueAI to auto-apply.']].map(([t, d], i) => (
            <div className="site-hiw-card" key={t}><span className="site-hiw-n">{i + 1}</span><h4>{t}</h4><p>{d}</p></div>
          ))}
        </div></div>
      </Block>

      {/* Dark CTA band */}
      <Block id="site-cta-band" full title="Dark CTA band"
        note="Dark-gradient closing CTA — eyebrow · headline · sub · white button.">

        <div className="v-site sg-demo"><div className="site-cta-band">
          <span className="site-eyebrow">Ready when you are</span>
          <h2 className="site-cta-h">Stop filling out the same form</h2>
          <p className="site-cta-sub">Let BlueAI search, tailor and apply while you focus on the interviews.</p>
          <a className="site-btn" href="#0">Get BlueAI free<Arrow /></a>
        </div></div>
      </Block>

      {/* FAQ accordion */}
      <Block id="site-faq" full title="FAQ accordion"
        note="Crawlable accordion — answers stay in the DOM. The SEO page has a near-identical SeoFaq (consolidation candidate).">

        <div className="v-site sg-demo"><SiteFaq items={[
          { q: 'What is an AI job application agent?', a: 'It opens a job app, reads a listing, decides if it fits, fills the form, answers screening questions, and submits — the way a person would.' },
          { q: 'Is it safe for my accounts?', a: 'When you run it yourself, it acts inside your own logged-in session and never hands your data to a third party. You approve each submit and can stop any time.' },
        ]} /></div>
      </Block>
    </div>
  )
}
