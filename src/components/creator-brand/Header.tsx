'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Wordmark } from '@/components/Wordmark'
import { Arrow } from '@/components/Arrow'

const NAV: Record<'creators' | 'brands', { label: string; href: string }[]> = {
  creators: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Open jobs', href: '#jobs' },
    { label: 'Platforms', href: '#platforms' },
    { label: 'FAQ', href: '#faq' },
  ],
  brands: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Post a job', href: '#post-a-job' },
    { label: 'FAQ', href: '#faq' },
  ],
}

export default function Header() {
  const pathname = usePathname()
  const active = pathname?.includes('/brands') ? 'brands' : 'creators'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-divider bg-canvas/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between gap-6 px-6 py-3.5">
        <Link href="/creator-brand/creators" className="flex shrink-0 items-center gap-2" aria-label="BlueAI home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blueai-icon-RzIisCsb.png" alt="" width={34} height={34} className="rounded-full" />
          <Wordmark size={19} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
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
          <Link
            href={active === 'creators' ? '/creator-brand/brands' : '/creator-brand/creators'}
            className="text-[15px] font-normal text-ink-muted opacity-70 transition-all hover:text-ink-heading hover:opacity-100"
          >
            {active === 'creators' ? 'For Brands' : 'For Creators'}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={active === 'creators' ? '#waitlist' : '#post-a-job'}
            onClick={(e) => scrollToSection(e, active === 'creators' ? '#waitlist' : '#post-a-job')}
            className="inline-flex items-center gap-1.5 text-[15px] font-normal text-ink-muted opacity-70 transition-all hover:text-accent hover:opacity-100"
          >
            {active === 'creators' ? 'Join the waitlist' : 'Post a job'}
            <Arrow size={13} />
          </a>
        </div>
      </div>
    </header>
  )
}
