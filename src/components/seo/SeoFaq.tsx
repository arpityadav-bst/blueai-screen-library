'use client'
import { useState } from 'react'
import { FAQ } from '@/lib/seo-data'

// FAQ accordion. Answers are ALWAYS in the DOM (grid-rows 0fr→1fr animates open/close) so the
// content stays crawlable; the matching FAQPage JSON-LD is emitted server-side from page.tsx.
export function SeoFaq() {
  const [open, setOpen] = useState(0) // Q1 open by default (the "what is blue ai" lander query)
  return (
    <section className="seo-section seo-faq" id="faq">
      <div className="seo-wrap">
        <span className="seo-eyebrow" data-reveal>{FAQ.eyebrow}</span>
        <h2 className="seo-h2" data-reveal>{FAQ.h2}</h2>
        <div className="seo-faq-list" data-reveal>
          {FAQ.items.map((it, i) => {
            const isOpen = open === i
            return (
              <div className={`seo-faq-item${isOpen ? ' is-open' : ''}`} key={it.q}>
                <button className="seo-faq-q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span>{it.q}</span>
                  <span className="seo-faq-pm" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="seo-faq-a"><div className="seo-faq-a-inner"><p>{it.a}</p></div></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
