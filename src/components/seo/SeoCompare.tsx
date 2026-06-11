import { COMPARE } from '@/lib/seo-data'

// "Chatbot, assistant, worker: know the difference" — the 3-stage category frame; stage 3
// (BlueAI = the worker) is the highlighted card.
export function SeoCompare() {
  return (
    <section className="seo-section seo-compare">
      <div className="seo-wrap">
        <span className="seo-eyebrow" data-reveal>{COMPARE.eyebrow}</span>
        <h2 className="seo-h2" data-reveal>{COMPARE.h2}</h2>
        <div className="seo-stages">
          {COMPARE.stages.map((s, i) => {
            const highlight = 'highlight' in s && s.highlight
            return (
              <div className={`seo-stage${highlight ? ' is-blue' : ''}`} data-reveal style={{ transitionDelay: `${i * 80}ms` }} key={s.title}>
                <span className="seo-stage-tag">{s.tag}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
