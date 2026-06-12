import '@/styles/site.css'
import '@/styles/agent.css'
import type { ReactNode } from 'react'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { SiteReveal } from '@/components/site/SiteReveal'
import { SiteFaq } from '@/components/site/SiteFaq'
import { Sparkle } from '@/components/Sparkle'
import { Arrow } from '@/components/Arrow'
import { DOWNLOAD_URL } from '@/lib/site-data'
import { AGENTS, type AgentData } from '@/lib/agents-data'

// Shared shell for the 4 agent pages: nav(Download) + hero(copy + demo) + optional feature
// section + what-is + how-it-works + FAQ + more-agents + dark CTA + footer.
export function AgentShell({ data, demo, feature, heroAside }: { data: AgentData; demo: ReactNode; feature?: ReactNode; heroAside?: ReactNode }) {
  const others = Object.values(AGENTS).filter((a) => a.slug !== AGENTS[data.key].slug)
  return (
    <div className="v-site v-agent">
      <MarketingHeader />
      <SiteReveal />
      <main>
        <section className="ag-hero">
          <div className="ag-hero-text">
            <span className="site-eyebrow">{data.eyebrow}</span>
            <h1 className="ag-h1">{data.h1[0]}<span className="site-grad">{data.h1[1]}</span>{data.h1[2]}</h1>
            <p className="ag-sub">{data.sub}</p>
            {heroAside ?? (
              <div className="ag-hero-cta">
                <a className="site-btn" href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"><Sparkle size={18} />Download BlueAI<Arrow /></a>
              </div>
            )}
            {data.disclaimer && <p className="ag-disclaimer">{data.disclaimer}</p>}
          </div>
          <div className="ag-demo">{demo}</div>
        </section>

        {feature}

        {data.whatIs && data.whatIs.length > 0 && (
          <section className="ag-section is-anchor" id="what-is">
            <div className="site-wrap ag-whatis" data-reveal>
              <span className="site-eyebrow">What it is</span>
              <h2 className="site-h2">{data.whatIsHeading}</h2>
              {data.whatIs.map((p, i) => <p key={i}>{p}</p>)}
              {data.seoBlocks?.map((b) => (
                <div className="ag-seo-block" key={b.h}><h3>{b.h}</h3><p>{b.p}</p></div>
              ))}
            </div>
          </section>
        )}

        <section className="ag-section">
          <div className="site-wrap" data-reveal>
            <span className="site-eyebrow">How it works</span>
            <h2 className="site-h2">{data.hiwHeading ?? 'From targets to done'}</h2>
            <div className="site-hiw">
              {data.hiw.map((s, i) => (
                <div className="site-hiw-card" key={s.t}><span className="site-hiw-n">{i + 1}</span><h4>{s.t}</h4><p>{s.d}</p></div>
              ))}
            </div>
          </div>
        </section>

        {!data.whatIs?.length && data.seoBlocks && data.seoBlocks.length > 0 && (
          <section className="ag-section">
            <div className="site-wrap ag-whatis" data-reveal>
              {data.seoBlocks.map((b) => (
                <div className="ag-seo-block" key={b.h}><h3>{b.h}</h3><p>{b.p}</p></div>
              ))}
            </div>
          </section>
        )}

        <section className="ag-section">
          <div className="site-wrap" data-reveal>
            <span className="site-eyebrow">FAQ</span>
            <h2 className="site-h2">Frequently asked questions</h2>
            <SiteFaq items={data.faq} />
          </div>
        </section>

        <section className="ag-section">
          <div className="site-wrap" data-reveal>
            <span className="site-eyebrow">More BlueAI agents</span>
            <h2 className="site-h2">Explore the other agents</h2>
            <div className="ag-more">
              {others.map((a) => (
                <a className="ag-more-card" href={`/${a.slug}`} key={a.slug}>
                  <span className={`ag-more-ic ${a.ic}`}>{a.icon}</span>
                  <span className="ag-more-tx"><b>{a.label}</b><span>{a.title}</span></span>
                  <Arrow size={16} />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="ag-close">
          <div className="site-wrap">
            <div className="site-cta-band" data-reveal>
              <h2 className="site-cta-h">{data.cta.h}</h2>
              <p className="site-cta-sub">{data.cta.sub}</p>
              <a className="site-btn" href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"><Sparkle size={18} />{data.cta.btn}<Arrow /></a>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
