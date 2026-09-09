import BandGrid from './BandGrid'

// The closing CTA's grid-lined band — a COPY of creator-brand's CTABand + CTAGrid pair (Appy,
// 2026-08-19: "the final CTA call style can be similar to what we have there, inside a grid lined
// container same bg same grids"), carrying blueai-product's MoneyMaker shine on top of it (Appy,
// 2026-08-20: "that same grid lines animation... everything same way").
//
// THE GEOMETRY MOVED OUT on 2026-09-09, to BandGrid — the expectations dialog needed the same fans
// at its own scale, and this file's own note said the geometry must not exist twice. What is left
// here is the band's chrome, which is all this component ever really was: the gradient panel, the
// rounded frame, and a stacking context for the content that rides above the grid.
//
// `className` exists for one caller shape: the two flow confirmations, which need this container's
// grid and geometry on a DARK surface rather than the light one the homepage closer uses (Appy,
// 2026-08-20: "give it the footer bg colour instead of white"). A modifier rather than a second
// component.
export default function CtaBand({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className ? `crx-band ${className}` : 'crx-band'}>
      {/* The grid's colour is set on .crx-band-grid in creators.css, so it follows the band
          whichever way that is themed. `shine` is on here and off in the dialog: a travelling wave
          belongs to a full-width band you scroll past. */}
      <BandGrid idPrefix="crxBand" shine className="crx-band-grid" />
      {/* content rides above the grid */}
      <div className="crx-band-in">{children}</div>
    </div>
  )
}
