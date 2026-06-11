import { FEATURES } from '@/lib/home-data'

// 5 alternating feature rows (Search · Shop · DM · Play · Catch up). Even rows are
// text-left / visual-right; odd rows reverse. Visuals are the real product PNGs.
export function FeatureRows() {
  return (
    <section className="features">
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'inherit' }}>
        {FEATURES.map((f, i) => (
          <article key={f.num} className={i % 2 === 1 ? 'feat reverse' : 'feat'}>
            <div className="feat-text">
              <div className="feat-kicker">
                <span className="feat-num">{f.num}</span>
                <span className="feat-cat">{f.cat}</span>
              </div>
              <h3 className="feat-title">{f.title}</h3>
              <p className="feat-desc">{f.desc}</p>
              <span className="feat-quote">“{f.quote}”</span>
            </div>
            <div className="feat-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.img} alt={`BlueAI ${f.cat} — product preview`} loading="lazy" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
