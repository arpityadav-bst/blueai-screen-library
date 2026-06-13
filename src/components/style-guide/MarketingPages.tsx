'use client'
// Page-specific components/patterns from the SEO homepage (.v-seo), the marketing homepage
// (.bai-home), and social-rewards (.v-rewards). Each sample renders under its real page scope so
// the scoped CSS applies; the live animated heroes/backdrop are noted, not re-run.
import '@/styles/seo-home.css'
import '@/styles/homepage.css'
import '@/styles/social-rewards.css'
import '@/styles/live-demo-v2.css'
import '@/styles/style-guide.css'
import { Sparkle } from '@/components/Sparkle'
import { Arrow } from '@/components/Arrow'
import { PreviewAnatomy, Tok } from '@/components/style-guide/Anatomy'

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
      {/* SEO task card — heavy treatment (the SEO homepage's internal-linking hub tile) */}
      <PreviewAnatomy id="seo-task" scope="v-seo" title="SEO task card"
        note="The internal-linking hub tile from the SEO homepage — icon · LIVE badge · title · description · verb link."
        preview={
          <div className="seo-task-grid" style={{ gridTemplateColumns: '1fr', maxWidth: 260 }}>
            <a className="seo-task" href="#0">
              <div className="seo-task-top"><span className="seo-task-icon">💼</span><span className="seo-live"><span className="dot" />LIVE</span></div>
              <h3>Apply to jobs</h3><p>Point BlueAI at it and the agent runs the task end-to-end on your device.</p>
              <span className="seo-task-link">Explore <span className="arr">→</span></span>
            </a>
          </div>
        }
        rows={[
          { code: <>.seo-task · bg-canvas · border-divider · radius-16 · hover lift + iris border</>, role: 'Card — hairline tile, lifts and borders iris on hover' },
          { code: <>.seo-task-top · .seo-task-icon 36 (radius-10) + .seo-live badge</>, role: 'Top — icon tile + a LIVE status badge' },
          { code: <>h3 · <Tok to="type">font-head</Tok> 16.5 · seo-slate</>, role: 'Title — Space Grotesk display, slate' },
          { code: <>p · 13.5 · flex-1</>, role: 'Body — description; flex-1 pushes the link to the bottom' },
          { code: <>.seo-task-link · seo-blue + .arr slides on hover</>, role: 'Link — verb + arrow that slides right on hover' },
        ]}
      />

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

      {/* ── Live Demo Homepage (/live-demo-v2) — the DS redesign of the PM funnel ── */}
      <Block id="ldv2-trust" scope="ldv2" title="Trust row"
        note="Star rating + proof stats, pulled up beside the hire CTA — grounds the headline.">
        <div className="ldv2-trust">
          <span className="ldv2-stars">★★★★★</span>
          <span className="ldv2-ti">7.6M run apps on BlueStacks</span>
          <span className="ldv2-tdot" />
          <span className="ldv2-ti">4 workers live today</span>
        </div>
      </Block>

      <Block id="ldv2-stats" scope="ldv2" full title="Stats band"
        note="Border-framed proof band — numbers count up on scroll-enter (Space Grotesk, tabular).">
        <div className="ldv2-stats"><div className="ldv2-stats-grid" style={{ padding: '20px 0' }}>
          {[['7.6M', 'run apps on BlueStacks'], ['4', 'workers live today'], ['30+', 'money-making skills'], ['100%', 'of spends you approve']].map(([n, l]) => (
            <div className="ldv2-stat" key={l}><div className="n">{n}</div><div className="l">{l}</div></div>
          ))}
        </div></div>
      </Block>

      <Block id="ldv2-quote" scope="ldv2" title="Testimonial card"
        note="Stars · quote · avatar (gradient) + name/role. Curly quotes (taste 25).">
        <div style={{ maxWidth: 320 }}><div className="ldv2-quote">
          <div className="ldv2-stars">★★★★★</div>
          <p>“I named mine Penny and set a $50 budget. First week it paid for itself.”</p>
          <div className="ldv2-who"><div className="ldv2-av" style={{ background: 'linear-gradient(135deg,#8b5cf6,#d946ef)' }}>R</div><div><div className="nm">Riya M.</div><div className="rl">Online shopper</div></div></div>
        </div></div>
      </Block>

      <Block id="ldv2-why" scope="ldv2" full title="Why bento"
        note="Reasons grid — one brand-gradient accent card carries the key claim, the rest are hairline.">
        <div className="ldv2-whygrid">
          <div className="ldv2-why"><div className="ic">📱</div><h3>Works in real apps</h3><p>It taps and reads screens like a person.</p></div>
          <div className="ldv2-why is-accent"><div className="ic">✋</div><h3>You stay in control</h3><p>Never spends or posts without your tap.</p></div>
          <div className="ldv2-why"><div className="ic">⚡</div><h3>Set up in minutes</h3><p>Name it, fund a budget, it starts.</p></div>
        </div>
      </Block>

      <Block id="ldv2-motion" scope="ldv2" full title="Signature motion"
        note="Two page-local motions — see them live on /live-demo-v2. Both framer-motion, reduced-motion-gated.">
        <p className="text-2xs text-ink-muted">↗ <b>Widget assembly</b>: a blueprint wireframe draws, then a beam wipes it away to reveal the live widget. <b>Docking widget</b>: scrolling past the hero FLIPs the live panel to a corner mini so the demo stays reachable. The hire widget itself is the PM&rsquo;s artifact (iframe) — reskinned to the DS, not a documented DS component.</p>
      </Block>
    </div>
  )
}
