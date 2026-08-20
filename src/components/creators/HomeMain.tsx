// Above-the-fold markup, ported 1:1 from the mock (alt-copy.html): the ambient stars, the hero
// copy + CTA, the desk/laptop scene the task loop runs inside, and the fleet strip. Pure markup —
// every behaviour (task rows, earnings credit, chip flights) lives in useHomeFx.ts, which mutates
// the #working/#stack/#amount nodes directly, exactly like the mock's script did. React never
// re-renders any of this, which is what makes that direct mutation safe.
//
// The hero CTA is "Get access" (PM, 2026-08-20, after a word with the team — the last stop of a
// day-long tour: Join the first wave -> Request yours -> Request your AI -> Join the first wave ->
// Get access). "Access" is the thread word now: the apply page pays it off with "when your access
// is approved" and the form's seam row opens "Access starts on your PC". The tour's keepers: no
// scarcity line anywhere on the hero (tried under the button and as an eyebrow chip, cut both
// times), and the returning-user door below the CTA. Both #hero-cta and #hero-signin are wired by
// id from HomepageView — this file stays static markup.

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
            Get access
            <ArrowIcon />
          </button>
          {/* The returning-user door (ported from creator-brand Hero.tsx, PM 2026-08-14 rationale
              kept): "Get access" reads wrong to someone who already has an account — they have
              access; they're getting back in. Small, muted, link-styled; HomepageView wires
              #hero-signin to set the returningUser journey before opening the dialog. */}
          <p className="hero-signin">
            Already have an account?{' '}
            <button type="button" id="hero-signin">Sign in</button>
          </p>
        </div>

        <div className="scene" id="scene">
          {/* Coin icon removed (Appy, 2026-08-19: "remove dollar icon here and make this more
              sleek") — label + amount stacked directly, no icon column, tighter pill in
              creators.css. The bottom-right mini counter that mirrored this pill on scroll is
              gone too (see HomeOverlay.tsx); this is now the money proof's only pill on screen. */}
          <div className="earnings rv d5" id="earnings">
            <span className="label">Earned</span>
            {/* Base-118, whole dollars — the mock's own demo figures (F3a reverted, PM 2026-08-20) */}
            <span className="amount" id="amount">$118</span>
          </div>

          <div className="desk">
            <div className="desk-top" />
            <div className="desk-leg l" />
            <div className="desk-leg r" />
          </div>
          <div className="laptop">
            <div className="lap-screen" id="lap-screen">
              <div className="scr-ui">
                <div className="scr-head">
                  <span className="scr-brand">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <defs>
                        <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#a78bff" />
                          <stop offset="1" stopColor="#3fd4f5" />
                        </linearGradient>
                      </defs>
                      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" fill="url(#bg1)" />
                    </svg>
                    BlueAI
                  </span>
                  <span className="scr-status">
                    <span className="dot" /> Working
                  </span>
                </div>
                <div id="working" />
                <div id="stack" />
              </div>
            </div>
            <div className="lap-deck" />
          </div>
        </div>

        {/* the vision in one strip: the same worker, a growing set of machines.
            id="machines" is a Phase 1 header anchor target (scroll-margin in creators.css). */}
        <div className="fleet rv d4" id="machines">
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
