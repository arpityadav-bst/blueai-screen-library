import { Wordmark } from '@/components/Wordmark'
import { Arrow } from '@/components/Arrow'
import { LDV2_NAV } from '@/lib/ldv2-data'

// Sticky frosted nav — ANCHORS ONLY (the page is a self-contained funnel; outbound links
// leak conversion). Brand primitives only: the official logo PNG + <Wordmark/>.
export function Ldv2Nav() {
  return (
    <nav className="ldv2-nav">
      <div className="ldv2-nav-in">
        <span className="ldv2-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blueai-icon-RzIisCsb.png" alt="" width={30} height={30} />
          <Wordmark size={20} />
        </span>
        <div className="ldv2-links">
          {LDV2_NAV.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </div>
        <div className="ldv2-nav-right">
          <a className="ldv2-login" href="#hire">Log in</a>
          <a className="ldv2-cta" href="#hire">Hire a worker<Arrow size={16} /></a>
        </div>
      </div>
    </nav>
  )
}
