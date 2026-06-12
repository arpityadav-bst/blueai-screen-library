'use client'
import { useState } from 'react'
import '@/styles/header.css'
import { Wordmark } from '@/components/Wordmark'
import { Arrow } from '@/components/Arrow'
import { HEADER_LINKS, DOWNLOAD_URL, SOCIAL } from '@/lib/site-data'

// THE shared marketing header — one identical nav on every page (SEO homepage + all the
// bluestacks.ai inner pages). Logo + links (Social Rewards/Developer open in a new tab, ↗) +
// "Download for PC" CTA + mobile hamburger (opaque menu + scrim). CSS in header.css (.bai-hdr).
const Ext = () => (
  <svg className="bai-hdr-ext" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
)
const ext = (e?: boolean) => (e ? { target: '_blank', rel: 'noopener noreferrer' } : {})

export function MarketingHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="bai-hdr">
      <div className="bai-hdr-inner">
        <a className="bai-hdr-brand" href="/seo" aria-label="BlueAI home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blueai-icon-RzIisCsb.png" alt="" width={32} height={32} />
          <Wordmark size={22} />
        </a>
        <div className="bai-hdr-center">
          <nav className="bai-hdr-links" aria-label="Primary">
            {HEADER_LINKS.map((l) => (
              <a key={l.label} href={l.href} {...ext(l.external)}>{l.label}{l.external && <Ext />}</a>
            ))}
          </nav>
          <span className="bai-hdr-sep" aria-hidden="true" />
          <div className="bai-hdr-social">
            {SOCIAL.map((s) => (
              <a key={s.label} className={s.cls} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={s.d} /></svg></a>
            ))}
          </div>
        </div>
        <div className="bai-hdr-right">
          <a className="bai-hdr-cta" href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">Download for PC<Arrow size={16} /></a>
          <button type="button" className="bai-hdr-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
              {open ? <path d="M6 6 18 18M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <>
          <button type="button" className="bai-hdr-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />
          <nav className="bai-hdr-menu" aria-label="Menu">
            {HEADER_LINKS.map((l) => (
              <a key={l.label} href={l.href} {...ext(l.external)} onClick={() => setOpen(false)}>{l.label}{l.external && <Ext />}</a>
            ))}
            <div className="bai-hdr-menu-social">
              {SOCIAL.map((s) => (
                <a key={s.label} className={s.cls} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={s.d} /></svg></a>
              ))}
            </div>
            <a className="bai-hdr-cta" href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Download for PC<Arrow size={16} /></a>
          </nav>
        </>
      )}
    </header>
  )
}
