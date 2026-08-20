'use client'

import CtaBand from './CtaBand'
import MachineStage from './MachineStage'
import HomeFooter from './HomeFooter'
import useMachineFx from './useMachineFx'
import useScrollReveal from './useScrollReveal'

// Below-the-fold markup, ported 1:1 from the mock (alt-copy.html): the sleep section (couch image
// extracted from the mock's embedded webp to public/creators/), the four steps, and the closer.
//
// The mock's closer button said "Apply Now" while the hero says "Get Access"; that
// source inconsistency was resolved per audit finding F14 (AUDIT-PHASE2.md) — the closer now
// matches the hero/header/menu CTA.

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

// `body` is a node, not a string, so step 04 can carry the one highlight on this list: the money
// (Appy, 2026-08-20). `.money` is the page's existing "this is a figure you get paid" modifier
// (.crx-stat-fig.money, .crx-taskbar-tag.pay) and takes --mint here — NOT the closer's #0f9d58,
// which is a dark green tuned for that band's light panel and would sink into this dark surface.
// Same meaning, two surfaces, two greens.
const STEPS = [
  { n: '01', title: 'Apply', body: <>Tell us about yourself and the PC it will run on.</> },
  { n: '02', title: 'Get accepted', body: <>We review every application and email you when your worker is ready.</> },
  { n: '03', title: 'Deploy it', body: <>Install BlueAI on your PC and sign in. That&apos;s the whole setup.</> },
  {
    n: '04',
    title: 'Collect',
    body: (
      <>
        You approve each campaign, your worker completes it, and{' '}
        <b className="money">you collect $30 every month via PayPal</b>.
      </>
    ),
  },
]

// ONE CALLER NOW: the signed-out homepage. `hideCloser` went with the change that gave every
// signed-in view a footer and nothing else (2026-08-20) — the flag existed only so the flow views
// could render these sections with the apply-band suppressed, and they no longer render them at
// all. A prop with no caller is a branch nothing tests.
//   onCta — the homepage wires the closer's button to the sign-in dialog (HomepageView threads
//     CreatorsHome's open function through). Optional: the button predates Phase 3 as a no-op.
export default function HomeBelow({ onCta }: { onCta?: () => void }) {
  // Everything below the hero enters on scroll in the hero's own language — see useScrollReveal.
  // Called here rather than in HomepageView so the flow views (application, full-capacity), which
  // render these same sections under a different top, get the behaviour too.
  useScrollReveal()
  // The machine stage's own loop. It lives here rather than in HomepageView because this file is
  // what renders the stage, and because the flow views (application, full-capacity) render these
  // same sections and should get the stage running too.
  useMachineFx()

  return (
    <>
      {/* ids on these three sections are Phase 1 header anchor targets (scroll-margin in
          creators.css) — the only additions to this file since the 1:1 port. */}
      <section className="sleep" id="sleep">
        {/* IMAGE FIRST, THEN THE WORDS (Appy, 2026-08-20). This section used to be a two-column
            split: copy on the left, a photo of someone asleep beside a glowing laptop on the
            right. The rotating machine stage replaces that photo entirely and takes the whole
            width, because it is not an illustration of the claim — it IS the claim, played out.
            The title and subtitle read as its caption, which is why they sit under it. */}
        <div className="crx-reveal">
          <MachineStage />
        </div>
        <div className="sleep-copy crx-reveal">
          {/* F16: .grad stripped from section h2s — plain white 800 carries them */}
          <h2>It earns while you sleep.</h2>
          <p>
            You approve the work. From there your worker doesn&apos;t clock out: leave your machine on
            and it keeps at it, adding to your balance.
          </p>
        </div>
      </section>

      <section className="below" id="how">
        <h2 className="crx-reveal">You get it hired. It works from then on.</h2>
        <div className="steps">
          {STEPS.map((s, i) => (
            // --i staggers the cards off one shared observer hit rather than four separate ones
            <div className="step crx-reveal" key={s.n} style={{ '--i': i } as React.CSSProperties}>
              <span className="n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="closer crx-reveal" id="join">
        {/* the closing ask sits in creator-brand's own grid-lined band (CtaBand) — the two sites'
            final CTAs should read as the same moment in the same product, and the two flow
            confirmations now use the same container for the same reason */}
        <CtaBand>
          <h2>Everyone will have one.</h2>
          <p>
            Yours could be earning you <b>$30 every month</b>.
          </p>
          <button className="btn" type="button" onClick={onCta}>
            <SparkIcon />
            Get Access
            <ArrowIcon />
          </button>
        </CtaBand>
      </section>

      <HomeFooter />
    </>
  )
}
