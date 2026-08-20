// Above-the-fold markup: the ambient pixel rain, the hero copy + CTA, the machine stage, and the
// fleet section. Ported 1:1 from the mock (alt-copy.html) EXCEPT the stage — the mock's CSS-drawn desk and
// laptop were replaced on 2026-08-19 by MachineStage.tsx (rotating photoreal machines, each running
// a task) — and then restored on 2026-08-20 when those machines moved to the sleep section. The
// fleet was an icon strip inline here until 2026-08-20 and is now its own component
// (FleetSection.tsx); it outgrew this file. Pure markup either way: every behaviour
// (task lifecycle, earnings credit, chip flights) lives in useHomeFx.ts, which mutates nodes by id.
// React never re-renders this subtree, which is what makes that direct mutation safe.

import FleetSection from './FleetSection'
import PixelRain from './PixelRain'

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
      <main>
        {/* The sky, and the FIRST child of <main> on purpose: it sizes itself to its parent, so
            <main> is what decides the rain covers exactly the hero and stops at the fleet strip.
            The six fixed-position .star spans it replaces are gone entirely. */}
        <PixelRain />

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
            Get Access
            <ArrowIcon />
          </button>
        </div>

        {/* THE CSS DESK-AND-LAPTOP SCENE IS BACK (Appy, 2026-08-20). It was replaced on 2026-08-19
            by the rotating photoreal machines; those have moved down to "It earns while you
            sleep", and this — the mock's own scene, recovered from fef5388 — is the hero again.
            The earnings pill at the PC's shoulder came back with it a few minutes later, on the
            same day it was restored — money is told twice, per completed row AND as a running
            total. id="scene" is the loop's handle (useLaptopFx). */}
        <div className="scene rv d4" id="scene">
          {/* The running total, back 2026-08-20. Its own `rv d5` so it lands a beat AFTER the scene
              it sits on rather than with it — the money is the payoff of the machine, so it should
              not arrive at the same moment as the machine. No coin icon: label and amount stacked
              tight (see .earnings in creators.css for the two shaping notes). */}
          <div className="earnings rv d5" id="earnings">
            <span className="label">Earned</span>
            {/* F3(a): base-18, toFixed(2) — matches useLaptopFx's cents-level model */}
            <span className="amount" id="amount">$18.00</span>
          </div>

          <div className="desk">
            <div className="desk-top" />
            <div className="desk-leg l" />
            <div className="desk-leg r" />
          </div>
          <div className="laptop">
            <div className="lap-screen" id="lap-screen">
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
              {/* the loop owns both: #working holds the task in flight, #stack the last three
                  completed ones (useLaptopFx) */}
              <div id="working" />
              <div id="stack" />
            </div>
            <div className="lap-deck" />
          </div>
        </div>

      </main>

      <FleetSection />

    </>
  )
}
