// The oversized step numerals' gradient and fade mask, declared once per StepCards instance.
//
// Split out of StepCards.tsx on 2026-08-13 (that file was 474 lines against this project's 300-line
// rule, and the creators steps needed a change). Pure markup, no behaviour — the ids are passed in
// rather than generated here so the parent keeps ownership of instance uniqueness.

/**
 * The FADE mask is deliberately NOT objectBoundingBox — that was tried first and was the actual
 * cause of "1" looking cropped/incomplete while 2/3/4 looked fine. objectBoundingBox re-stretches
 * the fade to fit EACH digit's own glyph bbox, and text x="4" is identical for every digit, but
 * "1"'s bbox is only 88 units wide against 124 for "4" — so the SAME absolute stroke position lands
 * at a HIGHER fraction-of-its-own-width for the narrow digit than the wide one, meaning "1" fades
 * faster for identical ink. Measured: at 40 units in from the left, that's x_frac 0.45 for "1" but
 * only 0.32 for "4" — "1"'s actual vertical stroke was landing deep enough into the falloff (gone by
 * 68%) to read as mostly gone below its top few pixels, while "3"/"4"'s wider strokes stayed in the
 * bright zone. Not a per-digit tuning problem — a fraction computed against a different denominator
 * per glyph can't give the same digit the same treatment twice, let alone match it across four
 * different ones.
 *
 * Fixed by mapping the fade to the SVG's own fixed 150x185 canvas (userSpaceOnUse) instead of each
 * glyph's bbox — one absolute coordinate space, shared by every digit, so the same physical stroke
 * position gets the same alpha regardless of which number it belongs to. The STROKE gradient was
 * never affected by this — it paints via the element's own paint server reference, not a mask, so it
 * was never subject to bbox rescaling in the first place.
 */
export default function NumeralDefs({
  strokeId,
  fadeId,
  maskId,
}: {
  strokeId: string
  fadeId: string
  maskId: string
}) {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <defs>
        {/* Matches --bai-gradient exactly: to bottom right, iris 0% -> cyan 99%. */}
        <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'rgb(var(--bai-iris-rgb))' }} />
          <stop offset="99%" style={{ stopColor: 'rgb(var(--bai-cyan-rgb))' }} />
        </linearGradient>
        {/* Fades toward bottom-right — i.e. INTO the card, which is the direction the card covers it
            from. gradientUnits left at its default (objectBoundingBox) is correct HERE: this
            gradient paints the mask's own <rect> below, which is a FIXED 150x185 box, identical for
            every digit — so "resolves against its own box" means the same absolute box every time,
            which is the whole fix from the mask itself.

            Peak alpha is 0.7, not 1: this mask carries the numeral's RESTING softness as well as its
            directional fade, because element opacity is reserved for the entrance animation (GSAP
            drives it 0 -> 1, so a CSS opacity for softness would be overwritten). Raise the 0.7 to
            make the numerals bolder.

            The falloff is deliberately front-loaded — 0.7 -> 0.22 by 32% and gone by 68%, rather
            than a straight ramp to 100%. That concentrates the ink in the corner that is actually
            exposed and makes the dissolve INTO the card much more pronounced; a linear ramp left too
            much weight sitting under the card where it can't be seen but still reads through the top
            edge. Pull the middle stop's offset in to fade harder, push it out to fade more gently.

            A "100% -> 0.1" floor (never true transparent) was tried here briefly, on the theory that
            "1" reading as cropped was the fade erasing too much of its sparse ink. It was a real,
            measurable difference in isolation — but wrong: the actual cause was where .cb-step-clip
            drew its crop boundary, not this gradient at all. Reverted; see that class for the real
            fix. Left as a note so the same theory doesn't get retried. */}
        <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="32%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="68%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* x/y/width/height match the numeral <svg>'s own viewBox exactly (see StepCell.tsx) — this
            IS the fixed coordinate space every digit shares. Re-derive these four numbers together
            if that viewBox ever changes; they're duplicated across the two files because SVG has no
            way for a <mask> to read another element's viewBox. */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="150" height="185">
          <rect x="0" y="0" width="150" height="185" fill={`url(#${fadeId})`} />
        </mask>
      </defs>
    </svg>
  )
}
