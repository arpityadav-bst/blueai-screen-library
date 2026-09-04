// Above-the-fold markup: the ambient pixel rain, the hero copy + CTA, the machine stage, and the
// hero. Ported 1:1 from the mock (alt-copy.html) EXCEPT the stage — the mock's CSS-drawn desk and
// laptop were replaced on 2026-08-19 by a rotating photoreal machine stage — and then restored on
// 2026-08-20 when that stage moved to the sleep section, where it has since been replaced in turn
// by a single still. This scene is the page's only animated device now. The
// fleet section that used to follow the hero here was cut on 2026-08-20. Pure markup either
// way: every behaviour
// (task lifecycle, earnings credit, chip flights) lives in useHomeFx.ts, which mutates nodes by id.
// React never re-renders this subtree, which is what makes that direct mutation safe.

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
            <main> is what decides the rain covers exactly the hero and stops where it ends.
            The six fixed-position .star spans it replaces are gone entirely. */}
        <PixelRain />

        {/* HAND-BROKEN (Appy, 2026-08-21) — the gradient half gets its own line rather than
            wrapping wherever the measure happens to land. The <br> turns Chromium's balancer off
            for this heading (creators.css's wrapping notes carry the trap), which is harmless here
            and only here: both segments are 13-14 characters, so each fits its own measure at every
            width down to 320px, and there is nothing left for the balancer to decide. */}
        <h1 className="rv d1">
          Own an AI that<br />
          <span className="grad">works for you</span>
        </h1>
        {/* NO COUNTERPARTY NOUN (Appy, 2026-08-27). The sentence has now said "brands" and
    then "agencies", and the third answer is that it should name neither: whoever the work
    comes from is BlueAI's side of the arrangement, not the reader's, and every noun we tried
    for it was our own supply-side vocabulary reaching an applicant who has no use for it.
    "Real work" is the part that was doing the work all along.
            THIS SENTENCE EXISTS IN THREE PLACES on this route - here, HomeFooter's brand column,
            and the route metadata's description - so it is changed in three places or it starts
            disagreeing with itself. */}
        {/* HAND-BROKEN AT THE FULL STOP (Appy, 2026-08-27): one sentence per line - what BlueAI
            is, then what it does. The same <br> was tried and REVERTED on 2026-08-21, and the
            difference is not taste, it is length: the second half then read "It finds real work
            from agencies, completes it, and pays you" - long enough that the measure had to pick
            the split, and the balancer picked better than a hard break did. With the counterparty
            noun gone (same day) that half is 46 characters, so it fits its own line unaided and
            there is nothing left for the balancer to decide.
            The <br> does turn Chromium's balancer off for this block - the trap documented in
            creators.css's wrapping notes - which is harmless here for exactly that reason. */}
        <p className="sub rv d2">
          BlueAI is an AI worker you own.<br />
          It finds real work, completes it, and pays you.
        </p>
        <div className="rv d3">
          {/* id="hero-cta" — the header watches this leave the viewport to swap its own quiet CTA
              for the gradient pill (HomeHeader.tsx), same IO mechanism the mini ticker uses. */}
          <button className="btn" type="button" id="hero-cta">
            <SparkIcon />
            Get Access
            <ArrowIcon />
          </button>
          {/* THE RETURNING-USER DOOR, taken from the PM's branch with its rationale (Appy,
              2026-08-20). "Get Access" reads wrong to someone who already has an account — they
              have access, they are getting back in. Small, muted, link-styled: findable by the
              person already looking for it, invisible to everyone else.
              HomepageView wires #hero-signin to set the returningUser journey BEFORE opening the
              dialog, because someone clicking Sign in has an account by definition. */}
          <p className="hero-signin">
            Already have an account? <button type="button" id="hero-signin">Sign in</button>
          </p>
        </div>

        {/* THE HERO SCENE, taken from the PM's apply-form-first-wave branch (Appy, 2026-08-20)
            along with its CSS — markup and stylesheet have to move together or the .scr-ui fade
            and the pill's flex column have nothing to apply to.
            Two things this page keeps that the source does not know about: the scene carries
            `rv d0` so it is FIRST in the staged entry (the intro's agent lands in #lap-screen and
            cannot land in something that has not arrived), and the pill sits at d4 behind it. */}
        <div className="scene rv d0" id="scene">
          {/* Coin icon removed (Appy, 2026-08-19: "remove dollar icon here and make this more
              sleek") — label + amount stacked directly, no icon column, tighter pill in
              creators.css. The bottom-right mini counter that mirrored this pill on scroll is
              gone too (see HomeOverlay.tsx); this is now the money proof's only pill on screen. */}
          <div className="earnings rv d4" id="earnings">
            <span className="label">Earned</span>
            {/* Base-118, whole dollars — the mock's own demo figures (F3a reverted, PM 2026-08-20) */}
            <span className="amount" id="amount">$118</span>
          </div>

          {/* The one hard limit on the offer, said where the machine is rather than in the copy
              above it (Appy, 2026-09-02). It sits UNDER the desk surface and above the legs: the
              stage is the claim being played out, so the caveat belongs on the stage, and a
              footnote under the table reads as a label for the thing on it. */}
          <div className="desk">
            <div className="desk-top" />
            {/* The asterisk is part of the string, not a ::before: it reads as a footnote MARK, so
                it belongs to the sentence and gets selected and copied with it. */}
            <span className="desk-note">*only on PC</span>
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

      </main>


    </>
  )
}
