import { NAV_LINKS } from '@/lib/seo-data'
import { Wordmark } from '@/components/Wordmark'

// SEO nav — section-anchored links + a single Download CTA (differs from the marketing HeroNav,
// which carries Social Rewards / Developer / Try Skills + social icons). Sticky, full-bleed.
export function SeoNav() {
  return (
    <header className="seo-nav">
      <div className="seo-nav-inner">
        <a className="seo-brand" href="#top" aria-label="BlueAI home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blueai-icon-RzIisCsb.png" alt="" width={32} height={32} />
          <Wordmark size={22} />
        </a>
        <nav className="seo-nav-links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <a className="seo-nav-cta" href="#download">Download for PC</a>
      </div>
    </header>
  )
}
