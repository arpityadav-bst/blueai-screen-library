'use client'
import { useState } from 'react'

// Reusable FAQ accordion (site pages). Crawlable: answers stay in the DOM, revealed via a
// grid-rows 0fr→1fr transition (styles in site.css under .site-faq).
export function SiteFaq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="site-faq">
      {items.map((it, i) => (
        <div className={`site-faq-item${open === i ? ' is-open' : ''}`} key={it.q}>
          <button type="button" className="site-faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            {it.q}<span className="site-faq-pm" aria-hidden="true">{open === i ? '–' : '+'}</span>
          </button>
          <div className="site-faq-a"><div className="site-faq-a-inner"><p>{it.a}</p></div></div>
        </div>
      ))}
    </div>
  )
}
