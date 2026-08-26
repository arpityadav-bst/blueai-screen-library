'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wordmark } from '@/components/Wordmark'
import { Arrow } from '@/components/Arrow'
import { NAV, OTHER, type NavAudience } from './nav'

// Shared by both link shapes in the columns below (in-page anchor, cross-page Link) so the footer
// can't grow two near-identical quiet-link treatments.
// inline-block + py-3 rather than a bigger font: the padding lifts each row to ~43px while the type
// stays exactly where it was designed. The lists drop their space-y to compensate, so the visual
// rhythm is unchanged and only the hit area grows. Below sm the three columns stack into one strip,
// which is what made ~19px targets at 10px spacing the densest tap region on either page.
const FOOTER_LINK =
  'bai-body-sm inline-block py-3 text-ink-body-2 transition-colors hover:text-ink-heading active:text-ink-heading'

/**
 * Rebuilt from a single centered line (logo · tagline · copyright) into a proper wayfinding
 * footer. The old version had nothing wrong with its spacing — the problem was that it had
 * only ONE job (a trust stamp) when a footer's real job on a two-page site is to get someone
 * who scrolled all the way down to either page they might want.
 *
 * No CTA band here, deliberately: both pages already end on one directly above this
 * (WaitlistCTA / ClosingCTA) — a second big gradient pill here would be re-pitching the same
 * offer a third time on the same scroll. This footer's links are the quieter kind: jump to a
 * section on THIS page, or go read the OTHER audience's page, or go back to the top. Every
 * href is a real anchor that exists on this page today (grepped from the section `id`s under
 * creators/ and brands/) or the other real route — nothing here points at a page that doesn't
 * exist, the same rule the rest of this site holds copy to.
 */
