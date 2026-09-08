// THE onBlue WORDMARK — this fork's logo, and the reason the fork exists.
//
// WORDMARK ONLY, NO SYMBOL. The lockup this replaces was an icon plus a gradient-filled word;
// onBlue is the word alone, so the icon <img> is gone from all three places that lockup appeared -
// header, footer and legal page - rather than being kept beside a mark that no longer has one.
//
// (This file was created after the fork's brand sweep had listed its files, so the sweep did not
// visit it and the old name survived here for one run. The leak check is what found it - which is
// the argument for the check having no allowlist: an exception here would have hidden exactly this.)
//
// TWO-TONE, and theme-aware for free: "on" takes --ink-inverse, the page's primary ink, so it is
// near-white on the dark theme and near-black on light exactly as the rest of the page is; "Blue"
// takes the DS marketing blue, which holds on both grounds. That is why this is not a flat fill and
// not the old .bai-wordmark gradient - the artwork is two colours, and one of them is the page's.
export function OnBlueWordmark({ size, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`onb-wordmark ${className}`.trim()}
      style={size ? { fontSize: `${size}px` } : undefined}
    >
      <span className="onb-wordmark-on">on</span>Blue
    </span>
  )
}
