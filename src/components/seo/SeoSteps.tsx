import { STEPS } from '@/lib/seo-data'

// "From 'do this' to done in four steps" — makes "worker" concrete; the safety line answers
// the biggest objection (it controls real apps) without burying it in legal copy.
export function SeoSteps() {
  return (
    <section className="seo-section seo-steps" id="how-it-works">
      <div className="seo-wrap">
        <span className="seo-eyebrow" data-reveal>{STEPS.eyebrow}</span>
        <h2 className="seo-h2" data-reveal>{STEPS.h2}</h2>
        <div className="seo-steps-row">
          {STEPS.steps.map((s, i) => (
            <div className="seo-step" data-reveal style={{ transitionDelay: `${i * 80}ms` }} key={s.n}>
              <span className="seo-step-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="seo-safety" data-reveal><span className="seo-safety-icon" aria-hidden="true">🛡️</span>{STEPS.safety}</div>
      </div>
    </section>
  )
}
