// BlueAI: the product logo, the onBlue Agentic site's BlueAI lockup (V3, Phase 1).
// Exports: BlueAILogo
//
// The product is still named BlueAI, but V3 draws it with the onBlue site's logo art so the app and
// the partner site read as one family (Appy, 2026-10-14): the four-point spark mark (the site's
// "i-spark" symbol, experiments/onblue-vesper/index.html:444) followed by the wordmark "Blue" + "AI",
// where "AI" takes the site's blue. Proportions are the site's .logo / .logo-mark (onblue.css:829-847,
// light theme): 19.5px text at weight 600, tracking -0.03em, a 28px mark, a 5px gap, the mark in the
// blue with a soft 12px glow. Every size here scales from those ratios, so a smaller or larger lockup
// keeps the same shape. Blue is the Target --v2-blue (#156efe), the same value the site uses.
//
// Props: size (wordmark font size in px, default 19.5), mark (mark size in px, default from size),
//        wordmark (false draws the spark alone), label (accessible name, default 'BlueAI';
//        pass '' when the name is said by nearby text), style, className.

(function () {
  const SPARK = 'M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z';
  const BASE_TEXT = 19.5, BASE_MARK = 28, BASE_GAP = 5, BASE_GLOW = 12;

  function BlueAILogo({ size = BASE_TEXT, mark, wordmark = true, label = 'BlueAI', style, className }) {
    const m = mark || Math.round(size * BASE_MARK / BASE_TEXT);
    const glow = Math.max(2, Math.round(m * BASE_GLOW / BASE_MARK));
    const named = !!label;
    return (
      <span className={className} role={named ? 'img' : undefined} aria-label={named ? label : undefined} aria-hidden={named ? undefined : 'true'}
        style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * BASE_GAP / BASE_TEXT), flex: 'none', fontFamily: 'var(--v2-font-ui)', fontSize: size, fontWeight: 'var(--v2-weight-semibold)', letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--v2-ink)', whiteSpace: 'nowrap', userSelect: 'none', ...style }}>
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"
          style={{ width: m, height: m, flex: 'none', display: 'block', color: 'var(--v2-blue)', filter: 'drop-shadow(0 0 ' + glow + 'px rgba(90, 195, 255, 0.18))' }}>
          <path d={SPARK} />
        </svg>
        {wordmark && <span aria-hidden="true">Blue<span style={{ color: 'var(--v2-blue)' }}>AI</span></span>}
      </span>);
  }

  Object.assign(window, { BlueAILogo });
})();
