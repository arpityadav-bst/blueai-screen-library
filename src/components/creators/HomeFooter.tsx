'use client'

import { Wordmark } from '@/components/Wordmark'

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
//   · NO LINK TO NOWHERE, and no silent truncation.
//
// AND THEN THE WAYFINDING WENT TOO (Appy, 2026-08-21: "it will be just the logo, description and
// back to top... make the footer height less and more minimal, slimmer"). Which reads as a
// contradiction of the first principle above and is not: the sections column answered "where else
// on this page", and after the fleet cut and the header-nav removal there is no else — one scroll,
// and a reader down here is already at the end of it. What survives is the identity, what the
// product is, and the way back up.
//
// Everything the column needed went with it: the DOM-presence filter (which existed because the
// four page states render different subsets of the sections), the per-state gating, the
// smooth-scroll handler, and nav.ts itself. This component now holds no state and runs no effects,
// which is worth saying out loud - it was a client component only because of them, and the
// 'use client' at the top is now carried by the two window.scrollTo handlers alone.
// NO .crx-reveal ON THIS ELEMENT, unlike every other band below the hero. The scroll-entry
// observer is started by HomeBelow (useScrollReveal), and the dashboard state renders this footer
// WITHOUT HomeBelow — so a .crx-reveal here would sit at opacity 0 forever in that state, with
// nothing running to add the .in that unhides it. A footer is the page's ground line; it does not
// need an entrance badly enough to risk not having an exit from opacity 0.
export default function HomeFooter() {
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

          {/* THE LAST COLUMN, and now the only other one. Back to top kept a column of its own
              when the sections list was removed rather than folding under the brand: it is an
              action on the page as a whole, and the far right is where a reader's eye goes for one.
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
