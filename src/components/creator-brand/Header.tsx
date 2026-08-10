'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Wordmark } from '@/components/Wordmark'
import { Arrow } from '@/components/Arrow'
import { Sparkle } from '@/components/Sparkle'
import { NAV } from './nav'

export default function Header() {
  const pathname = usePathname()
  const active = pathname?.includes('/brands') ? 'brands' : 'creators'
  const headerRef = useRef<HTMLElement>(null)
  // The header's bg + blur are CONSTANT, present from the very top — a scroll-gated
  // version of those left gaps where whatever scrolled underneath bled through and
  // became unreadable. The border-bottom is the one exception: no seam at rest, only
  // once scrolling actually starts. The CTA depends on a separate, later point: once the
  // hero image's top edge reaches the header (not the whole hero scrolling away), it
  // becomes the primary button.
  const [scrolled, setScrolled] = useState(false)
  const [pastHeroImage, setPastHeroImage] = useState(false)

  useEffect(() => {
    const heroImage = document.getElementById('hero-image')
    function onScroll() {
      setScrolled(window.scrollY > 4)
      const headerHeight = headerRef.current?.offsetHeight ?? 64
      if (!heroImage) {
        setPastHeroImage(window.scrollY > 12)
        return
      }
      setPastHeroImage(heroImage.getBoundingClientRect().top <= headerHeight)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const el = document.querySelector(href)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-divider bg-white/60 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between gap-6 px-6 py-3.5">
        <Link href="/creator-brand/creators" className="flex shrink-0 items-center gap-2" aria-label="BlueAI home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blueai-icon-RzIisCsb.png" alt="" width={34} height={34} className="rounded-full" />
          <Wordmark size={19} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {/* Context switch, not a same-page scroll link like the rest of this nav — first in
             the list, same styling as the rest, just underlined so it still reads as distinct. */}
          <Link
            href={active === 'creators' ? '/creator-brand/brands' : '/creator-brand/creators'}
            className="text-[15px] font-normal text-ink-muted underline decoration-1 underline-offset-4 opacity-70 transition-all hover:text-ink-heading hover:opacity-100"
          >
            {active === 'creators' ? 'For Brands' : 'For Creators'}
          </Link>
          {NAV[active].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="text-[15px] font-normal text-ink-muted opacity-70 transition-all hover:text-ink-heading hover:opacity-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={active === 'creators' ? '#waitlist' : '#post-a-job'}
            onClick={(e) => scrollToSection(e, active === 'creators' ? '#waitlist' : '#post-a-job')}
            className={
              pastHeroImage
                ? // Past the hero image, this becomes the primary CTA — the canonical
                  // Sparkle + label + Arrow pattern (DownloadCta.tsx), same gradient pill as
                  // the hero's own button, so it reads as THE action once that one scrolls by.
                  'inline-flex items-center gap-1.5 rounded-pill bg-cta-gradient px-4 py-2 text-[14px] font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:shadow-cta-hover'
                : // Over the hero, stay quiet — the hero's own CTA is already the focus.
                  // Hover color matches blueai-desktop's light-theme --bai-accent (#2258c9) —
                  // a literal value reference, not a shared token: the marketing DS's
                  // --bai-accent (#1990FF) is used elsewhere on this site and this darker
                  // shade is scoped to just this CTA, not a token swap.
                  'inline-flex items-center gap-1.5 text-[15px] font-normal text-ink-muted opacity-70 transition-all hover:text-[#2258c9] hover:opacity-100'
            }
          >
            {pastHeroImage && <Sparkle size={13} />}
            {active === 'creators' ? 'Join the waitlist' : 'Post a job'}
            <Arrow size={13} />
          </a>
        </div>
      </div>
    </header>
  )
}
