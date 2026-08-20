// Below-the-fold markup, ported 1:1 from the mock (alt-copy.html): the sleep section (couch image
// extracted from the mock's embedded webp to public/creators/), the four steps, and the closer.
//
// The mock's closer button said "Apply Now" while the hero said "Join the first wave"; that
// source inconsistency was resolved per audit finding F14 (AUDIT-PHASE2.md) — the closer matches
// the hero/header/menu CTA, all "Get access" (PM 2026-08-20; the full CTA tour is recorded in
// HomeMain.tsx).

function SparkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

const STEPS = [
  { n: '01', title: 'Apply', body: 'Tell us about yourself and the PC it will run on.' },
  { n: '02', title: 'Get accepted', body: 'We review every application and email you when your worker is ready.' },
  { n: '03', title: 'Deploy it', body: "Install BlueAI on your PC and sign in. That's the whole setup." },
  { n: '04', title: 'Collect', body: 'You approve each campaign, your worker completes it, and you collect $30 every month via PayPal.' },
]

// The footer is exported on its own because the returning-creator dashboard keeps the footer but
// drops every other band (CreatorsHome.tsx) — one string, one component, no drift.
export function HomeFooter() {
  /* F21: one-line footer so the page doesn't just end after the last section */
  return <footer className="foot">© 2026 BlueAI · A now.gg product</footer>
}

// Phase 3 props:
//   hideCloser — the flow views (application, full-capacity) render these sections below the flow,
//     but a band whose whole job is to ask you to apply is noise mid-application; creator-brand's
//     ApplyCTA made the same call (it unmounts once you're signed in), copied here as a prop.
//   onCta — the signed-out homepage wires the closer's button to the sign-in dialog
//     (HomepageView threads CreatorsHome's open function through). Optional: when the closer is
//     hidden no handler is needed, and the button predates Phase 3 as a no-op.
export default function HomeBelow({ hideCloser = false, onCta }: { hideCloser?: boolean; onCta?: () => void }) {
  return (
    <>
      {/* ids on these three sections are Phase 1 header anchor targets (scroll-margin in
          creators.css) — the only additions to this file since the 1:1 port. */}
      <section className="sleep" id="sleep">
        <div className="sleep-copy">
          {/* F16: .grad stripped from section h2s — plain white 800 carries them */}
          <h2>It earns while you sleep.</h2>
          <p>
            You approve the work. From there your worker doesn&apos;t clock out: leave your machine on
            and it keeps at it, adding to your balance.
          </p>
        </div>
        <div className="sleep-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/creators/couch-sleep.webp" alt="Your AI worker typing at a glowing laptop while you sleep" />
          {/* The mock's three chips and whole-dollar amounts, restored per the PM (2026-08-20):
              F29 (c2 removed) and F3 (cents amounts) reverted together with the hero money model. */}
          <span className="float-chip c1">+$12</span>
          <span className="float-chip c2">+$5</span>
          <span className="float-chip c3">+$20</span>
        </div>
      </section>

      <section className="below" id="how">
        <h2>You get it hired. It works from then on.</h2>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step" key={s.n}>
              <span className="n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {!hideCloser && (
        <section className="closer" id="join">
          <h2>Everyone will have one.</h2>
          <p>
            Yours could be earning you <b>$30 every month</b>.
          </p>
          <button className="btn" type="button" onClick={onCta}>
            <SparkIcon />
            Get access
            <ArrowIcon />
          </button>
        </section>
      )}

      {/* Footer stays in ALL states — hideCloser hides the ask, never the page's ground line. */}
      <HomeFooter />
    </>
  )
}
