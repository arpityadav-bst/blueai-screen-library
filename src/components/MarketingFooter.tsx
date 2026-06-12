import '@/styles/footer.css'
import { Wordmark } from '@/components/Wordmark'
import { FOOTER, SOCIAL } from '@/lib/site-data'

// THE shared footer — identical on every page. Brand + tagline + brand-colored social icons +
// link columns (incl. a Product column with Social Rewards & Developer) + copyright. CSS scoped
// to the footer element (.bai-ftr) so it's route-scope-independent, like the header.
const ext = (e?: boolean) => (e ? { target: '_blank', rel: 'noopener noreferrer' } : {})

export function MarketingFooter() {
  return (
    <footer className="bai-ftr">
      <div className="bai-ftr-inner">
        <div className="bai-ftr-brand">
          <a className="bai-ftr-lockup" href="/" aria-label="BlueAI home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/blueai-icon-RzIisCsb.png" alt="" width={28} height={28} />
            <Wordmark size={20} />
          </a>
          <p className="bai-ftr-tag">{FOOTER.tagline}</p>
          <div className="bai-ftr-social">
            {SOCIAL.map((s) => (
              <a key={s.label} className={s.cls} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={s.d} /></svg></a>
            ))}
          </div>
        </div>
        <div className="bai-ftr-cols">
          {FOOTER.cols.map((col) => (
            <div className="bai-ftr-col" key={col.head}>
              <h4>{col.head}</h4>
              {col.links.map((l) => (
                <a key={l.label} href={l.href} {...ext(l.external)}>{l.label}</a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="bai-ftr-bottom"><span>© 2026 BlueStacks AI · An AI worker by now.gg, Inc.</span></div>
    </footer>
  )
}
