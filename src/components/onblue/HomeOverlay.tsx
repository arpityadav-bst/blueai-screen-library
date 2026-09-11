// The boot-intro overlay. Markup only, addressed by the same ids the mock's script used; all
// behaviour lives in useBootIntro.ts.
//
// THE BOTTOM-RIGHT DOCK IS GONE (Appy, 2026-09-08). It was the last survivor of a two-part fixture:
// a mini earnings counter that reappeared once the hero's pill scrolled away (cut 2026-08-19) and a
// time-aware line — "It's 11:41 pm. Your worker would still be on the clock." A fixed chip that
// follows you down every section has to earn that position on every one of them, and this one made
// the same nudge over the legal copy as over the hero. Its clock, its dock, its .time-chip and
// .tick-dot rules and the .d5 entry slot went with it; /creators keeps its own copy of all of it.
export default function HomeOverlay() {
  return (
    <>
      <div className="backdrop" id="backdrop" aria-hidden="true" />
      <canvas id="core-cv" aria-hidden="true" />
      <div className="beat" id="beat1">
        This is your <span className="grad">AI agent.</span>
      </div>
      <div className="beat" id="beat2">
        It exists to <span className="grad">make you money.</span>
      </div>
      <p className="skip" aria-hidden="true">
        Click anywhere to skip
      </p>

    </>
  )
}
