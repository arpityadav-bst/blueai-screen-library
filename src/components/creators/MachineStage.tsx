// The hero's machine stage — replaces the CSS desk+laptop scene the mock shipped with
// (2026-08-19, Appy + CEO direction): a rotating set of machines, each shown running a task
// through BlueAI. This is the fleet strip's own promise made visual — "One worker · Any machine
// you own" is stated in words 200px below; here you watch it happen.
//
// CUTOUTS, NOT PICTURES (rebuilt 2026-08-19 after the first attempt was rejected: "the image
// should cutout only the items... its whole container makes it look like presentation instead of
// an immersive illustration"). The first pass shipped whole 16:9 renders and tried to dissolve
// their edges with a radial mask. That cannot work: the image's own dark rectangle still reads as
// a slide laid on the page. These are Higgsfield background-removed PNGs, then cropped to their
// own alpha bounding box, so the file IS the object — no frame, no ground, no container. Nothing
// to blend, because there is no edge to hide. Do not reintroduce an edge mask here.
//
// PIPELINE, so this is reproducible: nano_banana_pro (16:9, 2k, logo passed as an image reference
// for the on-screen mark) -> image_background_remover -> crop to alpha bbox -> WebP at 1200px on
// the long side. Every cutout was verified to carry a real alpha channel (69-89% transparent) and
// to reach full opacity on the subject before it landed here.
//
// CINEMATIC ANGLES, not catalogue shots (same round of feedback: "the robot is just standing
// there, it should be something more"). Each is prompted for a dynamic angle and a sense of
// motion — mid-stride, banking, floating, wheels turned.
//
// HONESTY ABOUT WHAT EARNS TODAY: only the PC is live, and only `live` machines end their task
// with a "+$X" payout — the rest simply say "Done". They used to carry a "Soon" tag as well; that
// went 2026-08-20, and it was safe to drop because the fleet strip directly below still tags Home
// robots / Robotaxis / Whatever's next "Soon". The floating badges are illustrative of what a
// machine earns — the same convention as the couch section's own +$ chips — and appear on all five.
import { MACHINES } from './machines'

/** Three reusable slots; the loop fills as many as a machine defines, positions them from that
    machine's own badge coords, and empties the rest. */
const BADGE_SLOTS = [0, 1, 2]

// STATIC MARKUP, MUTATED BY ID — the same contract HomeMain/HomeOverlay already hold with
// useHomeFx.ts (see that file's header). React never re-renders this subtree, so the loop owns the
// DOM: it swaps `.on` between images, rewrites the task line, drives the fill bar, fills the
// badges and advances the machine. A progress bar ticking every 120ms as React state would
// re-render the page for nothing.
export default function MachineStage() {
  return (
    // id="scene" is kept as the stage's stable handle (the loop and the intro both look it up).
    // It carries NO `.scene` class — the mock's desk/laptop rules (fixed 470px
    // height, the 0.62 mobile transform) are gone with the scene they styled.
    <div className="crx-stage rv d4" id="scene">
      {/* The box the machines are laid out in. useHomeFx measures it to compute each object's
          contain-rect and hang the badges off its real edges. (It was briefly #dock-target, back
          when the boot intro flew the agent into it; the agent just fades now, so the docking name
          would be describing something that no longer happens.) */}
      <div className="crx-stage-frame" id="stage-frame">
        {/* the object is a cutout with no ground of its own, so the page gives it one: a soft
            violet pool under it, the same device the mock used to seat its desk in the sky */}
        <span className="crx-stage-pool" aria-hidden="true" />

        {MACHINES.map((m, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={m.id}
            className={`crx-machine${i === 0 ? ' on' : ''}`}
            data-machine={i}
            src={m.src}
            alt={m.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'low'}
            // Per-machine framing (machines.ts `fit` + `crop`), overriding the base rule's inset:0.
            // Inline rather than a class because the values are data — five machines, five
            // silhouettes, two numbers each.
            //
            // ONE FORMULA COVERS BOTH CASES. The box is `fit / crop` of the frame tall, so the
            // portion that is actually shown (its top `crop` of it) measures exactly `fit`; and the
            // box starts at `(1 - fit) / 2`, which centres that shown portion in the frame. With
            // crop = 1 it reduces to a plain centred cap. Width stays 100%: every cutout is
            // height-bound at these sizes, so contain settles the width on its own.
            style={{
              height: `${(m.fit / m.crop) * 100}%`,
              top: `${(1 - m.fit) * 50}%`,
              bottom: 'auto',
              // The crop is a DISSOLVE, not a cut — a hard edge would put the container back on the
              // page, which is the exact thing the cutouts exist to avoid. The gradient is in the
              // image's own coordinates, so the fade band is proportional to the object, and it is
              // applied after `filter`, so the drop-shadow fades out with the object instead of
              // pooling under a machine that is no longer there.
              ...(m.crop < 1
                ? {
                    maskImage: `linear-gradient(to bottom, #000 ${(m.crop - 0.16) * 100}%, transparent ${m.crop * 100}%)`,
                    WebkitMaskImage: `linear-gradient(to bottom, #000 ${(m.crop - 0.16) * 100}%, transparent ${m.crop * 100}%)`,
                  }
                : null),
            }}
          />
        ))}

        {/* floating money badges — 2-3 per machine, positioned at runtime against that machine's
            own silhouette (useHomeFx), so they hug the object's edges instead of the frame's */}
        {BADGE_SLOTS.map((i) => (
          <span key={i} className="crx-badge" data-badge={i} aria-hidden="true" />
        ))}
      </div>

      {/* The task bar sits under the stage, a rectangle with the task written inside it (Appy's own
          shape brief). It used to ride the object's shared ground line, back when the frame was
          bottom-anchored; the machines are centred now (machines.ts `fit`), so the bar reads as the
          stage's status line rather than as something resting on the object. */}
      <div className="crx-taskbar" id="taskbar">
        {/* Machine name, then a hairline, then the rolling row (step badge + sentence) — the logo
            mark that used to sit here was removed (Appy, 2026-08-19): the strip already reads as
            BlueAI's, and a fourth element before the content pushed the actual sentence off to the
            right. The name carries the brand instead, in the page's own gradient. */}
        <span className="crx-taskbar-machine" id="task-machine">
          {MACHINES[0].name}
        </span>
        <span className="crx-taskbar-sep" aria-hidden="true" />
        {/* A clipped viewport: each beat's line is its own element so the outgoing one can be
            pushed up and out while the next rises in behind it (useHomeFx's setLine).
            THE STEP BADGE IS INSIDE THE LINE (Appy, 2026-08-20: "I wanted the whole thing along
            with texts"). It was briefly a viewport of its own with only the digit travelling — the
            circle stayed put while the sentence beside it moved, which read as two separate events
            rather than one row advancing. Badge and sentence are one node now, so they can only
            ever move together. */}
        <span className="crx-taskbar-text" id="task-text">
          <span className="crx-line">
            <span className="crx-taskbar-step">1</span>
            Getting a task from a brand…
          </span>
        </span>
        <span className="crx-taskbar-tag" id="task-tag" />
        {/* The progress rail is a SIBLING pinned to the bar's bottom edge, not a child of the text
            column. As a child it started wherever the text started (so it read as a stray line
            under one word) and its appearing/disappearing changed the bar's height, shifting the
            layout every task. Pinned and always present, it spans the full bar and costs no
            height at all. */}
        <span className="crx-taskbar-track" id="task-track">
          <i id="task-fill" />
        </span>
      </div>
    </div>
  )
}
