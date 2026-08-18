// BlueAI — MoneyMaker welcome screen's steps card. Split out of moneymaker.jsx (2026-08-14) when
// that file crossed the workspace's 300-line rule. Exposes window.MoneyMakerSteps = { StepsCard }
// — StepRow stays private here since only StepsCard is consumed elsewhere.
(function () {
  const { useRef, useState, useLayoutEffect } = React;

  /* The text column's width is FIXED, and that is the whole trick behind this layout.
     The brief is "the icon's height equals the combined height of the label + body." The icon is
     square, so its height IS its width — which means its width depends on the text's height, which
     depends on the text's width, which (in a normal flex row) depends on the icon's width. That is
     a genuine circular dependency, and left alone it oscillates: a taller icon narrows the text,
     which adds a line, which makes the text taller, which widens the icon again.

     Pinning the text width cuts the loop: wrapping is now decided before anything is measured, so
     the measurement runs exactly once and the icon can never feed back into it.

     234 is the widest text column that still fits the tallest icon the copy can produce. The card's
     content box is 326px (the 421px window − 26px page gutters × 2 − 1.5px card border × 2 − 20px
     card padding × 2); 326 − 14 gap − 234 text leaves 78px for the icon, which is exactly a
     three-line block (11 label + 7 + 3 × 20). A two-line block gives a 58px icon and simply leaves
     ~20px of slack at the row's right edge — invisible against left-aligned ragged text. Either
     outcome fits, which is the point: this doesn't depend on my guess about where the copy wraps. */
  const TEXT_W = 234;
  const GAP = 14;

  /* One step: icon left, label + body stacked to its right. Same shape as MoneyMakerHome's card
     (icon sized to the combined height of the title+description column beside it) — that layout is
     already this feature's house pattern for an icon-plus-copy pair, so this reuses it rather than
     inventing a second one.

     useLayoutEffect, not useEffect: the icon's size is read from the laid-out text, and doing that
     after paint would show one frame at the placeholder size. 58 as the initial value is the
     two-line case — the common one — so even that first pre-measurement frame is usually already
     correct. */
  function StepRow({ n, NumeralIcon, node }) {
    const textRef = useRef(null);
    const [iconSize, setIconSize] = useState(58);
    useLayoutEffect(() => {
      if (textRef.current) setIconSize(textRef.current.offsetHeight);
    }, []);

    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: GAP }}>
        <div style={{ flexShrink: 0, display: 'flex', width: iconSize, height: iconSize }}>
          {NumeralIcon
            ? <NumeralIcon size={iconSize} />
            : <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: Math.round(iconSize * 0.6), lineHeight: 1, background: 'linear-gradient(to bottom right, #7B4CFF 0%, #0EA4C5 99%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>{n}</span>}
        </div>
        {/* flexShrink:0 alongside the fixed width — without it, flex's default shrinking would let
           this column give ground once the icon grows, quietly re-introducing the feedback loop the
           fixed width exists to prevent. */}
        <div ref={textRef} style={{ width: TEXT_W, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {/* Eyebrow label above the body — same convention as the welcome screen's other
             theme-matched small type (Space Grotesk, uppercase, letter-spaced). Ink walked all the
             way down the ramp — #434664 → #1B1E3A → #080A1F, the darkest ink on this screen and the
             same one the h1 uses. At 11px, uppercase and letter-spaced, a label has very little
             mass on the page, so it needs the top of the ramp to hold its own against 15px body
             text sitting right below it; the muted step read as the weaker of the two. No
             competition with the h1 at this size — the type scale separates them, not the colour.

             lineHeight:1 is load-bearing, not cosmetic. At the inherited `normal`, an 11px label
             sits in a ~15px box, so ~2px of phantom half-leading hangs below its glyphs — which
             made a uniform gap read unevenly and put the label nearer the icon than the text it
             labels. It also matters doubly now: this box's height IS the icon's size, so any
             phantom leading in it would silently inflate the icon too. */}
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, lineHeight: 1, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#080A1F' }}>Step {n}</span>
          {/* Body ink dimmed #2B2E4C → #464A6B → #5E628A, in the same pass that took
             the label to the darkest step: the two moves are one decision, not two. Widening the
             contrast between label and body is what carries the hierarchy here — nudging only the
             label would have left both near the same weight, and dimming only the body would have
             cost legibility for no gain in separation.

             lineHeight stays at 20px even though the size came down 15 → 14, and stays in PX
             rather than becoming a multiplier. Both on purpose: a multiplier at this size lands on
             fractional baselines that stack down the paragraph AND feed a fractional height into
             the icon, and holding 20px means smaller type gets slightly more relative leading
             (1.43 vs 1.33), which is the right direction — plus the icon stays on the same 58/78
             grid the row was sized around. If the smaller type now wraps a body to fewer lines,
             the icon follows it automatically; that's what the measurement is for. */}
          <p style={{ fontSize: 14, fontWeight: 400, lineHeight: '20px', color: '#5E628A', marginTop: 7 }}>{node}</p>
        </div>
      </div>);
  }

  /* One shared card holding the steps stacked top-to-bottom (they were side-by-side columns until
     2026-08-18). No divider between them: each row already self-labels ("STEP 1" / "STEP 2") and
     carries its own icon, so proximity plus explicit labels group them without a line — and a
     second hairline inside a card that already has a 1.5px border reads as noise at this size.

     Spacing hierarchy, largest to smallest: 24 between rows > 20 card padding > 14 icon-to-text >
     7 label-to-body. Between-group separation beats within-group separation at every level, which
     is what makes the two steps read as distinct without any chrome saying so. Rendered with .map
     rather than steps[0]/steps[1] — a vertical list has no reason to be arity-locked at two.

     RADIUS 16 → 36, derived not picked. Concentric nesting: for a rounded child inside a rounded
     parent to look like it belongs there, the parent's radius has to equal the child's radius PLUS
     the gap between them — otherwise the parent's corner turns tighter than its own child's and the
     card stops reading as a container. The icon's squircle is ~16px at its 58px size and it sits
     20px in from the card's corner, so 20 + 16 = 36. If the icon size changes materially (it's
     measured from the text, so it can), this number is what has to move with it.

     STROKE softened twice over: 1.5px → 1px and #dbe3ee → #E7EDF5. Both moves, not just the colour,
     because weight and value read as one thing — a 1.5px hairline stays assertive however pale you
     make it, and it was reading as an outline drawn around the content rather than as the edge of a
     surface. #E7EDF5 still sits clearly darker than both the white card and the #F9F9FA canvas
     behind it, so the edge is defined without being drawn. Widening the inner box by 1px is
     harmless: the text column is a fixed 234 and had slack already. */
  function StepsCard({ steps }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, background: 'white', border: '1px solid #E7EDF5', borderRadius: 36, padding: 20, boxSizing: 'border-box' }}>
        {steps.map((s) => <StepRow key={s.n} n={s.n} NumeralIcon={s.NumeralIcon} node={s.node} />)}
      </div>);
  }

  window.MoneyMakerSteps = { StepsCard };
})();
