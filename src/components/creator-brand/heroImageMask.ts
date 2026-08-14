// Pointer file for both hero photos' edge treatment (creators/Hero.tsx, brands/Hero.tsx).
//
// NO LONGER A MASK (2026-08-13) — this file used to export a `mask-image` gradient string, then
// (once it needed to differ by breakpoint, which an inline style can't express) a class name for an
// elliptical `mask-image` in creator-brand.css. Both were replaced the same day: an ellipse's alpha
// comes from straight-line distance to its centre, so a diagonal (corner) point is always farther
// from centre than a straight (edge) point at the same "depth" — corners structurally over-faded
// relative to edges, and four rounds of tuning rx/ry/stops could only trade that off, never remove
// it, because it's a property of the SHAPE, not a number to pick better.
//
// The edge treatment is `.cb-hero-vignette` in creator-brand.css now — an inset box-shadow, which
// blurs a rectangle instead of gradient-ing an ellipse, and a 2D blur softens a straight edge and a
// 90-degree corner by the exact same amount. Read that rule's own comment for the current blur
// values (they're the only two numbers left — no stops, no rx/ry) and the full ellipse history it
// replaced, kept there for the record rather than deleted.
//
// Nothing to import from this file. Kept only because both hero photos' own doc comments still
// point a reader here by name, and this note is more useful than an empty file at that path.
