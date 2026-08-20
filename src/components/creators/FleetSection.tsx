import { FLEET } from './fleet'

// The fleet section — rebuilt 2026-08-20 from the icon strip it used to be, on Appy's brief: the
// eyebrow becomes a real section title with a one-line subtitle, and each card becomes a card
// rather than a chip — Higgsfield cutout on top, then the name, then a line about it, then the
// status pill.
//
// WHY THE STRIP DIDN'T WORK. It was four line icons with a name and a tag, sitting under an
// all-caps eyebrow. That reads as a legend for something else on the page, and the section's
// actual claim — one worker, every machine you will ever own — is the largest idea on the page.
// A legend cannot carry it.
//
// GREYSCALE UNTIL HOVER, then colour, scale and OUT of the card (Appy). It is doing real work,
// not decoration: three of the four machines are not live yet, and greyscale is the honest resting
// state for a thing you cannot have — the colour arriving on hover is the vision, not the offer.
// The live card is greyscale at rest too, because a single colour image among three grey ones
// would read as the others being broken rather than as the others being unreleased.
//
// The first version's grey and colour states were barely distinguishable (Appy: "the change is not
// felt right"), because these renders are already low-saturation and mid-toned — desaturating
// something that is nearly grey already changes almost nothing. The two states now differ in
// LUMINANCE as much as in chroma, which is the axis the eye actually notices.
export default function FleetSection() {
  return (
    // id="machines" is a Phase 1 header anchor target (scroll-margin in creators.css).
    <section className="fleet rv d5" id="machines">
      <h2>One worker. Every machine you own.</h2>
      <p className="fleet-sub">
        Start on your PC. As BlueAI learns new machines, the same worker moves in.
      </p>

      <div className="fleet-grid">
        {FLEET.map((c) => (
          <div className={`fcard${c.live ? ' live' : ''}`} key={c.id}>
            {/* A full-bleed 16:9 photo tile, not a floating object on a stage — it runs to the
                card's own edges so the image is as large as the card allows (Appy: "these images
                feel like they can be larger"). The tile clips its image, but nothing clips the
                TILE: the hover pop is the whole tile growing past the card's top and sides. */}
            <div className="fcard-bay">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt={c.alt} loading="lazy" />
            </div>
            <h3>{c.name}</h3>
            <p>{c.blurb}</p>
            <span className="fcard-tag">
              {c.live && <span className="tick-dot" aria-hidden="true" />}
              {c.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
