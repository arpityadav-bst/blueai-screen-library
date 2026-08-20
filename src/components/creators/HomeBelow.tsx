'use client'

import CtaBand from './CtaBand'
import HomeFooter from './HomeFooter'
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

// Where each machine actually is in sleep-scene.webp, and what it is doing. The COORDINATES ARE
// MEASURED, not eyeballed (Appy, 2026-08-20: "can we identify through pixels where the laptop,
// mobile, robot, vacuum and car is"): every device in that room is the only lit, saturated thing
// near it, so a hue-and-value scan finds each one's pixels and its bounding box. The scan ran on
// the shipped 1600x893 file and reported, as fractions of the frame:
//   laptop  centre (0.169, 0.744)  top 0.596      phone   centre (0.239, 0.766)  top 0.717
//   vacuum  centre (0.568, 0.810)  top 0.794      robot   centre (0.836, 0.484)  top 0.269
//   car     roof pod (0.240, 0.424)
// Each badge sits just ABOVE its device's measured top edge, centred on its measured x, so it
// labels the thing without covering it. Re-run the scan if the image is ever replaced — these
// numbers belong to this file, not to the layout.
// dx/dy are Appy's own eye correcting the scan (2026-08-20). The measurement finds where a device
// IS; it cannot know that a label reads better clear of the window frame, or off the phone's own
// glow. Deliberately PIXELS, not more percent: he gave them in pixels, and they are corrections to
// a placement rather than part of the placement — a nudge that grew with the viewport would be
// re-deciding the composition at every width instead of fixing it at this one.
const SCENE_TASKS = [
  { t: 'Airport run', x: 25, y: 31.5, dy: 20 },
  { t: 'Folding laundry', x: 72, y: 30, dx: 36 },
  { t: 'Running a campaign', x: 14, y: 55.5, dy: 50 },
  { t: 'On a job', x: 33, y: 69, dx: -50 },
  { t: 'Cleaning', x: 56.8, y: 74 },
]

// Plain strings, and step 04 reads like the other three (Appy, 2026-08-20). It briefly carried the
// payout in mint as the list's one highlight; four steps of equal weight is the point of a numbered
// list, and a green clause in the last one made it look like the other three were preamble. The
// `.money` rule went with it — the page still marks money in mint where money is the SUBJECT (the
// dashboard figures, the hero's completed rows), not inside a sentence about a process.
const STEPS = [
  { n: '01', title: 'Apply', body: 'Tell us about yourself and the PC it will run on.' },
  { n: '02', title: 'Get accepted', body: 'We review every application and email you when your worker is ready.' },
  { n: '03', title: 'Deploy it', body: "Install BlueAI on your PC and sign in. That's the whole setup." },
  { n: '04', title: 'Collect', body: 'You approve each campaign, your worker completes it, and you collect $30 every month via PayPal.' },
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

  return (
    <>
      {/* ids on these three sections are Phase 1 header anchor targets (scroll-margin in
          creators.css) — the only additions to this file since the 1:1 port. */}
      <section className="sleep" id="sleep">
        {/* IMAGE FIRST, THEN THE WORDS. The title and subtitle read as this picture's caption,
            which is why they sit under it rather than beside it.
            ONE STILL, NOT A ROTATION (Appy, 2026-08-20). This was the rotating machine stage —
            five cutouts cycling one at a time under a live task strip — and before that a stock
            photo of someone asleep next to a laptop. The rotation could only ever show one machine
            working at a time, which is the opposite of what the sentence underneath claims; a
            single frame with the sleeper behind and every machine working in front says it in one
            look and needs no time to do it.
            LANDSCAPE, NOT SQUARE, and framed with margin (Appy, 2026-08-20). A square crop of a
            room forces the camera in close, which is what put the robot's head and the laptop
            against the edges; 16:9 lets the shot pull back far enough to hold every object whole
            with air around it, which is the actual requirement. */}
        <div className="sleep-scene crx-reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/creators/sleep-scene.webp"
            alt="A person asleep while a laptop, a phone, a humanoid robot, a robot vacuum and a robotaxi outside all keep working"
            loading="lazy"
            width={1600}
            height={893}
          />
          {/* One label per machine, so the picture says what each one is DOING rather than only
              that it is on. They arrive one after another once the frame does (--i), which is the
              closest a still gets to the rotation it replaced: your eye is walked around the room
              instead of being handed five labels at once. */}
          {SCENE_TASKS.map((m, i) => (
            <span
              key={m.t}
              className="sleep-badge"
              // MARGINS carry the nudge, not the transform: the arrival keyframe owns `transform`
              // (it has to, for the centring translate to survive the animation) and would throw
              // any offset written there away on its first frame.
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
                marginLeft: m.dx ?? 0,
                marginTop: m.dy ?? 0,
                '--i': i,
              } as React.CSSProperties}
            >
              {m.t}
            </span>
          ))}
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
