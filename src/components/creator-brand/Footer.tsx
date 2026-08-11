'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wordmark } from '@/components/Wordmark'
import { Arrow } from '@/components/Arrow'
import { NAV, OTHER, type NavAudience } from './nav'

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
            <Link href="/creator-brand/creators" className="flex items-center gap-2" aria-label="BlueAI home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/blueai-icon-RzIisCsb.png" alt="" width={26} height={26} className="rounded-full" />
              <Wordmark size={18} />
            </Link>
            {/* text-wrap: pretty (.cb-scope p, creator-brand.css) handles the no-orphan case
                in Chromium/Safari; the trailing NBSP is the same Firefox fallback used on
                every other paragraph on this site. */}
            <p className="bai-body-sm mt-4 max-w-[38ch] text-ink-muted">
              BlueAI matches creators and brands, verifies the work, and handles the
              payout. No middleman, no back-and-forth.
            </p>
          </div>

          {/* This page's own sections — reuses Header's exact NAV list, so a link added
              there is a link added here for free, with no second list to fall out of sync. */}
          <div>
            <h3 className="bai-caption font-semibold uppercase tracking-label text-ink-muted">
              On this page
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV[active].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className="bai-body-sm text-ink-body-2 transition-colors hover:text-ink-heading"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* The other journey — the ONE cross-link the header already carries, restated
              here as a full nav column rather than one line, because a reader who scrolled
              this far down either audience's page is a plausible click for the other. */}
          <div>
            <h3 className="bai-caption font-semibold uppercase tracking-label text-ink-muted">
              {other === 'brands' ? 'For brands' : 'For creators'}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href={`/creator-brand/${other}`}
                  className="bai-body-sm inline-flex items-center gap-1 font-semibold text-iris transition-colors hover:text-ink-heading"
                >
                  {other === 'brands' ? 'Post a job' : 'Join the waitlist'}
                  <Arrow size={12} />
                </Link>
              </li>
              {NAV[other]
                .filter((item) => item.href !== '#post-a-job')
                .slice(0, 3)
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={`/creator-brand/${other}${item.href}`}
                      className="bai-body-sm text-ink-body-2 transition-colors hover:text-ink-heading"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-divider pt-6 sm:flex-row sm:justify-between">
          <p className="bai-caption text-ink-muted">© 2026 BlueAI · An AI worker by now.gg, Inc.</p>
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="bai-caption inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-ink-heading"
          >
            Back to top
            <Arrow size={11} className="-rotate-90" />
          </a>
        </div>
      </div>
    </footer>
  )
}
