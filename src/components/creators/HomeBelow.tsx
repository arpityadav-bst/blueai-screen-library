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
// MEASURED, not eyeballed: every device in that room is the only lit, saturated CYAN or VIOLET
// thing near it, so a hue-and-value scan finds each one's pixels and its bounding box.
//
// THE SHIPPED FILE IS CROPPED, and that is worth knowing before trusting any of these numbers.
// The generator returned a picture-in-picture: a blurred enlargement of the scene as a backdrop
// with the sharp scene inset inside it, framed by a 197px left/right and 187px top/bottom border
// (Appy: "why is there a blur image then inside it a normal image"). MY OWN PROMPT CAUSED IT — the
// containment instruction ("generous empty margin on all four sides, no object touches the border")
// was satisfied literally, by drawing a border. The fix was a crop rather than a re-roll, because
// the picture inside the frame was the one he approved: the sharp inset was located by measuring
// per-column and per-row gradient energy (the blurred band carries almost none) and cut at +8px
// inside the detected edge. 2752x1536 -> 2342x1146, ratio 1.79 -> 2.04.
//
// Where each machine is, and what it is doing. The COORDINATES ARE MEASURED, not eyeballed: every
// device is the only lit, saturated CYAN or VIOLET thing near it in an otherwise warm room, so a
// connected-component flood fill over that mask isolates each one. This is the third scan of the
// day — the image was regenerated for the pose, then for the furniture, then cropped — and every
// device moved every time. Old coordinates on a new picture put five labels on empty room, which is
// the whole reason this list is measured rather than hand-maintained.
// Isolated by BLOB, not by region: an earlier pass on this frame used bounding regions and they
// bled into each other, with the "laptop" box swallowing the phone.
// On the shipped 1600x783 file, as fractions of the frame:
//   laptop centre (0.103, 0.723) top 0.687    phone  centre (0.275, 0.893) top 0.872
//   vacuum centre (0.588, ~0.85) top 0.610    robot  box x[0.812,0.925]    top 0.231
//   taxi   roof pod (0.174, 0.352) top 0.323
// Each badge sits just ABOVE its device's measured top edge, centred on its measured x — except
// the robot's, which goes to its LEFT: its box runs to x 0.925, so a centred badge would overhang.
// dx/dy start at 0; earlier frames' nudges would be noise here. Re-run the scan if the image
// changes again.
/** x/y are percentages of the frame (from the scan); dx/dy are optional pixel nudges on top. The
    type is explicit so the nudges stay available with none of them set — inferred from the literals
    alone, the array would have no dx/dy at all and adding one would be a type error. */
// HAND-TUNED, THEN MOVED BY MEASURED DELTA — never re-derived from scratch. These five were placed
// by eye over two rounds of Appy's own nudges (4px to 80px), so a regeneration must not discard
// them: every device is re-detected in the new frame by colour blob + connected component, matched
// against the same detection on the old frame, and only the DIFFERENCE is added to the tuned value.
// That keeps his placement relative to the object and corrects only what actually moved.
// Across the 2026-08-21 sofa + scale regenerations: robotaxi, laptop and phone all landed within
// 1% (under 5px at the rendered size) and were left alone as measurement noise. Two moved for real,
// because the second pass drew the man bigger and pulled the camera with him — the robot came
// closer, so its head sits 5.6% higher, and the vacuum shifted 2.7% left.
const SCENE_TASKS: { t: string; x: number; y: number; dx?: number; dy?: number }[] = [
  { t: 'Airport run', x: 17.4, y: 27 },
  { t: 'Folding laundry', x: 74, y: 13.4, dx: 80 },
  { t: 'Running a campaign', x: 10.3, y: 64 },
  { t: 'On a job', x: 27.5, y: 83 },
  { t: 'Cleaning', x: 56.1, y: 79 },
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
            single frame with the owner idle and every machine working around him says it in one
            look and needs no time to do it.
            CHILLING, NOT SLEEPING, AT GOLDEN HOUR (Appy, 2026-08-21): the frame was regenerated so
            the owner is leaning back with his hands behind his head, and the room
            is evening rather than night. Evening rather than daylight on purpose — the devices are
            read by their cyan and violet glow, and full daylight washes that out.
            AND FURNISHED, on a second pass the same day (Appy: "the house in the background feels
            like a non-furnished house"). The first evening frame had a bare wall and an empty floor,
            which read as a viewing rather than a home — the whole point of the picture is that this
            is someone's living room and the machines are working in it.
            ON THE SOFA, NOT THE DESK CHAIR (Appy, 2026-08-21: "will make more sense right?" - yes).
            Hands behind his head IN A DESK CHAIR, beside the working laptop, reads as taking a
            break at work: he is still at the desk. On the sofa he is off duty, which is what the
            heading underneath actually claims. Regenerated as an edit of the previous frame rather
            than from scratch, so the room, light and every machine carried over; the chair is still
            there and empty, which does the work of saying he left it.
            AND SCALED TO THE FURNITURE, one pass later (Appy: "guy feels like a dwarf here, we made
            its body too small"). The first sofa frame sat his head BELOW the top of the backrest and
            gave him legs too short for the seat depth, which is exactly how a figure reads as a
            child no matter how adult the face is. The fix was stated as landmarks rather than as
            "bigger": head above the backrest, shoulders one cushion wide, feet out onto the rug.
            THE CROP HAD TO BE REFITTED FOR IT. That pass moved the camera down as well as scaling
            him, which pushed the foreground phone to 97% of the frame — nearly clipped. The crop
            offset is not a constant: it is fitted per generation by minimising the device positions'
            drift against the live frame (top 120px here, 70px before), which is also what keeps the
            badges above honest.
            LANDSCAPE, NOT SQUARE, and framed with margin (Appy, 2026-08-20). A square crop of a
            room forces the camera in close, which is what put the robot's head and the laptop
            against the edges; 16:9 lets the shot pull back far enough to hold every object whole
            with air around it, which is the actual requirement. */}
        <div className="sleep-scene crx-reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/creators/sleep-scene.webp"
            alt="A man leaning back on a sofa with his hands behind his head while a laptop, a phone, a humanoid robot, a robot vacuum and a robotaxi outside all keep working"
            loading="lazy"
            width={1600}
            height={783}
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
          <h2>It earns while you chill</h2>
          <p>
            You approve the work. From there your worker doesn&apos;t clock out: leave your machine on
            and it keeps at it, adding to your balance.
          </p>
        </div>
      </section>

      <section className="below" id="how">
        {/* THE ONE HEADING THAT KEEPS ITS FULL STOP (Appy, 2026-08-21: "here we can have full stop
            only here"). It is two sentences, so the internal stop is a separator and the trailing one
            is its pair — dropping only the second left the heading half-punctuated, which reads worse
            than either convention applied whole. See the heading note in creators.css. */}
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
          <h2>Everyone will have one</h2>
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
