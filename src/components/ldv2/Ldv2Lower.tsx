'use client'
import { motion } from 'framer-motion'
import { Wordmark } from '@/components/Wordmark'
import { Arrow } from '@/components/Arrow'
import { LDV2_WHY, LDV2_QUOTES, LDV2_FOOTER } from '@/lib/ldv2-data'

const EASE = [0.22, 0.61, 0.36, 1] as const
const card = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' } as const,
  transition: { duration: 0.5, delay: i * 0.07, ease: EASE },
})

export function Ldv2Why() {
  return (
    <section className="ldv2-section" id="why">
      <div className="ldv2-wrap">
        <div className="ldv2-secthead">
          <span className="ldv2-eyebrow">Why BlueAI</span>
          <h2 className="ldv2-h2">A worker that does the work, not a chatbot that talks.</h2>
          <p className="ldv2-sub">An assistant tells you what to do. A worker opens the apps and does it.</p>
        </div>
        <div className="ldv2-whygrid">
          {LDV2_WHY.map((w, i) => (
            <motion.div className={`ldv2-why${'accent' in w && w.accent ? ' is-accent' : ''}`} key={w.t} {...card(i)}>
              <div className="ic">{w.icon}</div>
              <h3>{w.t}</h3>
              <p>{w.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Ldv2Quotes() {
  return (
    <section className="ldv2-section" id="reviews">
      <div className="ldv2-wrap">
        <div className="ldv2-secthead">
          <span className="ldv2-eyebrow">Early users</span>
          <h2 className="ldv2-h2">People put their worker to work.</h2>
        </div>
        <div className="ldv2-quotes">
          {LDV2_QUOTES.map((q, i) => (
            <motion.div className="ldv2-quote" key={q.nm} {...card(i)}>
              <div className="ldv2-stars">★★★★★</div>
              <p>{q.q}</p>
              <div className="ldv2-who">
                <div className="ldv2-av" style={{ background: q.grad }}>{q.av}</div>
                <div><div className="nm">{q.nm}</div><div className="rl">{q.rl}</div></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Ldv2Cta() {
  return (
    <div className="ldv2-ctaband">
      <motion.div className="inner" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: EASE }}>
        <h2>Your worker is one name away.</h2>
        <p>Hire it, name it, and watch it go to work on your money today.</p>
        <a className="ldv2-btn-white" href="#hire">Hire your worker<Arrow size={16} /></a>
        <div className="ldv2-gtag">🛡️ Backed by a 50% money-back guarantee on month one</div>
      </motion.div>
    </div>
  )
}

export function Ldv2Footer() {
  return (
    <footer className="ldv2-footer">
      <div className="ldv2-wrap">
        <div className="ldv2-fgrid">
          <div className="ldv2-fcol">
            <span className="ldv2-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/blueai-icon-RzIisCsb.png" alt="" width={30} height={30} style={{ borderRadius: '50%' }} />
              <Wordmark size={20} />
            </span>
            <p className="ldv2-blurb">{LDV2_FOOTER.blurb}</p>
          </div>
          {LDV2_FOOTER.cols.map((c) => (
            <div className="ldv2-fcol" key={c.head}>
              <h4>{c.head}</h4>
              {c.links.map(([href, label]) => <a key={label} href={href}>{label}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="ldv2-fbottom"><span>© 2026 BlueStacks. All rights reserved.</span><span>bluestacks.ai</span></div>
    </footer>
  )
}
