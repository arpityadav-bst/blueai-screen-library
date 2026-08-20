import { MACHINES } from './machines'

// The machine stage — a rotating set of machines, each shown running a task through BlueAI.
//
// IT LIVES IN "IT EARNS WHILE YOU SLEEP" NOW (moved 2026-08-20, Appy), not the hero. The hero has
// its CSS desk-and-laptop scene back; this stage is what that section's claim looks like once you
// widen it past one machine, so it sits above that section's own title and subtitle. Three things
// went with the move: the floating money/action badges (Appy: "without badges"), the hero's
// staged-entry classes (down here it enters on scroll with everything else, .crx-reveal), and
// id="scene", which the restored hero scene needs back — this is #machine-stage now.
//
// CUTOUTS, NOT PICTURES. An earlier pass shipped whole 16:9 renders and tried to dissolve their
// edges with a radial mask; that cannot work, because the image's own dark rectangle still reads
// as a slide laid on the page. These are background-removed PNGs cropped to their own alpha
// bounding box, so the file IS the object — no frame, no ground, no container. Nothing to blend,
// because there is no edge to hide. Do not reintroduce an edge mask here.
//
// PIPELINE, so this is reproducible: nano_banana_pro (16:9, 2k, logo passed as an image reference
// for the on-screen mark) -> image_background_remover -> crop to alpha bbox -> WebP at 1200px on
// the long side. Every cutout carries a real alpha channel (69-89% transparent).
//
// CINEMATIC ANGLES, not catalogue shots: each is prompted for a dynamic angle and a sense of
// motion — mid-stride, banking, floating, wheels turned.
//
// HONESTY ABOUT WHAT EARNS TODAY: only the PC is live, and only a live machine ends its task with
// a payout — the rest simply say "Done". The fleet section further down marks those same machines
// "Soon", which is what keeps this strip from claiming earnings the page contradicts.
//
// STATIC MARKUP, MUTATED BY ID — the same contract the hero's scene holds with useLaptopFx. React
// never re-renders this subtree, so the loop owns the DOM: it swaps `.on`/`.out` between images,
// rewrites the task line and drives the fill bar. A progress bar ticking every 130ms as React
// state would re-render the page for nothing.
export default function MachineStage() {
  return (
    <div className="crx-stage" id="machine-stage">
      {/* The box the machines are laid out in. */}
      <div className="crx-stage-frame">
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
            loading="lazy"
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
      </div>

      {/* The task bar: a rectangle with the task written inside it, riding the lower edge of the
          stage so it reads as that machine's status rather than the section's. */}
      <div className="crx-taskbar" id="taskbar">
        {/* The machine's name carries the brand, in the page's own gradient — the logo mark that
            used to sit here was removed (Appy, 2026-08-19): a fourth element before the content
            pushed the actual sentence off to the right. */}
        <span className="crx-taskbar-machine" id="task-machine">
          {MACHINES[0].name}
        </span>
        <span className="crx-taskbar-sep" aria-hidden="true" />
        {/* A clipped viewport: each beat's line is its own element so the outgoing one can be
            pushed up and out while the next rises in behind it (useMachineFx's setLine). The step
            badge is INSIDE the line, so badge and sentence are one node and move together. */}
        <span className="crx-taskbar-text" id="task-text">
          <span className="crx-line">
            <span className="crx-taskbar-step">1</span>
            Getting a task from a brand&hellip;
          </span>
        </span>
        <span className="crx-taskbar-tag" id="task-tag" />
        {/* The progress rail is a SIBLING pinned to the bar's bottom edge, not a child of the text
            column. As a child it started wherever the text started (so it read as a stray line
            under one word) and its appearing/disappearing changed the bar's height, shifting the
            layout every task. */}
        <span className="crx-taskbar-track" id="task-track">
          <i id="task-fill" />
        </span>
      </div>
    </div>
  )
}
