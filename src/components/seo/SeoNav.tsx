'use client'
import { useState } from 'react'
import { NAV_LINKS } from '@/lib/seo-data'
import { Wordmark } from '@/components/Wordmark'

// SEO nav — section-anchored links + a Download CTA. Desktop: full bar (logo · links · CTA).
// Mobile: a clean bar (logo + hamburger); the burger opens a menu with the section links + a
// full-width Download CTA. Sticky, full-bleed.
export function SeoNav() {
  const [open, setOpen] = useState(false)
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
        <div className="seo-nav-right">
          <a className="seo-nav-cta" href="#download">Download for PC</a>
          <button type="button" className="seo-nav-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
              {open ? <path d="M6 6 18 18M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="seo-nav-menu" aria-label="Sections">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a className="seo-nav-menu-cta" href="#download" onClick={() => setOpen(false)}>Download for PC</a>
        </nav>
      )}
    </header>
  )
}
