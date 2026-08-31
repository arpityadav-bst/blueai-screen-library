'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Wordmark } from '@/components/Wordmark'
import HomeFooter from '@/components/creators/HomeFooter'
import { LEGAL_DOCS } from './legal-content'

// The cookie chart's rows — from the 2026-08-31 live audit of the test site (GTM-MV8WJNCQ /
// gtag G-0G5JNESDT4; no _gid, no _gcl_au, nothing else third-party). Kept HERE rather than in
// legal-content.ts because that file is regenerated from legal's documents verbatim, and the
// chart is the one part of the Cookie Policy that awaits our data, not theirs. Durations are
// current defaults; rows marked "to be confirmed" await the signed-in audit / prod GTM check
// (Gaurav Mehta owns the final chart).
const COOKIE_ROWS: { cookie: string; domain: string; expires: string; purpose: string }[] = [
  { cookie: 'now.gg sign-in session', domain: 'now.gg', expires: 'Session (to be confirmed)', purpose: 'Essential: keeps you signed in.' },
  { cookie: 'Cookie consent record', domain: 'bluestacks.ai', expires: '6 months', purpose: 'Essential: remembers your cookie choices.' },
  { cookie: '_ga', domain: 'bluestacks.ai', expires: '13 months', purpose: 'Analytical: Google Analytics visitor identifier.' },
  { cookie: '_ga_*', domain: 'bluestacks.ai', expires: '13 months', purpose: 'Analytical: Google Analytics usage measurement.' },
  { cookie: 'bsai_utm_captured, bsai_first_landing (browser session storage)', domain: 'bluestacks.ai', expires: 'Until the tab closes', purpose: 'Functionality: remembers how you arrived at the site.' },
]

// /creators/terms — the legal page (2026-08-31, Abhisht: "one line footer, redirected to the
// layouted page as bluestacks has"). The bluestacks.com pattern: ONE page, the documents as tabs.
// Three tabs, not bluestacks.com's four: BlueAI has no EU Privacy or Copyright Dispute documents,
// and borrowing tabs that link to nothing would be worse than not having them.
//
// DEEP-LINKABLE TABS (#terms / #privacy / #cookies): the flows land people on the right document —
// the application's agree row links #terms, the sign-in dialog's consent line links all three.
// Those links open in a NEW TAB from the flows, so this page never has to send anyone back.
//
// OWN MINIMAL CHROME, not HomeHeader: the header's CTA/account states belong to the flow's
// CrxProvider world; a legal page needs identity and a way back, nothing else. The .crx root
// carries revealed+settled statically — there is no boot intro here to add them, and without
// them the kit's reveal rules would hold the page at opacity 0 forever.
export default function TermsPage() {
  const [tab, setTab] = useState(LEGAL_DOCS[0].id)

  // Hash → tab on load (and on back/forward); tab click → hash via replaceState so the history
  // doesn't fill with tab flips.
  useEffect(() => {
    function fromHash() {
      const h = window.location.hash.replace('#', '')
      if (LEGAL_DOCS.some((d) => d.id === h)) setTab(h)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  function pick(id: string) {
    setTab(id)
    window.history.replaceState(null, '', `#${id}`)
    window.scrollTo({ top: 0 })
  }

  const doc = LEGAL_DOCS.find((d) => d.id === tab) ?? LEGAL_DOCS[0]

  return (
    <div className="crx revealed settled" id="crx">
      <header className="crx-legal-head">
        <Link href="/creators" className="crx-legal-logo" aria-label="BlueAI Partners home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blueai-icon-RzIisCsb.png" alt="" width={32} height={32} />
          <Wordmark size={17} />
        </Link>
      </header>

      <main className="crx-legal">
        <h1 className="crx-legal-title">Terms and Privacy</h1>

        {/* The dashboard band's pill tabs (.crx-progtabs — the kit's one tab control since the
            2026-08-25 refactor), reused so legal tabs and program tabs stay one vocabulary. */}
        <div className="crx-progtabs crx-legal-tabs" role="tablist" aria-label="Legal documents">
          {LEGAL_DOCS.map((d) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={tab === d.id}
              className={tab === d.id ? 'crx-progtab on' : 'crx-progtab'}
              onClick={() => pick(d.id)}
            >
              {d.tab}
            </button>
          ))}
        </div>

        <article className="crx-legal-doc">
          <h2>{doc.title}</h2>
          <p className="crx-legal-eff">{doc.effective}</p>
          {doc.blocks.map((b, i) => {
            if (b.t === 'chart') {
              return (
                <div key={i} className="crx-legal-chartwrap">
                  <table className="crx-legal-chart">
                    <thead>
                      <tr>
                        <th>Cookie</th>
                        <th>Domain</th>
                        <th>Expiration Time</th>
                        <th>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COOKIE_ROWS.map((r) => (
                        <tr key={r.cookie}>
                          <td>{r.cookie}</td>
                          <td>{r.domain}</td>
                          <td>{r.expires}</td>
                          <td>{r.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
            if (b.t === 'h') return <h3 key={i}>{b.x}</h3>
            if (b.t === 'li') return (
              <p key={i} className="crx-legal-li">
                {b.x}
              </p>
            )
            return <p key={i}>{b.x}</p>
          })}
        </article>
      </main>

      <HomeFooter />
    </div>
  )
}
