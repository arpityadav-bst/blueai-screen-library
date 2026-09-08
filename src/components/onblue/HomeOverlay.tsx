// The boot-intro overlay + the bottom-right dock, ported 1:1 from the mock (alt-copy.html), then
// trimmed (Appy, 2026-08-19): the dock originally also carried a mini earnings counter that
// reappeared bottom-right once the hero's own pill scrolled away — removed outright ("no need of
// that... only keep the other fixed pill"), so the dock is just the time-aware line now. The
// matching IntersectionObserver + mini-amount logic that drove it is removed from useHomeFx.ts too
// — there is nothing left to toggle. All remaining behaviour lives in useBootIntro.ts / useHomeFx.ts
// — this is markup only, addressed by the same ids the mock's script used.
export default function HomeOverlay() {
  return (
    <>
      <div className="backdrop" id="backdrop" aria-hidden="true" />
      <canvas id="core-cv" aria-hidden="true" />
      <div className="beat" id="beat1">
        This is your <span className="grad">AI worker.</span>
      </div>
      <div className="beat" id="beat2">
        It exists to <span className="grad">make you money.</span>
      </div>
      <p className="skip" aria-hidden="true">
        Click anywhere to skip
      </p>

      <div className="dock">
        <p className="time-chip rv d5" id="time-line" style={{ margin: 0 }}>
          <span className="tick-dot" />
          <span id="time-msg" />
        </p>
      </div>
    </>
  )
}
