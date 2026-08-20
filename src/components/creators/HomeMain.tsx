// Above-the-fold markup: the ambient stars, the hero copy + CTA, the machine stage, and the fleet
// strip. Ported 1:1 from the mock (alt-copy.html) EXCEPT the stage — the mock's CSS-drawn desk and
// laptop were replaced on 2026-08-19 by MachineStage.tsx (rotating photoreal machines, each running
// a task), which is where the CEO's vision brief landed. Pure markup either way: every behaviour
// (task lifecycle, earnings credit, chip flights) lives in useHomeFx.ts, which mutates nodes by id.
// React never re-renders this subtree, which is what makes that direct mutation safe.

import MachineStage from './MachineStage'

const STARS = [
  { left: '8%', top: '12%', size: 3, delay: 0 },
  { left: '22%', top: '30%', size: 2, delay: 0.8 },
  { left: '76%', top: '9%', size: 3, delay: 1.5 },
  { left: '90%', top: '34%', size: 2, delay: 2.2 },
  { left: '58%', top: '6%', size: 2, delay: 0.4 },
  { left: '38%', top: '14%', size: 2, delay: 1.1 },
]

function SparkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
    </svg>
  )
}

function ArrowIcon() {
  // F26: strokeWidth 3 — 2.4 rendered ~1.5px next to the filled spark
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

export default function HomeMain() {
  return (
    <>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay ? `${s.delay}s` : undefined }}
        />
      ))}

      <main>
        <h1 className="rv d1">
          Own an AI that <span className="grad">works for you.</span>
        </h1>
        <p className="sub rv d2">
          BlueAI is an AI worker you own. It finds real work from brands, completes it, and pays you.
        </p>
        <div className="rv d3">
          {/* id="hero-cta" — the header watches this leave the viewport to swap its own quiet CTA
              for the gradient pill (HomeHeader.tsx), same IO mechanism the mini ticker uses. */}
          <button className="btn" type="button" id="hero-cta">
            <SparkIcon />
            Join the first wave
            <ArrowIcon />
          </button>
        </div>

        <MachineStage />

        {/* the vision in one strip: the same worker, a growing set of machines.
            id="machines" is a Phase 1 header anchor target (scroll-margin in creators.css). */}
        <div className="fleet rv d5" id="machines">
          <p className="fleet-label">One worker · Any machine you own</p>
          <div className="fleet-row">
            <div className="slot live">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="12" rx="2" />
                <path d="M8 20h8M12 16v4" />
              </svg>
              <span className="slot-name">Your PC</span>
              <span className="slot-tag">
                <span className="tick-dot" /> Earning now
              </span>
            </div>
            <div className="slot">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="5" y="9" width="14" height="10" rx="3" />
                <path d="M12 9V6" />
                <circle cx="12" cy="4.6" r="1.2" />
                {/* F18: r=1 — 0.4 was a sub-pixel smudge */}
                <circle cx="9.4" cy="13.6" r="1" fill="currentColor" />
                <circle cx="14.6" cy="13.6" r="1" fill="currentColor" />
              </svg>
              <span className="slot-name">Home robots</span>
              <span className="slot-tag">Soon</span>
            </div>
            <div className="slot">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 16h16M5.5 16l1.5-4.6h10L18.5 16M9 11.4l1-2.4h4l1 2.4" />
                <circle cx="7.6" cy="17.6" r="1.4" />
                <circle cx="16.4" cy="17.6" r="1.4" />
              </svg>
              <span className="slot-name">Robotaxis</span>
              <span className="slot-tag">Soon</span>
            </div>
            <div className="slot">
              {/* F26: circled plus — the bare plus had ~1/3 the ink of its siblings */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 8.5v7M8.5 12h7" />
              </svg>
              <span className="slot-name">Whatever&apos;s next</span>
              {/* F30: "Soon" on the unnamed read templated */}
              <span className="slot-tag">Open slot</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
