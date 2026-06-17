'use client'
// Page-specific components/patterns from the finalized live-demo homepage (.ldv2) and
// social-rewards (.v-rewards). Each sample renders under its real page scope so the scoped CSS
// applies; the live animated scenes / backdrop / motion are noted, not re-run.
import '@/styles/social-rewards.css'
import '@/styles/live-demo-v2.css'
import '@/styles/style-guide.css'
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
      {/* ── Live Demo Homepage (/live-demo-v2) — the finalized homepage on the DS ── */}

      {/* Worker card — the homepage centerpiece. Heavy treatment: icon tile · title · See-it-work · scene · result chip. */}
      <PreviewAnatomy id="ldv2-worker" scope="ldv2" title="Worker card"
        note="The homepage centerpiece — a live agent card on the spotlight loop. Icon tile · title · 'See it work' link · the running agent scene · a result chip (the receipt)."
        preview={
          <div className="ldv2-workers" style={{ gridTemplateColumns: '1fr', maxWidth: 360, margin: 0 }}>
            <div className="ldv2-worker is-active">
              <div className="ldv2-worker-top">
                <div className="ldv2-worker-icon icon-creator">🎬</div>
                <h3>AI Video Creator</h3>
                <a className="ldv2-worker-cta" href="#0">See it work<Arrow size={14} /></a>
              </div>
              <p>Writes, generates, and posts faceless short videos to YouTube, TikTok, and Reels.</p>
              <div className="ldv2-stage" style={{ alignItems: 'center', justifyContent: 'center' }}><span className="text-2xs text-ink-muted">↗ live agent scene on /live-demo-v2</span></div>
              <div className="ldv2-result">📈 12,400 views in week one</div>
            </div>
          </div>
        }
        rows={[
          { code: <>.ldv2-worker · bg-canvas · border-divider · radius-18 · .is-active lifts -6px + iris border + glow</>, role: 'Card — hairline tile; the spotlighted one lifts with a brand glow' },
          { code: <>.ldv2-worker-top · .ldv2-worker-icon 44 (radius-12, per-agent gradient) · h3 · .ldv2-worker-cta</>, role: 'Top — gradient icon tile · title · the "See it work" link pushed right' },
          { code: <>.ldv2-worker-cta · <Tok to="tok-mkt-blue">--bai-mkt-blue</Tok> + <Tok to="icons">Arrow</Tok> 14 · gap nudges on hover · ≤560px → own line</>, role: 'CTA — quiet blue link to the agent page; arrow nudges on hover' },
          { code: <>.ldv2-stage · bg-surface · border-divider · radius-12 · h-178</>, role: 'Stage — the legacy agent scene runs here on the spotlight loop (static in the SG)' },
          { code: <>.ldv2-result · green wash · --bai-mkt-green-ink · radius-10</>, role: 'Result chip — the receipt: what the agent shipped' },
        ]}
      />

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

      {/* ── Social Rewards (/social-rewards) ── */}
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

      <Block id="rw-check" scope="v-rewards" title="Quality-check row"
        note="Green-check criterion row.">
        <div className="sr-check"><span className="sr-check-ic"><Check /></span><p>At least 4–5 sentences with real substance — no low-effort or AI-generated content.</p></div>
      </Block>

      <Block id="rw-faq" scope="v-rewards" title="FAQ-grid card"
        note="Static Q/A card — social-rewards uses these instead of the collapsing accordion.">
        <div className="sr-faq-card"><h3>How many credits do I get?</h3><p>Up to 1,000 free BlueAI credits, once per user.</p></div>
      </Block>

      <Block id="rw-collage" scope="v-rewards" full title="Collage hero"
        note="Scattered, rotated, faded post cards bleeding off both edges behind the headline — see it live on /social-rewards.">
        <p className="text-2xs text-ink-muted">↗ Live on the Social Rewards page.</p>
      </Block>
    </div>
  )
}
