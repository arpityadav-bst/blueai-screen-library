import { FOOTER } from '@/lib/seo-data'
import { Wordmark } from '@/components/Wordmark'

export function SeoFooter() {
  return (
    <footer className="seo-footer">
      <div className="seo-wrap seo-footer-inner">
        <div className="seo-footer-brand">
          <span className="seo-footer-lockup">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/blueai-icon-RzIisCsb.png" alt="" width={28} height={28} />
            <Wordmark size={20} />
          </span>
          <p>{FOOTER.tagline}</p>
        </div>
        <div className="seo-footer-cols">
          {FOOTER.cols.map((col) => (
            <div className="seo-footer-col" key={col.head}>
              <h4>{col.head}</h4>
              {col.links.map((l) => (
                <a href="#" key={l}>{l}</a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
