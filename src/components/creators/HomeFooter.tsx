'use client'

import { useEffect, useState } from 'react'
import { Wordmark } from '@/components/Wordmark'
import { NAV } from './nav'

// The footer — rebuilt 2026-08-20 from a single centred mono line (© 2026 BlueAI · A now.gg
// product) on Appy's brief to take creator-brand's footer as the model. Its PRINCIPLES are ported,
// not its markup: that footer is Tailwind on the marketing design system across a two-page site,
// this is a route-scoped stylesheet on a one-page site. What carried over:
//
//   · A FOOTER IS WAYFINDING, NOT A TRUST STAMP. The old line had nothing wrong with it except
//     that it had one job — proving the page ended — when its real job is to get someone who
//     scrolled all the way here to wherever they actually wanted. Taken to its conclusion
//     2026-08-20: the copyright came out too, and with it the bottom bar and the full-bleed rule
//     above it. A trust stamp on a design-only replica was the one thing down here doing no work,
//     and once it was gone the bar held a single button — which is a row of page, and a divider,
//     spent on one control that fits in the list it belongs to.
//   · NO CTA BAND. The page already closes on one directly above (CtaBand); a second gradient
//     pill here would pitch the same offer a third time on one scroll. The links here are the
//     quieter kind.
//   · NO OPAQUE BACKGROUND. The page's own atmosphere should run underneath it rather than be
//     painted over. It carries a slight darkening wash as of 2026-08-20 (Appy) — a translucent one,
//     for that reason; see .crx-foot in creators.css.
//   · HIT AREA FROM PADDING, NOT TYPE SIZE. Each link is inline-block with vertical padding, so
//     the rows reach ~42px while the type stays where it was designed; the list drops its own
//     gap to compensate, leaving the visual rhythm unchanged.
//   · NO LINK TO NOWHERE, and no silent truncation. See the filter below.
//
// WHAT DELIBERATELY DID NOT CARRY OVER: the third column. creator-brand's footer devotes one to
// the other audience's page, which is its single best idea and does not exist here — /creators is
// one page, and the only cross-audience target is /creator-brand/brands, whose own header links
// back to the SUPERSEDED creator page. Sending someone into that loop is worse than not offering
// it. Two columns, and nothing invented to fill a third.
//
// THE FILTER IS THE POINT. This footer renders in four different page states, and they render
// different subsets of the sections: signed out has all three, the application and full-capacity
// views render a different subset (no HomeMain), and the dashboard has none of them. A hardcoded
// list would be wrong in three of the four. Probing the live DOM cannot go stale the way a per-state prop
// list would, and it stays correct for any state added later.
// Filtering AFTER mount rather than during render is deliberate: the server has no DOM, so
// filtering during render would make the first client paint disagree with the server's HTML.
// Rendering the full list and then narrowing it in an effect is a state update, not a mismatch.
// NO .crx-reveal ON THIS ELEMENT, unlike every other band below the hero. The scroll-entry
// observer is started by HomeBelow (useScrollReveal), and the dashboard state renders this footer
// WITHOUT HomeBelow — so a .crx-reveal here would sit at opacity 0 forever in that state, with
// nothing running to add the .in that unhides it. A footer is the page's ground line; it does not
// need an entrance badly enough to risk not having an exit from opacity 0.
export default function HomeFooter() {
  const [present, setPresent] = useState(NAV)

  useEffect(() => {
    setPresent(NAV.filter((item) => document.querySelector(item.href)))
  }, [])

  function go(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const el = document.querySelector(href)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <footer className="crx-foot">
      <div className="crx-foot-in">
        <div className="crx-foot-cols">
          <div className="crx-foot-brand">
            {/* Same lockup the header carries, minus the audience label — one identity, stated
                once at the top and once at the bottom. A button, not a link: this page has no
                route to go home to, so "home" is the top of it. */}
            <button
              type="button"
              className="crx-foot-logo"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/blueai-icon-RzIisCsb.png" alt="" width={28} height={28} />
              <Wordmark size={18} />
            </button>
            <p>
              BlueAI is an AI worker you own. It finds real work from brands, completes it, and
              pays you every month.
            </p>
          </div>

          {/* Gated again. It was briefly unconditional, on the reasoning that Back to top gave the
              column a row that always existed — but that control moved out to its own column, so
              in the dashboard state (no sections in the DOM) this would be a heading over an empty
              list once more. */}
          {present.length > 0 && (
          <nav className="crx-foot-nav" aria-label="Page sections">
            <h3>On this page</h3>
            <ul>
              {present.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={(e) => go(e, item.href)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          )}

          {/* ITS OWN COLUMN, right of the sections (Appy, 2026-08-20). It was briefly the last row
              of the list above, which was wrong on inspection: that list answers "where on this
              page", and every other row in it is a section you scroll TO. This is an action on the
              page as a whole, so putting it among them made it read as a fourth section.
              No heading, and it sits at the top of the column rather than aligned with the first
              link — it is a peer of the heading, not of the items under it.
              scrollTo rather than an #anchor: the top exists in every page state, and no id has to
              be kept alive to make it true. */}
          <div className="crx-foot-top-col">
            <button
              type="button"
              className="crx-foot-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to top
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
