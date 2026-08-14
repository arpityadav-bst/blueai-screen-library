// The mouse-scroll cue between the hero and the steps section, desktop only. Same folder as
// PixelRain/TiltImage and imported into brands/Hero.tsx the same way those two are — both heroes
// share this exact "hero image, then the steps title" seam, so one component covers both pages.
//
// A ZERO-HEIGHT MARKER AT THE SEAM, NOT A CHILD OF THE HERO <section> (fixed 2026-08-13, second
// fix). It first lived absolutely-positioned INSIDE the hero section, which has `overflow-hidden`
// (needed for the background canvas + edge cards) — pushing it past that section's own bottom edge
// didn't move it further down, it clipped it into invisibility, since overflow-hidden cuts off
// anything positioned outside its own box regardless of z-index. Rendered as a SIBLING of the hero
// <section> instead (see Hero.tsx — same conditional scope, since it only renders where Hero does),
// this div itself takes no layout space (h-0), sitting exactly on the hero/steps boundary; the icon
// is positioned relative to THAT with a plain `top` offset, free to sit above or below the seam
// without either neighbouring section's own overflow or pin logic ever being able to clip it.
//
// hidden lg:flex — a cue prompting "there's more below" only earns its place once there's a hero
// AND a next section visibly apart from each other with room between them. On a phone the hero
// already fills most of the first screen; the cue would just be one more thing competing with the
// fold rather than pointing at anything the reader can't already see is there.
//
// See creator-brand.css's own comment for why this is a hand-rolled SVG + keyframe rather than the
// supplied Lottie file rendered through a player library.
export default function ScrollCue() {
  return (
    <div className="relative hidden h-0 lg:block" aria-hidden="true">
      <svg
        width="22"
        height="35"
        viewBox="0 0 22 35"
        fill="none"
        // top-[92px]: same position asked for before it got clipped — 92px below the hero/steps
        // seam, i.e. into the space above the steps title. Adjust this one number to move it.
        className="absolute inset-x-0 top-[92px] mx-auto text-[var(--cb-accent)]"
      >
        <rect x="1" y="1" width="20" height="33" rx="10" stroke="currentColor" strokeWidth="1.6" />
        <circle className="cb-scroll-dot" cx="11" cy="10" r="2.4" fill="currentColor" />
      </svg>
    </div>
  )
}
