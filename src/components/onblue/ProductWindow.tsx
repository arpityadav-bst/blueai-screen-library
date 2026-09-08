// THE HERO STAGE, AS THE PRODUCT ITSELF (Appy, 2026-09-08: "instead of showing this illustration
// and an animation inside it, what if we show the actual product, a miniature version of the actual
// product, in a very sleek minimal Apple-like aesthetic").
//
// WHY IT BEATS THE DESK. The scene it stands beside is a METAPHOR — a CSS-drawn laptop with invented
// task rows — so a visitor has to take on trust that something real sits behind it. A miniature of
// the actual UI evidences itself, and it is the only thing on this page that stays true after
// launch. Both are mounted behind the preview toggler's Hero rows for now, so the two can be
// compared rather than argued about.
//
// "APPLE-LIKE" AS CRAFT, NOT AS macOS. Appy said "Mac-like", and the reference image he sent does
// NOT do the literal thing: it has a Windows-style minimise/close pair and says "Running on your
// PC" at the foot. That is the right call and this copies it — three red/amber/green traffic lights
// would contradict the page's one hard caveat, which used to be a footnote under the desk and is
// now that footer strip. So: a floating rounded window, one hairline, one soft shadow, generous
// padding, and no chrome that is not load-bearing.
//
// THE SIDEBAR IS THIS PRODUCT'S REAL SECTIONS. Appy's sketch said "Campaigns / Reports" — campaign
// is the AGENCY side's word, and reports do not exist here. These four are what the signed-in
// dashboard actually has (Dashboard.tsx: Your program, Your earnings, Transactions, How earning
// works). Showing sections a visitor will not find after signing in would make this an illustration
// again, only a more detailed one.
//
// STATIC MARKUP, MUTATED BY ID — the same contract the desk scene has with useLaptopFx. The loop in
// useProductFx.ts ticks a progress bar every 120ms; as React state that would re-render the page
// for nothing. React never re-renders this subtree, so the mutation cannot fight reconciliation.

const NAV = [
  // d = the icon path, drawn on a 24 box at stroke 1.7 like the rest of this page's line icons
  { id: 'program', label: 'Your program', d: 'M4 6h16M4 12h16M4 18h9', on: true },
  { id: 'earnings', label: 'Your earnings', d: 'M3 7h18v11H3zM3 11h18M7 15h3' },
  { id: 'tx', label: 'Transactions', d: 'M4 8h13l-3-3M20 16H7l3 3' },
  { id: 'how', label: 'How it works', d: 'M12 17v.01M12 14a2.5 2.5 0 1 0-2.5-2.5' },
]

/** The four beats, in the order the loop plays them. `bar` marks the one that carries progress. */
const STEPS = [
  { k: 'found', label: 'Work found for you' },
  { k: 'approved', label: 'You approved it' },
  { k: 'running', label: 'Running on your PC', bar: true },
  { k: 'paid', label: 'Payment added' },
]

function NavIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export default function ProductWindow() {
  return (
    // #scene, .rv and d0 are the desk scene's, kept verbatim: the staged entry has to bring this in
    // FIRST because the boot intro's agent docks into it and cannot land in something that has not
    // arrived, and the chip flight measures against #scene's own box.
    <div className="pw-scene rv d0" id="scene">
      <div className="pw">
        <div className="pw-top">
          <span className="pw-brand">
            {/* THE APP TILE IS THE INTRO'S LANDING PAD. useBootIntro flies the pixel agent down and
                shrinks it into this square (it looks for `.pw-tile svg`), which is why the window
                has an icon at all when the brand itself is wordmark-only: an app tile in a title
                bar is the OS's mark for a running application, not a second logo. The reference
                image has exactly this. */}
            <span className="pw-tile">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
              </svg>
            </span>
            onBlue
          </span>
          <span className="pw-top-right">
            <span className="pw-state"><span className="dot" /> Working</span>
            {/* Inert on purpose — window controls that did something would invite a click that
                dismisses the one thing the hero is there to show. */}
            <span className="pw-ctl" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 12h14" /></svg>
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </span>
          </span>
        </div>

        <div className="pw-body">
          <nav className="pw-side" aria-hidden="true">
            {NAV.map((n) => (
              <span key={n.id} className={n.on ? 'pw-nav on' : 'pw-nav'}>
                <NavIcon d={n.d} />
                {n.label}
              </span>
            ))}
            <span className="pw-side-foot">
              <span className="pw-avatar">A</span>
              <span className="pw-side-name">Alex</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 3v2M12 19v2M4.2 7.5l1.7 1M18.1 15.5l1.7 1M4.2 16.5l1.7-1M18.1 8.5l1.7-1" />
              </svg>
            </span>
          </nav>

          <div className="pw-main">
            <div className="pw-main-head">
              <span className="pw-main-title">Your program</span>
              {/* WHERE THE MONEY LANDS, and the reason this stage is better than the one it stands
                  beside. The desk scene flies its +$X chip into a pill floating in space next to
                  the laptop; here it lands on a figure that is part of the product. Same motion,
                  and now it says the thing the page is arguing. */}
              <span className="pw-earned" id="pw-earned">
                <i>Earned</i>
                <b id="pw-amount">$118</b>
              </span>
            </div>

            {/* The status sentence from the reference image, in this side's language: the creator
                approves, onBlue runs it. Rewritten per beat by the loop. */}
            <p className="pw-say" id="pw-say">Finding work for you&hellip;</p>

            <span className="pw-lab">Today&rsquo;s activity</span>
            <div className="pw-steps" id="pw-steps">
              {STEPS.map((s) => (
                <div key={s.k} className="pw-step" data-k={s.k}>
                  <span className="pw-node">
                    <svg className="pw-tick" viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 12.5l5.5 5.5L20 6.5" />
                    </svg>
                  </span>
                  <span className="pw-step-body">
                    <span className="pw-step-t">{s.label}</span>
                    {s.bar && <span className="pw-prog"><i /></span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The caveat's new home. It was `*only on PC`, a footnote under the desk; as a line the
            app states about itself it is the same fact doing more work, and it is what lets the
            window controls be Windows-shaped without anyone having to explain why. */}
        <div className="pw-foot">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M9 20h6" />
          </svg>
          Running on your PC
        </div>
      </div>
    </div>
  )
}
