'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Wordmark } from '@/components/Wordmark'
import { Arrow } from '@/components/Arrow'
import { HEADER_NAV } from './nav'
import HeaderCTA from './HeaderCTA'
import MobileMenu from './MobileMenu'
import { useApply } from './creators/ApplyState'

// Shared by both nav shapes so the row can't end up with two slightly different quiet-link treatments.
const NAV_LINK =
  'text-[15px] font-normal text-ink-muted opacity-70 transition-all hover:text-ink-heading hover:opacity-100'

export default function Header() {
  const pathname = usePathname()
  const active = pathname?.includes('/brands') ? 'brands' : 'creators'
  const { isReturningUser } = useApply()
  // The dashboard's own page.tsx already drops HowItWorks/Platforms/FAQ/ApplyCTA entirely (see that
  // file's 2026-08-14 note) — so on the returning-user dashboard, this nav's anchors point at
  // sections that no longer exist in the DOM. A link that scrolls nowhere is worse than no link.
  const showNav = !(active === 'creators' && isReturningUser)
  const headerRef = useRef<HTMLElement>(null)
  const wordmarkWrapRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  // undefined (not 0) until measured, so the label renders at its ordinary tracking-label
  // value on first paint instead of snapping visibly wider once the effect below runs.
  const [labelTracking, setLabelTracking] = useState<number | undefined>(undefined)

  // "Brands" (6 letters) and "Creators" (8 letters) need DIFFERENT letter-spacing to reach
  // the SAME target width — the wordmark's — so this can't be a static Tailwind class the way
  // tracking-label is; it has to be measured per label and set as an inline style.
  //
  // Method: reset to letter-spacing:normal, measure the label's bare width, then distribute
  // (target - bare) across `length` gaps, not `length - 1`. Checked empirically rather than
  // assumed — a 6-character test string with letter-spacing:10px measured exactly 60px wider
  // than at letter-spacing:normal (60/6, not 60/5), meaning the browser adds the value after
  // EVERY character, the trailing one included. That's the same mechanism that made the
  // earlier chip version read as off-centre; here there's no container to be off-centre
  // within, so the trailing bit is harmless — it's just one more increment that has to be
  // counted for the total to land on `target` at all.
  //
  // TRACKING_EASE pulls the result in very slightly from an exact width match — asked for
  // after seeing the exact-fit version, which read as spread a hair too wide. It's a
  // multiplier on the per-gap value, not a flat px subtraction, specifically so it stays a
  // GENERAL rule rather than a "Brands" special case: a flat subtraction would shrink an
  // 8-letter word ("Creators") more in total than a 6-letter one ("Brands") for the same
  // per-gap amount, since the reduction compounds over more gaps. A multiplier keeps both
  // labels the same proportion short of a perfect match, whichever is showing.
  const TRACKING_EASE = 0.92
  // How much of that trailing letter-spacing increment to shift the label right by, to correct
  // the optical off-centre it causes. Same reasoning as TRACKING_EASE for why it's a fraction of
  // a measured value rather than a flat px nudge: both labels then move by the same proportion of
  // their own trailing gap, instead of one page getting a hand-tuned number the other doesn't.
  // Was 0.5 (exactly half); raised to 0.7 on request for a slightly stronger shift. See the
  // marginLeft note down at the label for what the shift is actually correcting.
  const OPTICAL_SHIFT = 0.7
  useEffect(() => {
    const wm = wordmarkWrapRef.current
    const label = labelRef.current
    if (!wm || !label) return
    let cancelled = false
    document.fonts.ready.then(() => {
      if (cancelled) return
      const target = wm.getBoundingClientRect().width
      const prev = label.style.letterSpacing
      label.style.letterSpacing = 'normal'
      const bare = label.getBoundingClientRect().width
      label.style.letterSpacing = prev
      const gaps = Math.max(1, label.textContent?.length ?? 1)
      setLabelTracking(((target - bare) / gaps) * TRACKING_EASE)
    })
    return () => {
      cancelled = true
    }
  }, [active])
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
        {/* Icon is a direct child of this row (flex, items-center), same as it always was.
            What changed is everything to its right: wordmark and badge now share ONE column
            container (a second direct child of this same row), instead of the badge being a
            second row of the icon+wordmark block. Two consequences, both intended:
              1. items-center on THIS row centres the whole [wordmark, badge] column against
                 the icon's own 34px height, as one unit — not the icon centred against just
                 the wordmark the way it briefly was.
              2. The badge no longer needs ml-[42px] to fake alignment under the wordmark: it's
                 a plain sibling of the wordmark inside their own flex-col, so it's flush under
                 it by construction, no measured offset required. */}
        {/* href now tracks the CURRENT page (was hardcoded to /creators always, so clicking
            the logo on /brands used to navigate you AWAY to /creators instead of just going to
            THIS page's own top). onClick reuses the same scrollToSection already used for the
            nav's same-page anchors, targeting #hero (present on both pages) — so the common
            case (already on this page) is a same-page scroll, never a real navigation, and the
            href is only what a fresh load / open-in-new-tab / no-JS fallback actually uses. */}
        <Link
          href={active === 'creators' ? '/creator-brand/creators' : '/creator-brand/brands'}
          onClick={(e) => scrollToSection(e, '#hero')}
          className="flex shrink-0 items-center gap-2"
          aria-label="BlueAI home"
        >
          {/* 40px now, dialed back down from 44 (before that: 38, before that: 34) — each
              change the same non-issue for the [wordmark, label] column: it's centred against
              whatever this element's real height turns out to be via `items-center` on the row
              above, not a hardcoded offset, so it re-centres for free every time this number
              changes. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blueai-icon-RzIisCsb.png" alt="" width={40} height={40} className="rounded-full" />
          {/* items-center: the two lines are different widths ("BlueAI" vs "CREATORS"/
              "BRANDS"), so without it flex-col's default (stretch + each child's own
              left-alignment) leaves both flush-left — fine when they're the same width, not
              when they aren't. This centres whichever line is narrower under the wider one. */}
          <span className="flex flex-col items-center">
            {/* Wrapper exists ONLY to measure — Wordmark isn't forwardRef'd (it's a plain
                function component), so a ref can't attach to it directly. A span wrapping one
                inline child collapses to that child's own size, so this reads as the
                wordmark's width with no visual effect of its own. */}
            <span ref={wordmarkWrapRef}>
              <Wordmark size={19} />
            </span>
            {/* No container any more — tried as a chip (fill + border + padding), and the
                simpler version of just the label itself, sitting under the wordmark with
                nothing around it, was the better call. Everything that container needed is
                gone with it: the fit-content/centring math, the padding-vs-corner-radius
                balance, the two-span split (that one's specific to .text-gradient's own
                background-shorthand collision, which only mattered because there was a SECOND
                background — the fill — to collide with; a single span is free of it).

                text-[9px] leading-none keeps this line tight under the wordmark rather than
                inheriting the page's default line-height. -mt-px now, not mt-0 — 0 was already
                as close as two lines can get WITHOUT overlapping, so "closer still" has to mean
                a small deliberate overlap: -1px eats into the sliver of font-metric leading
                below the wordmark's own glyphs, not into the glyphs themselves.

                letterSpacing is inline, not a Tailwind class, because it's a MEASURED value
                (see the effect above) — spread wide enough that this label's own text spans
                the same width as the wordmark above it, computed fresh per label since
                "Brands" and "Creators" need different amounts to hit the same target. Falls
                back to tracking-label (the shared DS value) until the measurement resolves,
                so there's no unstyled flash on first paint.

                marginLeft: labelTracking * OPTICAL_SHIFT is the optical recentring that
                width-matching alone doesn't give you. The trailing letter-spacing increment
                (the same "browser adds it after the last character too" fact from the effect
                above) is empty space sitting only on the box's right, so the actual INK inside
                reads slightly left of true centre even once TRACKING_EASE has the box itself
                landing a hair narrower than the wordmark. Shifting the whole box right by a
                fraction of that one trailing increment moves the ink to where it visually
                belongs. Started at *0.5 (half); asked for a bit more, now *0.7 — still tied to
                the actual measured increment, not a fixed px nudge, so both labels move by the
                same proportion of their own trailing gap rather than one page getting a
                hand-tuned number the other doesn't. Skipped during the fallback render (no
                measured tracking yet) — same as the letter-spacing itself, it only applies once
                real geometry is known. */}
            <span
              ref={labelRef}
              className={`-mt-px text-gradient text-[9px] font-bold uppercase leading-none ${
                labelTracking === undefined ? 'tracking-label' : ''
              }`}
              style={
                labelTracking === undefined
                  ? undefined
                  : { letterSpacing: `${labelTracking}px`, marginLeft: `${labelTracking * OPTICAL_SHIFT}px` }
              }
            >
              {active === 'creators' ? 'Creators' : 'Brands'}
            </span>
          </span>
        </Link>

        {showNav && (
          <nav className="hidden items-center gap-8 lg:flex">
            {/* HEADER_NAV, not NAV — the header carries only the items flagged `inHeader` (one, right
                now). The footer still lists every section; see nav.ts for why that split is a flag on
                one list rather than two lists. */}
            {HEADER_NAV[active].map((item) => (
              <a key={item.label} href={item.href} onClick={(e) => scrollToSection(e, item.href)} className={NAV_LINK}>
                {item.label}
              </a>
            ))}
            {/* Context switch, not a same-page scroll link like the rest of this nav — LAST in
                the list now (was first), no underline any more, and marked as "leads elsewhere"
                by a small diagonal arrow instead. The arrow is the SAME Arrow component every
                other CTA on this page uses, just rotated 45deg rather than a new glyph — same
                precedent as the footer's "Back to top" link rotating it -90deg. Its stroke is
                currentColor, so nesting it inside this link means it inherits the link's own
                colour and transitions automatically: no separate hover rule to keep in sync.

                cb-accent-hover matches the header CTA's own quiet-state hover rather than this
                nav's usual hover:text-ink-heading — asked to share that colour specifically, not the
                rest of the nav's. It was a literal #2258c9 until the footer needed the same value
                and got it wrong; it's the --cb-accent variable now (creator-brand.css). */}
            {/* size 13, was 11. Against a 15px label an 11px glyph read as a stray tick rather than
                as part of the link — and it was the odd one out in its own row: the header CTA a few
                pixels to the right pairs the SAME 15px label with a 13px Arrow. One arrow size for the
                header's 15px labels, and gap-1.5 to match that CTA too. */}
            <Link
              href={active === 'creators' ? '/creator-brand/brands' : '/creator-brand/creators'}
              className="cb-accent-hover inline-flex items-center gap-1.5 text-[15px] font-normal text-ink-muted opacity-70 transition-all hover:opacity-100"
            >
              {active === 'creators' ? 'For Brands' : 'For Creators'}
              <Arrow size={13} className="-rotate-45" />
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          {/* Three outcomes now (creators signed-in shows an account chip instead of a CTA), so the
              branch lives in its own component rather than as a nested ternary inside this row — see
              HeaderCTA.tsx. It also keeps this file under the 300-line rule.
              MobileMenu is the desktop nav row + this same CTA, collapsed into one hamburger below
              `lg` — see that file for why it renders nothing for a signed-in creator. */}
          <HeaderCTA active={active} pastHeroImage={pastHeroImage} />
          <MobileMenu active={active} />
        </div>
      </div>
    </header>
  )
}
