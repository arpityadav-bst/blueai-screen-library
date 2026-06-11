import { SKILLS } from '@/lib/home-data'

// The "All skills" grid — 15 skill cards (3-col desktop) + a "more on the way" tile.
export function AllSkills() {
  return (
    <section className="allskills">
      <div className="wrap">
        <div className="allskills-head">
          <h3>All skills</h3>
          <p>15+ skills · 1-tap install · works inside your apps</p>
        </div>
        <div className="skill-grid">
          {SKILLS.map((s) => (
            <article key={s.title} className="skill">
              {s.featured && <span className="skill-feat">Featured</span>}
              <div className="skill-top">
                <span className="skill-ic" style={{ background: s.iconBg }}>{s.icon}</span>
                <span className="skill-cat">{s.cat}</span>
              </div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
              <div className="skill-foot">
                <span className="skill-rate"><span className="star">★</span><b>{s.rating}</b><span>· {s.count}</span></span>
                <a className="skill-try" href="#">+ Try on BlueAI</a>
              </div>
            </article>
          ))}

          <article className="skill skill-more">
            <span className="sm-ic">
              <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M12 1.8c.45 5.2 2.8 7.55 8 8-5.2.45-7.55 2.8-8 8-.45-5.2-2.8-7.55-8-8 5.2-.45 7.55-2.8 8-8z" />
                <path d="M19.2 13.4c.18 1.9 1 2.72 2.9 2.9-1.9.18-2.72 1-2.9 2.9-.18-1.9-1-2.72-2.9-2.9 1.9-.18 2.72-1 2.9-2.9z" opacity=".9" />
              </svg>
            </span>
            <div className="sm-tx">
              <b>More Skills are on the way</b>
              <span>Watch this space to discover new skills!</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
