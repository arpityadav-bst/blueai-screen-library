import '@/styles/hero-options.css'
import { Wordmark } from '@/components/Wordmark'

// Hero design-review chooser — the 3 directions with schematic previews + UX pros/cons.
// Links the live heroes via full-page <a> (each route loads its own scoped CSS, so this
// avoids cross-route style accumulation). Ported from "BlueAI Hero - Options.html".
const OpenArrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>

export default function HeroOptionsPage() {
  return (
    <div className="ho">
      <nav className="nav">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ho-logo" src="/blueai-icon-RzIisCsb.png" alt="BlueAI" width={32} height={32} />
        <Wordmark size={25} />
      </nav>

      <main>
        <p className="eyebrow">Hero — Design Review</p>
        <h1>Three directions for the agent hero.</h1>
        <p className="lede">All three share the brand, layout grid, and the same three live-agent demos (Career, Creator, Finance). They differ in how the agents are showcased — open any to see it run. The strongest for UX and click-through is flagged.</p>

        <div className="grid">
          {/* 1 — Three Cards */}
          <a className="opt" href="/hero/3-cards">
            <div className="thumb">
              <span className="num">1</span>
              <div className="sk sk2">
                <span className="btn" /><span className="ln t" /><span className="ln s" />
                <div className="cards"><span className="blk g" /><span className="blk g" /><span className="blk g" /></div>
              </div>
            </div>
            <div className="meta">
              <h2>Three Cards</h2>
              <p>Centered headline and CTA, with three equal agent cards that play side by side.</p>
              <div className="ux">
                <div className="r pro"><span className="mk">✓</span><span><b>Shows breadth instantly</b> — users grasp there are three distinct agents in one look.</span></div>
                <div className="r con"><span className="mk">✕</span><span><b>Attention splits three ways.</b> Each demo is small and the CTA competes with three cards.</span></div>
              </div>
              <span className="open">Open <OpenArrow /></span>
            </div>
          </a>

          {/* 2 — Stage Original */}
          <a className="opt" href="/hero/stage-original">
            <div className="thumb">
              <span className="num">2</span>
              <div className="sk sk3">
                <div className="top"><span className="btn" /><span className="ln t" /></div>
                <div className="body"><span className="blk stage g" /><div className="rail"><span className="blk" /><span className="blk" /><span className="blk" /></div></div>
              </div>
            </div>
            <div className="meta">
              <h2>Stage + Thumbnails <span style={{ color: 'var(--fg-4)', fontWeight: 500 }}>(original)</span></h2>
              <p>Centered headline and CTA stacked on top, with one big agent stage and a thumbnail rail below.</p>
              <div className="ux">
                <div className="r pro"><span className="mk">✓</span><span><b>One large, legible demo</b> — the agent&apos;s process is easy to follow at full size.</span></div>
                <div className="r con"><span className="mk">✕</span><span><b>Proof sits below the fold.</b> The stacked headline pushes the live demo down.</span></div>
              </div>
              <span className="open">Open <OpenArrow /></span>
            </div>
          </a>

          {/* 3 — Stage (Recommended) */}
          <a className="opt is-rec" href="/hero/stage">
            <div className="thumb">
              <span className="num">3</span>
              <span className="rec">★ Recommended</span>
              <div className="sk sk1">
                <div className="col"><span className="ln a" /><span className="ln b" /><span className="ln c" /><span className="btn" /></div>
                <div className="right"><div className="row"><span className="blk" /><span className="blk" /><span className="blk" /></div><span className="blk stage g" /></div>
              </div>
            </div>
            <div className="meta">
              <h2>Stage + Thumbnails</h2>
              <p>Message on the left; on the right the agent thumbnails sit above one dominant stage that plays in place.</p>
              <div className="ux">
                <div className="r pro"><span className="mk">✓</span><span><b>Value + proof on one screen.</b> Headline, CTA and a large live demo are visible together — and the Download button never leaves the viewport.</span></div>
                <div className="r pro"><span className="mk">✓</span><span><b>One agent at a time</b> stays readable; the thumbnails make the next agent an obvious tap.</span></div>
                <div className="r con"><span className="mk">✕</span><span>Only one agent shows at once — the other two are a tap (or a 5s cycle) away.</span></div>
              </div>
              <span className="open">Open <OpenArrow /></span>
            </div>
          </a>
        </div>
      </main>
    </div>
  )
}
