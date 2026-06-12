import { CLOSE } from '@/lib/seo-data'
import { Sparkle } from '@/components/Sparkle'
import { Arrow } from '@/components/Arrow'

// Conversion close — single CTA, restates the worker promise.
export function SeoCta() {
  return (
    <section className="seo-section seo-close-wrap" id="download">
      <div className="seo-wrap">
        <div className="seo-close" data-reveal>
          <h2 className="seo-close-h">
            {CLOSE.h2.split(/(?<=\.)\s+/).map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </h2>
          <p className="seo-close-sub">
            {CLOSE.sub.split(/(?<=\.)\s+/).map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </p>
          <a className="seo-close-cta" href="#">
            <Sparkle size={18} />
            {CLOSE.cta}
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}
