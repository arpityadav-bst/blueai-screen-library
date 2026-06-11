import { WHAT_IS } from '@/lib/seo-data'

// "What is BlueAI?" — featured-snippet definition (under 55 words, doubles as the canonical
// brand definition + the FAQ Q1) followed by a 3-card explainer.
export function SeoWhatIs() {
  return (
    <section className="seo-section seo-whatis" id="what-is">
      <div className="seo-wrap">
        <span className="seo-eyebrow" data-reveal>{WHAT_IS.eyebrow}</span>
        <h2 className="seo-h2" data-reveal>{WHAT_IS.h2}</h2>
        <p className="seo-snippet" data-reveal>{WHAT_IS.snippet}</p>
        <div className="seo-trio">
          {WHAT_IS.cards.map((c, i) => (
            <div className="seo-info-card" data-reveal style={{ transitionDelay: `${i * 80}ms` }} key={c.title}>
              <div className="seo-info-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
