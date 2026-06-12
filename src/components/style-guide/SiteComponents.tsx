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
      {/* The REAL shared header on every page (replaces the legacy HeroNav as the production nav) */}
      <Block id="site-header" full title="Marketing header — the shared chrome on EVERY page"
        note={<>Source: <span className="font-mono">components/MarketingHeader.tsx</span> + <span className="font-mono">styles/header.css</span> (scoped to <span className="font-mono">.bai-hdr</span>, route-independent). Logo + centered links (Social Rewards / Developer open ↗) + divider + brand-colored social + “Download for PC” CTA; mobile = hamburger + opaque menu + scrim. This is what ships on the SEO homepage + all inner pages — NOT the legacy hero-prototype nav above.</>}>
        <div className="overflow-hidden rounded-card border border-divider"><MarketingHeader /></div>
      </Block>

      {/* The REAL shared footer */}
      <Block id="site-footer" full title="Marketing footer — shared on every page"
        note={<>Source: <span className="font-mono">components/MarketingFooter.tsx</span> + <span className="font-mono">styles/footer.css</span> (<span className="font-mono">.bai-ftr</span>). Brand lockup + tagline + brand-colored social + link columns + copyright.</>}>
        <div className="overflow-hidden rounded-card border border-divider"><MarketingFooter /></div>
      </Block>

      {/* CTA button family + the Arrow brand primitive */}
      <Block id="site-buttons" title="Site CTA buttons + Arrow (the 3rd brand primitive)"
        note={<>The marketing CTA pill (<span className="font-mono">.site-btn</span>, cta-gradient) used on all inner pages + its hairline secondary (<span className="font-mono">.site-btn-ghost</span>). The <span className="font-mono">&lt;Arrow/&gt;</span> (<span className="font-mono">components/Arrow.tsx</span>) trails every primary CTA and slides on hover — the de-facto 3rd brand primitive alongside Wordmark + Sparkle.</>}>
        <div className="v-site sg-demo flex flex-wrap items-center gap-4">
          <a className="site-btn" href="#0">Download BlueAI<Arrow /></a>
          <a className="site-btn-ghost" href="#0">Learn more</a>
        </div>
      </Block>

      {/* Numbered steps */}
      <Block id="site-steps" title="Numbered steps — vertical (.site-steps)"
        note="Gradient-numbered vertical step list (e.g. social-rewards “5 steps to your credits”).">
        <div className="v-site sg-demo"><div className="site-steps">
          {[['01', 'Post on r/BlueStacks', 'Share genuine feedback or a skill you built.'], ['02', 'Open our Discord', 'Head to the #claim-free-credits channel.']].map(([n, t, d]) => (
            <div className="site-step" key={n}><span className="site-step-n">{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>
          ))}
        </div></div>
      </Block>

      {/* How it works 4-up */}
      <Block id="site-hiw" title="How it works — compact 4-up (.site-hiw)"
        note="The numbered how-it-works grid on every agent page (heading is per-agent via hiwHeading).">
        <div className="v-site sg-demo"><div className="site-hiw">
          {[['Tell us your targets', 'Roles, locations, seniority.'], ['We run the agent', 'It searches live roles that fit.'], ['Matches by email', 'A shortlist with apply links.'], ['Apply on autopilot', 'Download BlueAI to auto-apply.']].map(([t, d], i) => (
            <div className="site-hiw-card" key={t}><span className="site-hiw-n">{i + 1}</span><h4>{t}</h4><p>{d}</p></div>
          ))}
        </div></div>
      </Block>

      {/* Dark CTA band */}
      <Block id="site-cta-band" full title="Dark CTA band — shared close section (.site-cta-band)"
        note="The dark-gradient closing CTA on social-rewards + all 4 agent pages: eyebrow + headline + sub + white button.">
        <div className="v-site sg-demo"><div className="site-cta-band">
          <span className="site-eyebrow">Ready when you are</span>
          <h2 className="site-cta-h">Stop filling out the same form</h2>
          <p className="site-cta-sub">Let BlueAI search, tailor and apply while you focus on the interviews.</p>
          <a className="site-btn" href="#0">Get BlueAI free<Arrow /></a>
        </div></div>
      </Block>

      {/* FAQ accordion */}
      <Block id="site-faq" full title="FAQ accordion (SiteFaq) — crawlable"
        note={<>Source: <span className="font-mono">components/site/SiteFaq.tsx</span>. Answers stay in the DOM (grid-rows 0fr→1fr) so they’re crawlable. <b className="text-ink-heading">Note:</b> the SEO page has a near-identical <span className="font-mono">SeoFaq</span> — a Gate-3 “componentize at 2” candidate to consolidate.</>}>
        <div className="v-site sg-demo"><SiteFaq items={[
          { q: 'What is an AI job application agent?', a: 'It opens a job app, reads a listing, decides if it fits, fills the form, answers screening questions, and submits — the way a person would.' },
          { q: 'Is it safe for my accounts?', a: 'When you run it yourself, it acts inside your own logged-in session and never hands your data to a third party. You approve each submit and can stop any time.' },
        ]} /></div>
      </Block>
    </div>
  )
}
