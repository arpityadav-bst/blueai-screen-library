// Shared fade mask for both hero photos (creators/Hero.tsx, brands/Hero.tsx) — extracted because
// the identical string was hand-duplicated in both files and had the identical bug in both: the
//
// USED ON A PLAIN <img> NOW, NOT next/image (2026-08-13) — each hero renders through a <picture>
// with a mobile-portrait source and a desktop-landscape source, so next/image's single width/height
// no longer fits either consumer. mask-image works identically on <img>; nothing here changed.
// The percentages (75%/52%) are of the ELEMENT's own box on each axis, so the same string produces
// an equivalent relative fade envelope on the mobile portrait crop as on the desktop landscape one —
// re-derives correctly across aspect ratios without any change to this file.
//
// The rest of this comment predates the <picture> split and still describes the ORIGINAL bug:
// vertical radius left the top/bottom edges only ~80% faded rather than fully transparent, so the
// image's own background (measured 2-8 luma units darker than the page's #F9F9FA, worst near the
// bottom) stopped dead at a hard boundary instead of dissolving into it. Measured on both current
// hero assets — the creators one was actually the worse of the two (8.7 units) — so this wasn't a
// one-off asset problem, it was the mask.
//
// ry (vertical radius) is 52%, not 80%. The elliptical mask's alpha at a point is a function of
// hypot(dx/rx, dy/ry) against two stops (opaque to 55%, transparent by 92%); at the image's own
// edge that's dy=0.5, so full transparency there requires 0.5/ry >= 0.92, i.e. ry <= 54.3%. 52%
// keeps a small margin so rounding can't reopen the seam.
//
// rx (horizontal) stays 75%: at that value the side edges still sit at ~0.69 alpha, but the
// measured background delta there is only 1-3 units (vs. up to 8.7 vertically) — small enough
// that it wasn't flagged, and tightening it would fade real content (portraits, side chips)
// further in without an equivalent visible problem to fix.
export const HERO_IMAGE_MASK = 'radial-gradient(ellipse 75% 52% at center, black 55%, transparent 92%)'
