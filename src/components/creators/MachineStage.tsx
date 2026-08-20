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
// HONESTY ABOUT WHAT EARNS TODAY: only the PC is live. The fleet strip directly below tags Home
// robots / Robotaxis / Whatever's next "Soon", so the task bar shows "Soon" on those rather than a
// payout, and only `live` machines credit the Earned pill. The floating badges are illustrative of
// what a machine earns — the same convention as the couch section's own +$ chips — and appear on
// every machine.
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
    <div className="crx-stage" id="scene">
      {/* dock-target is where the boot intro's agent flies to and shrinks into — it replaced
          #lap-screen, which no longer exists. See useBootIntro.ts. */}
      <div className="crx-stage-frame" id="dock-target">
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
          />
        ))}

        {/* floating money badges — 2-3 per machine, positioned at runtime against that machine's
            own silhouette (useHomeFx), so they hug the object's edges instead of the frame's */}
        {BADGE_SLOTS.map((i) => (
          <span key={i} className="crx-badge" data-badge={i} aria-hidden="true" />
        ))}
      </div>

      {/* The task bar sits tight under the object's own ground line (the frame is bottom-anchored,
          so every machine shares that line and the bar is equally close to all five). A rectangle
          with the task written inside it — Appy's own shape brief — carrying the ONE crisp logo
          instance on the stage; the cutouts hold the mark only as an on-screen glow. */}
      <div className="crx-taskbar rv d5" id="taskbar">
        <span className="crx-taskbar-mark" id="taskbar-mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blueai-icon-RzIisCsb.png" alt="" width={18} height={18} />
        </span>
        <span className="crx-taskbar-machine" id="task-machine">
          {MACHINES[0].name}
        </span>
        <span className="crx-taskbar-text" id="task-text">Getting a task from a brand…</span>
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
