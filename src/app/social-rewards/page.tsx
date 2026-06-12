import type { Metadata } from 'next'
import '@/styles/site.css'
import '@/styles/social-rewards.css'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { SiteReveal } from '@/components/site/SiteReveal'
import { RewardsHero } from '@/components/rewards/RewardsHero'
import { Arrow } from '@/components/Arrow'
import { RW_STEPS, RW_QUALITY, RW_FAQ, REDDIT_URL } from '@/lib/rewards-data'

export const metadata: Metadata = {
  title: 'BlueAI Social Rewards | Get up to 1,000 Free Credits',
  description:
    'Share genuine feedback or a skill you built on r/BlueStacks and earn up to 1,000 free BlueAI AI credits. Post, share, claim.',
}

const Check = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>

export default function SocialRewardsPage() {
  return (
    <div className="v-site v-rewards">
      <MarketingHeader />
      <SiteReveal />
      <main>
        <RewardsHero />

        <section className="sr-section is-steps" id="how">
          <div className="site-wrap">
            <div className="sr-head" data-reveal><span className="site-eyebrow">How it works</span><h2 className="site-h2">Five steps to your credits</h2></div>
            <div className="site-steps">
              {RW_STEPS.map((s) => (
                <div className="site-step" key={s.n}><span className="site-step-n">{s.n}</span><div><h3>{s.t}</h3><p>{s.d}</p></div></div>
              ))}
            </div>
          </div>
        </section>

        <section className="sr-section">
          <div className="site-wrap sr-quality">
            <div className="sr-q-head" data-reveal><span className="site-eyebrow">Quality bar</span><h2 className="site-h2">What makes a qualifying post</h2><p className="site-sub">We read every submission. Posts that meet these criteria get approved fastest.</p></div>
            <div className="sr-checklist">
              {RW_QUALITY.map((q) => (
                <div className="sr-check" key={q}><span className="sr-check-ic"><Check /></span><p>{q}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="sr-section">
          <div className="site-wrap">
            <div className="sr-head" data-reveal><span className="site-eyebrow">FAQ</span><h2 className="site-h2">Frequently asked questions</h2></div>
            <div className="sr-faq-grid">
              {RW_FAQ.map((f) => (
                <div className="sr-faq-card" key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="sr-close">
          <div className="site-wrap">
            <div className="site-cta-band" data-reveal>
              <span className="site-eyebrow">Program goes live soon</span>
              <h2 className="site-cta-h">Post, share, claim.</h2>
              <p className="site-cta-sub">Be one of the first to earn credits when Social Rewards opens up. We&rsquo;ll notify the early posters first.</p>
              <a className="site-btn" href={REDDIT_URL} target="_blank" rel="noopener noreferrer">Post on r/BlueStacks<Arrow /></a>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
