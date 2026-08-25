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
// NO NAV (Appy, 2026-08-21: "remove both the navigation items in the header and the footer").
// The header is logo + CTA at every width now, and nav.ts is DELETED rather than left holding an
// empty array — it existed to be shared by two consumers and neither has a list any more.
//
// THE BURGER WENT WITH IT, which is the same call this file already makes for the signed-in state
// twenty lines down: the popover existed to hold the nav links PLUS a CTA at narrow widths, so with
// the links gone it would be a menu wrapping one control - chrome for chrome's sake. The CTA is
// simply visible at every width instead; creators.css's header block carries the measured fit.
//
// CTA (Phase 3): opens the sign-in dialog via the onCta prop (CreatorsHome owns the modal) —
// the Phase 1 scroll-to-#join placeholder is retired. Two visual states still mirror
// creator-brand's header CTA: quiet text while the hero's own CTA is on screen, gradient pill
// once it scrolls away. SIGNED IN, the CTA is replaced by <AccountMenu /> — creator-brand's
// decision, copied: the action the CTA would offer is already on the page, so offering it twice
// reads as the header not knowing you're in.
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
  const [labelTracking, setLabelTracking] = useState<number | undefined>(undefined)
  const wordmarkWrapRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

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

  return (
    <header className={`crx-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="crx-header-in">
        <button type="button" className="crx-logo" aria-label="BlueAI Partners, top of page" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
              {/* "Partners", not "Creators" (2026-08-24 naming review): anyone with a YouTube
                  account can join now, so "creator" both overpromises (you make content) and
                  gatekeeps (you need an audience). "Workers" was floated and dropped — calling
                  users workers invites employment-relationship questions. */}
              Partners
            </span>
          </span>
        </button>

        {signedIn ? (
          // The account chip replaces the CTA entirely, and NEITHER state has a burger now:
          // AccountMenu is compact enough at every width (creator-brand's exact reasoning - the
          // avatar alone identifies the session on a phone), and the signed-out header is down to
          // a single control, so neither state has a list worth collapsing.
          <AccountMenu />
        ) : (
          // The header's only control while signed out. It used to sit in a .crx-header-actions
          // group beside the burger; with the burger gone that group held one child, so the button
          // is a direct flex child of .crx-header-in and space-between does the rest.
          <button type="button" className={`crx-cta ${pastHeroCta ? 'pill' : ''}`} onClick={onCta}>
            <SparkIcon />
            Get Access
            <ArrowIcon />
          </button>
        )}
      </div>
    </header>
  )
}
