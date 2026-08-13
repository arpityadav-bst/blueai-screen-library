import CTAGrid from './CTAGrid'

/**
 * The dark closing-CTA band, shared by both pages' final sections (WaitlistCTA on creators,
 * ClosingCTA on brands). Extracted because the two were carrying byte-identical shell markup
 * — `overflow-hidden rounded-credits bg-cta-band px-8 py-16 text-center sm:px-16` — and the
 * perspective grid added here would otherwise have had to be pasted into both, which is the
 * same duplication the platform cards were pulled into channels.ts to avoid.
 *
 * The receding floor/ceiling grid lives in CTAGrid.tsx. It used to be two CSS 3D planes here;
 * see that file for the three separate ways that approach failed and why the geometry is now
 * computed explicitly instead of guessed.
 *
 * `overflow-hidden` still crops the grid to the band's rounded corners.
 *
 * `idPrefix` is REQUIRED whenever two bands can be on the page at once, and it is not a style knob:
 * CTAGrid declares four SVG gradient/mask ids, and duplicating them is a latent bug that renders
 * correctly by accident (both instances share a viewBox and userSpaceOnUse geometry) right up until
 * someone changes one band's dimensions. The creators page has two live cases — the submitted
 * application's confirmation and the closing band below it.
 */
export default function CTABand({
  children,
  idPrefix,
}: {
  children: React.ReactNode
  idPrefix?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-credits bg-cta-band px-8 py-16 text-center sm:px-16">
      <CTAGrid idPrefix={idPrefix} />
      {/* Content rides above the grid. */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
