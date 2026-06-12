'use client'
// Page-specific components/patterns from the SEO homepage (.v-seo), the marketing homepage
// (.bai-home), and social-rewards (.v-rewards). Each sample renders under its real page scope so
// the scoped CSS applies; the live animated heroes/backdrop are noted, not re-run.
import '@/styles/seo-home.css'
import '@/styles/homepage.css'
import '@/styles/social-rewards.css'
import '@/styles/style-guide.css'
import { Sparkle } from '@/components/Sparkle'
import { Arrow } from '@/components/Arrow'

function Block({ id, title, note, scope, full, children }: { id: string; title: string; note?: React.ReactNode; scope: string; full?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-8 rounded-field border border-divider bg-surface p-5${full ? ' lg:col-span-2' : ''}`}>
      <p className="bai-section-label mb-1">{title}</p>
      {note && <p className="mb-4 text-2xs leading-relaxed text-ink-muted">{note}</p>}
      <div className={`${scope} sg-demo`}>{children}</div>
    </section>
  )
}

const Check = () => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>

export function MarketingPages() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* SEO task-hub card */}
      <Block id="seo-task" scope="v-seo" title="SEO task-hub card"
        note="Internal-linking hub tile — icon · LIVE badge · title · desc · verb link.">

        <div className="seo-task-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {[['💼', 'Apply to jobs', true], ['🎬', 'Make a video', true]].map(([ic, t, live]) => (
            <a className="seo-task" href="#0" key={t as string}>
              <div className="seo-task-top"><span className="seo-task-icon">{ic}</span>{live && <span className="seo-live"><span className="dot" />LIVE</span>}</div>
              <h3>{t}</h3><p>Point BlueAI at it and the agent runs the task end-to-end on your device.</p>
              <span className="seo-task-link">Explore <span className="arr">→</span></span>
            </a>
          ))}
        </div>
      </Block>

      {/* SEO what-is explainer card */}
      <Block id="seo-info" scope="v-seo" title="What-is card"
        note="Explainer card — icon · title · description.">

        <div className="seo-trio" style={{ gridTemplateColumns: '1fr' }}>
          <div className="seo-info-card"><div className="seo-info-icon">🧠</div><h3>It reads the screen</h3><p>BlueAI operates the real apps on screen — not a brittle API that breaks on a layout change.</p></div>
        </div>
      </Block>

      {/* SEO comparison stage card */}
      <Block id="seo-stage" scope="v-seo" title="Comparison stage"
        note="Comparison stage — the highlighted variant marks BlueAI as the 'worker'.">

        <div className="seo-stages" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="seo-stage"><span className="seo-stage-tag">Chatbot</span><h3>Answers questions</h3><p>Replies in text. You still do the task.</p></div>
          <div className="seo-stage is-blue"><span className="seo-stage-tag">Worker</span><h3>Does the task</h3><p>Operates the apps and completes it for you.</p></div>
        </div>
      </Block>

      {/* SEO hero grid + backdrop — page-specific animated, noted */}
      <Block id="seo-hero" scope="v-seo" title="SEO hero + backdrop"
        note="Animated 2×2 agent grid + ambient backdrop — see them live on /seo.">

        <p className="text-2xs text-ink-muted">↗ Live on the SEO homepage.</p>
      </Block>

      {/* SEO close CTA band — distinct from the dark .site-cta-band */}
      <Block id="seo-cta" scope="v-seo" full title="SEO CTA band"
        note="The SEO bright-blue close CTA — a separate, brighter treatment from the dark inner-page CTA band.">

        <div className="seo-close">
          <h2 className="seo-close-h"><span>Stop doing the busywork.</span><span><br />Start reviewing it.</span></h2>
          <p className="seo-close-sub"><span>Hand your first task to an AI worker today.</span><span><br />Free on Windows and Mac, inside BlueStacks.</span></p>
          <a className="seo-close-cta" href="#0"><Sparkle size={18} />Download BlueAI for PC<Arrow /></a>
        </div>
      </Block>

      {/* Homepage feature row */}
      <Block id="home-feature" scope="bai-home" full title="Feature row"
        note="Alternating feature row — number · category · title · desc · chat-quote, opposite a product image (placeholder shown).">

        <div className="features">
          <article className="feat">
            <div className="feat-text">
              <div className="feat-kicker"><span className="feat-num">01</span><span className="feat-cat">Search</span></div>
              <h3 className="feat-title">Find the latest codes for any game</h3>
              <p className="feat-desc">Ask BlueAI and it searches, opens the source, and brings back what actually works.</p>
              <span className="feat-quote">“Find the latest codes for this game.”</span>
            </div>
            <div className="feat-visual"><div style={{ aspectRatio: '4 / 3', borderRadius: 20, background: 'linear-gradient(160deg, #e7e3ff, #dfe6ff)' }} /></div>
          </article>
        </div>
      </Block>

      {/* Homepage skill card */}
      <Block id="home-skill" scope="bai-home" title="Skill card"
        note="Skill card — icon · category · title · desc · rating · Try link.">

        <div className="skill-grid" style={{ gridTemplateColumns: '1fr' }}>
          <article className="skill">
            <div className="skill-top"><span className="skill-ic" style={{ background: '#e7e3ff' }}>🧠</span><span className="skill-cat">Productivity</span></div>
            <h4>Daily codes finder</h4>
            <p>Pulls fresh redemption codes for your games every morning.</p>
            <div className="skill-foot"><span className="skill-rate"><span className="star">★</span><b>4.8</b><span>· 1.2k</span></span><a className="skill-try" href="#0">+ Try on BlueAI</a></div>
          </article>
        </div>
      </Block>

      {/* Rewards post card */}
      <Block id="rw-card" scope="v-rewards" title="Reddit post card"
        note="Reddit testimonial card — used in the collage hero.">

        <div style={{ maxWidth: 300 }}>
          <div className="sr-card">
            <div className="sr-card-top"><span className="sr-dot" /><span className="sr-rsub">r/BlueStacks</span><span className="sr-user">u/pixel_forge</span><span className="sr-badge">+1,000</span></div>
            <p>Built a skill that auto-grinds dailies across 3 games. Mind blown.</p>
            <div className="sr-meta"><span>▲ 1.2k</span><span>💬 184</span></div>
          </div>
        </div>
      </Block>

      {/* Rewards quality-check row */}
      <Block id="rw-check" scope="v-rewards" title="Quality-check row"
        note="Green-check criterion row.">

        <div className="sr-check"><span className="sr-check-ic"><Check /></span><p>At least 4–5 sentences with real substance — no low-effort or AI-generated content.</p></div>
      </Block>

      {/* Rewards FAQ-grid card */}
      <Block id="rw-faq" scope="v-rewards" title="FAQ-grid card"
        note="Static Q/A card — social-rewards uses these instead of the collapsing accordion.">

        <div className="sr-faq-card"><h3>How many credits do I get?</h3><p>Up to 1,000 free BlueAI credits, once per user.</p></div>
      </Block>

      {/* Rewards collage hero — note (taste 23) */}
      <Block id="rw-collage" scope="v-rewards" full title="Collage hero"
        note="Scattered, rotated, faded post cards bleeding off both edges behind the headline — see it live on /social-rewards.">

        <p className="text-2xs text-ink-muted">↗ Live on the Social Rewards page.</p>
      </Block>
    </div>
  )
}
