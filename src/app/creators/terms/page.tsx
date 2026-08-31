'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Wordmark } from '@/components/Wordmark'
import HomeFooter from '@/components/creators/HomeFooter'
import { LEGAL_DOCS } from './legal-content'

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

        <div className="crx-band-tabs crx-legal-tabs" role="tablist" aria-label="Legal documents">
          {LEGAL_DOCS.map((d) => (
            <button key={d.id} type="button" role="tab" aria-selected={tab === d.id} className={tab === d.id ? 'on' : ''} onClick={() => pick(d.id)}>
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
                      <tr>
                        {/* Placeholder until the cookie inventory lands (Gaurav Mehta) */}
                        <td colSpan={4}>Cookie details will be listed here.</td>
                      </tr>
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
