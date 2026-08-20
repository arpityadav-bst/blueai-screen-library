'use client'

import { useEffect, useRef, useState } from 'react'
import { Wordmark } from '@/components/Wordmark'
import AccountMenu from './flow/AccountMenu'
import { useCrx } from './flow/CrxState'

// The /creators header — Phase 1 of PLAN.md, rewired for Phase 3's creator flow. The mock shipped
// headerless; this is the first deliberately-added piece, styled in the page's OWN language (see
// creators.css's header block for the fixed-not-sticky and z-index reasoning).
//
// LOCKUP: the same logo art + wordmark creator-brand's header carries (Appy's explicit ask) —
// the icon PNG (shared /public asset), the shared Wordmark component (top-level, not in the frozen
// tree), and the audience label under it. The measured letter-spacing that makes "CREATORS" span
// exactly the wordmark's width is COPIED from creator-brand/Header.tsx (TRACKING_EASE 0.92,
// OPTICAL_SHIFT 0.7 — see that file for the derivation of both constants and why the trailing
// letter-spacing increment needs the optical shift), not imported: the frozen-tree rule.
//
// NAV: one tab per real homepage section — SIGNED OUT ONLY. The flow views (application,
// dashboard, full-capacity) don't render HomeMain, so #machines isn't in the DOM and the tabs
// would be links to nowhere; they render only when !signedIn.
//
// CTA (Phase 3): opens the sign-in dialog via the onCta prop (CreatorsHome owns the modal) —
// the Phase 1 scroll-to-#join placeholder is retired. Two visual states still mirror
// creator-brand's header CTA: quiet text while the hero's own CTA is on screen, gradient pill
// once it scrolls away. SIGNED IN, the CTA is replaced by <AccountMenu /> — creator-brand's
// decision, copied: the action the CTA would offer is already on the page, so offering it twice
// reads as the header not knowing you're in.
const NAV = [
  { label: 'The machines', href: '#machines' },
  { label: 'While you sleep', href: '#sleep' },
  { label: 'How it works', href: '#how' },
]

const TRACKING_EASE = 0.92
const OPTICAL_SHIFT = 0.7

// Same marks HomeMain/HomeBelow's hero and closer buttons carry (duplicated verbatim there per
// audit finding F26 — a third copy here rather than reaching across file ownership). Both use
// currentColor, not their hardcoded #fff there — this CTA has two colour states (dim quiet text,
// white pill) and the icons need to track whichever one is active, same as the label does.
function SparkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

export default function HomeHeader({ onCta }: { onCta: () => void }) {
  const { signedIn } = useCrx()
  const [scrolled, setScrolled] = useState(false)
  const [pastHeroCta, setPastHeroCta] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [labelTracking, setLabelTracking] = useState<number | undefined>(undefined)
  const wordmarkWrapRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const menuWrapRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  // Surface swap on scroll — same trigger distance creator-brand's header uses.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Quiet CTA -> gradient pill once the hero's own button leaves the viewport. Re-keyed on
  // signedIn: #hero-cta unmounts with HomepageView on sign-in and is a NEW node when signing
  // out remounts it, so the observer must re-attach rather than watch a detached element.
  useEffect(() => {
    if (signedIn) return
    const heroCta = document.getElementById('hero-cta')
    if (!heroCta) return
    const io = new IntersectionObserver((entries) => setPastHeroCta(!entries[0].isIntersecting), { threshold: 0 })
    io.observe(heroCta)
    return () => io.disconnect()
  }, [signedIn])

  // Measured tracking for the audience label — creator-brand Header.tsx's exact method: reset to
  // normal, measure bare width, distribute (target - bare) across length gaps (the browser adds
  // letter-spacing after the trailing character too), ease in by 0.92, then shift right by 0.7 of
  // the trailing increment to re-centre the ink.
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
    return () => { cancelled = true }
  }, [])

  // Outside-click + Escape for the mobile popover — the AccountMenu/MobileMenu recipe, copied:
  // pointerdown (not mousedown) so iOS taps on plain copy still close it; Escape returns focus.
  useEffect(() => {
    if (!menuOpen) return
    function onDown(e: PointerEvent) {
      if (!menuWrapRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      burgerRef.current?.focus()
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  function go(e: React.MouseEvent, href: string) {
    e.preventDefault()
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function cta() {
    setMenuOpen(false)
    onCta()
  }

  return (
    <header className={`crx-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="crx-header-in" ref={menuWrapRef}>
        <button type="button" className="crx-logo" aria-label="BlueAI Creators — top of page" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blueai-icon-RzIisCsb.png" alt="" width={40} height={40} />
          <span className="crx-logo-col">
            <span ref={wordmarkWrapRef}>
              <Wordmark size={19} />
            </span>
            <span
              ref={labelRef}
              className="crx-audience"
              style={
                labelTracking === undefined
                  ? { letterSpacing: '0.1em' }
                  : { letterSpacing: `${labelTracking}px`, marginLeft: `${labelTracking * OPTICAL_SHIFT}px` }
              }
            >
              Creators
            </span>
          </span>
        </button>

        {signedIn ? (
          // The account chip replaces nav + CTA + burger entirely. No burger when signed in:
          // AccountMenu is compact enough at every width (creator-brand's exact reasoning — the
          // avatar alone identifies the session on a phone), so a menu wrapping one control
          // would be chrome for chrome's sake.
          <AccountMenu />
        ) : (
          <>
            {/* Absolutely centered against crx-header-in (creators.css) — a plain flex/
                space-between only centers a middle child in the leftover space between two
                UNEQUAL side elements, which visibly wasn't centered once the CTA moved out to its
                own actions group on the right. Links only now; the CTA used to live in here. */}
            <nav className="crx-nav" aria-label="Sections">
              {NAV.map((item) => (
                <a key={item.href} href={item.href} onClick={(e) => go(e, item.href)}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="crx-header-actions">
              {/* Font-weight matches .crx-nav a while quiet (Appy, 2026-08-19) — it reads as one
                  more item in the row rather than shouting over its neighbours; the icon is the
                  same mark the hero/closer buttons carry. */}
              <button type="button" className={`crx-cta ${pastHeroCta ? 'pill' : ''}`} onClick={cta}>
                <SparkIcon />
                Get access
                <ArrowIcon />
              </button>

              <button
                type="button"
                ref={burgerRef}
                className="crx-burger"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
              >
                {menuOpen ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </div>

            {menuOpen && (
              <div className="crx-menu" role="menu" aria-label="Menu">
                {NAV.map((item) => (
                  <a key={item.href} href={item.href} role="menuitem" onClick={(e) => go(e, item.href)}>
                    {item.label}
                  </a>
                ))}
                <button type="button" role="menuitem" className="crx-menu-cta" onClick={cta}>
                  <SparkIcon />
                  Get access
                  <ArrowIcon />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  )
}
