import { TASKS } from '@/lib/seo-data'

// Task grid — the SEO internal-linking hub. Each card is an <a> to a task-verb landing page
// (the card titles are the verbs users search). 8 cards, 4-up grid.
export function SeoTasks() {
  return (
    <section className="seo-section seo-tasks" id="tasks">
      <div className="seo-wrap">
        <span className="seo-eyebrow" data-reveal>{TASKS.eyebrow}</span>
        <h2 className="seo-h2" data-reveal>{TASKS.h2}</h2>
        <p className="seo-sub" data-reveal>{TASKS.subhead}</p>
        <div className="seo-task-grid">
          {TASKS.cards.map((c, i) => {
            const live = 'live' in c && c.live
            const linkText = 'cta' in c ? c.cta : c.slug
            return (
              <a className="seo-task" href={c.slug} data-reveal style={{ transitionDelay: `${(i % 4) * 60}ms` }} key={c.title}>
                <div className="seo-task-top">
                  <span className="seo-task-icon">{c.icon}</span>
                  {live && <span className="seo-live"><span className="dot" />LIVE</span>}
                </div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <span className="seo-task-link">{linkText} <span className="arr">→</span></span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