export default function Footer() {
  const pathname = usePathname()
  const active: NavAudience = pathname?.includes('/brands') ? 'brands' : 'creators'
  const other = OTHER[active]

  function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const el = document.querySelector(href)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    // No background. It was bg-white when this footer was rebuilt, and that was a mistake: the
    // ambient Backdrop (orbs + rotating logo star) is a fixed layer at z-0 and the footer is
    // lifted to z-1, so an opaque footer paints over ~400px of it. The top hairline is enough to
    // separate the footer from the page; the atmosphere should run underneath it.
    <footer className="border-t border-divider">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          {/* Brand column — identity + the one sentence of substance, same copy as before. */}
          <div>
            {/* `active`, not a hard-coded /creators (Appy, 2026-08-25). This was the one link on
                this site that ignored which page it was on: from the BRANDS page, a logo labelled
                "BlueAI home" navigated to the creators page — a cross-link, and a wrong one, since
                home for a brand is the brand page. Now it resolves to the page you are already on,
                which on the creators page is the identical URL this always emitted: the fix is a
                no-op there and a correction here. */}
            <Link href={`/creator-brand/${active}`} className="flex items-center gap-2" aria-label="BlueAI home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/blueai-icon-RzIisCsb.png" alt="" width={26} height={26} className="rounded-full" />
              <Wordmark size={18} />
            </Link>
            {/* text-wrap: pretty (.cb-scope p, creator-brand.css) handles the no-orphan case
                in Chromium/Safari; the trailing NBSP is the same Firefox fallback used on
                every other paragraph on this site. */}
            <p className="bai-body-sm mt-4 max-w-[38ch] text-ink-muted">
              BlueAI matches creators and agencies, verifies the work, and handles the
              payout. No middleman, no back-and-forth.
            </p>
            {/* BRANDS: the copyright moves up here from the second tier (Appy, 2026-08-25), which
                is what lets that tier go entirely. It belongs under the identity it is a statement
                about, and as one quiet line it costs the column nothing. The creators page keeps
                it in the bar below, untouched. */}
            {/* "© 2026 BlueAI" alone (Appy, 2026-08-25) — the "· An AI worker by now.gg, Inc."
                half is dropped here. It was doing two jobs in one line: the legal notice, and a
                one-line pitch of what BlueAI is. The pitch is already the paragraph directly above
                it, so as a trailing clause on a copyright it only made a quiet line long enough to
                read. The creators page's own bar still carries the full string — that page is
                finalised and untouched, so the two now differ. */}
            {active === 'brands' && (
              <p className="bai-caption mt-6 text-ink-muted">© 2026 BlueAI</p>
            )}
          </div>

          {/* This page's own sections — reuses Header's exact NAV list, so a link added
              there is a link added here for free, with no second list to fall out of sync. */}
          <div>
            <h3 className="bai-caption font-semibold uppercase tracking-label text-ink-muted">
              On this page
            </h3>
            <ul className="mt-1">
              {NAV[active].map((item) => (
                <li key={item.label}>
                  <a href={item.href} onClick={(e) => scrollToSection(e, item.href)} className={FOOTER_LINK}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* The other journey — the cross-link the header carries, restated here as a full nav
              column rather than one line, because a reader who scrolled this far down is a
              plausible click for the other side.
              CREATORS PAGE ONLY since 2026-08-25 (Appy) — the brands page links nowhere near the
              creator journey now; see Header.tsx for why. `other` is therefore always 'brands'
              inside this branch, and the ternary below is kept ONLY because restoring symmetry
              should be deleting a guard, not re-deriving a direction.
              THE GRID IS UNCHANGED, and now for a better reason than when this note was first
              written. It said the third track was "simply empty" on brands and that collapsing to
              two tracks would leave the site's two footers unaligned. The first half stopped being
              true hours later — that track carries Back to top on brands now (below) — and the
              second half was always the weaker argument: the two pages are finalised from
              different sources and are allowed to differ. What survives is the useful part: one
              grid shape, so both pages' first two columns land on the same edges. */}
          {active === 'creators' && (
          <div>
            <h3 className="bai-caption font-semibold uppercase tracking-label text-ink-muted">
              {other === 'brands' ? 'For agencies' : 'For creators'}
            </h3>
            <ul className="mt-1">
              <li>
                {/* cb-accent, was text-iris. The purple was never this site's accent — the accent
                    is the header CTA's hover blue, now the --cb-accent variable (creator-brand.css).
                    This is the one link in the footer that carries it, because it's the one that
                    leaves for the other audience's page. */}
                <Link
                  href={`/creator-brand/${other}`}
                  className="bai-body-sm cb-accent inline-flex items-center gap-1 py-3 font-semibold transition-colors hover:text-ink-heading"
                >
                  {/* "Apply now", was "Join the waitlist" (2026-08-13). It was the label the BRANDS
                      page showed pointing at the creators journey — the last live "Join the
                      waitlist" on the site, and the only one the creators-page rewrite could not
                      reach from inside creators/. UNREACHABLE SINCE 2026-08-25: this column no
                      longer renders on the brands page, so only 'Create a campaign' is ever shown.
                      Kept with its branch for the reason given on the guard above — restoring
                      symmetry should be deleting one line, not re-deriving a label that already
                      cost a round trip to get right.
                      The lesson it recorded is the part that still applies: the nav COLUMNS either
                      side of it updated for free because they derive from NAV, and a hand-written
                      label does not. That is nav.ts's whole argument about second lists, and it is
                      worth re-reading when a LABEL changes, not only when a link does. */}
                  {other === 'brands' ? 'Create a campaign' : 'Apply now'}
                  <Arrow size={12} />
                </Link>
              </li>
              {/* Deep links into the other page's sections. No filter and no cap: every nav item is a
                  real anchor, and both audiences' lists are now three items. The `.slice(0, 3)` that
                  used to be here existed only to trim the creators list back when it carried four —
                  which makes it a silent truncation the moment either page gains a section, hiding the
                  new one in the other page's footer with nothing to indicate it. The list is short
                  because the pages are short; if that stops being true it should show. */}
              {NAV[other].map((item) => (
                <li key={item.label}>
                  <Link href={`/creator-brand/${other}${item.href}`} className={FOOTER_LINK}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          )}

          {/* BRANDS: the third track, which the cross-audience column used to fill. Back to top
              moved up out of the second tier and is the only thing in here — an action on the page
              as a whole rather than a destination on it, which is why it gets a column instead of
              becoming a fourth row under "On this page".
              NO HEADING, and no top padding: it is the first thing in its column, so its text sits
              on the same line as the two h3s beside it. That costs ~12px of hit area against the
              other footer links' 44px and buys the row alignment that makes the three columns read
              as one band — the same trade, made the same way, as the /creators footer. */}
          {active === 'brands' && (
            <div>
              <a
                href="#hero"
                onClick={(e) => scrollToSection(e, '#hero')}
                className="bai-caption inline-flex items-center gap-1.5 pb-3 text-ink-muted transition-colors hover:text-ink-heading"
              >
                Back to top
                <Arrow size={11} className="-rotate-90" />
              </a>
            </div>
          )}
        </div>

        {/* CREATORS ONLY since 2026-08-25 (Appy: "make the footer slimmer and utilize the columns
            more properly"). On brands both of its occupants moved into the grid above — copyright
            under the brand identity, Back to top into the empty third track — so the tier itself,
            its 56px top margin, its divider and its 24px of padding go with them. That is where
            most of the height came off; filling the empty column was the smaller half of the win.
            Left standing on creators because that page is finalised and its third column is the
            cross-audience one, so it has nowhere to put these two. */}
        {active === 'creators' && (
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-divider pt-6 sm:flex-row sm:justify-between">
          <p className="bai-caption text-ink-muted">© 2026 BlueAI · An AI worker by now.gg, Inc.</p>
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="bai-caption inline-flex items-center gap-1.5 py-3 text-ink-muted transition-colors hover:text-ink-heading"
          >
            Back to top
            <Arrow size={11} className="-rotate-90" />
          </a>
        </div>
        )}
      </div>
    </footer>
  )
}
