'use client'

import { useEffect, useRef } from 'react'

// The room the page sits in — one fixed layer of three drifting orbs and the logo's own star,
// behind every section. A COPY of creator-brand's Backdrop.tsx (Appy, 2026-08-20: "the same orbs
// and sparkle that we used in the creator website... they didn't appear in the hero, but when you
// scroll it appeared from the second section, it used to fade in"). Copied, not imported: that
// tree is frozen.
//
// THE HERO IS OFF LIMITS, which is the whole behaviour Appy is describing. The layer holds at
// opacity 0 for the entire hero and fades in as the hero leaves — measured off the hero's real
// height rather than a guessed scroll distance, because that height is not the same on a laptop
// as on a phone. Atmosphere behind the first thing a reader has to read is atmosphere in the way.
//
// HAND-ROLLED, NOT framer-motion. The original drives every value through useTransform, and
// framer-motion is installed here — but nothing on /creators imports it, and this route's whole
// idiom is hand-rolled motion for exactly this reason (PixelRain, useScrollReveal, the boot
// intro, the machine loop). One scroll-linked layer is not worth being the reason a ~50kB client
// dependency lands on the route.
//
// ONE rAF-COALESCED SCROLL LISTENER writes all four elements. Scroll fires far more often than
// frames do, so doing the maths per event would compute values nobody ever sees; the flag means
// at most one write per frame no matter how fast the wheel spins.
//
// HOMEPAGE ONLY (mounted in HomepageView, not CreatorsHome). The application, dashboard and
// full-capacity views are working surfaces — a drifting colour field behind a form is noise, and
// their own container already carries the page's atmosphere.

/** The logo's own inner 4-point star, lifted verbatim from public/logo-mark.svg (viewBox 32, not
    24) rather than a generic sparkle glyph — that is what makes it read as coming from the mark. */
const LOGO_STAR =
  'M16 6C16 11.5228 20.4772 16 26 16C20.4772 16 16 20.4772 16 26C16 20.4772 11.5228 16 6 16C11.5228 16 16 11.5228 16 6Z'

/** Piecewise linear interpolation over a value's own stops — the shape useTransform gives for
    free, and the only thing this needed from it. */
function track(p: number, stops: number[], vals: number[]) {
  if (p <= stops[0]) return vals[0]
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) {
      const t = (p - stops[i - 1]) / (stops[i] - stops[i - 1])
      return vals[i - 1] + (vals[i] - vals[i - 1]) * t
    }
  }
  return vals[vals.length - 1]
}

// Drift paths, constant for constant from creator-brand's Backdrop — the three orbs cross the
// viewport on different curves so the field never resolves into a pattern.
const PATHS = {
  iris: { xs: [0, 0.33, 0.66, 1], x: [-4, 38, 10, 44], ys: [0, 1], y: [-16, 48] },
  cyan: { xs: [0, 0.5, 1], x: [58, 20, 54], ys: [0, 1], y: [6, -16] },
  blue: { xs: [0, 0.5, 1], x: [14, 46, 22], ys: [0, 1], y: [64, 26] },
}

export default function Backdrop() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const orbs = Array.from(root.querySelectorAll<HTMLElement>('.crx-orb'))
    const star = root.querySelector<SVGElement>('.crx-star')
    if (orbs.length < 3 || !star) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let heroEnd = 0
    let queued = false

    // The gate is measured off <main>, which on this page IS the hero — the copy, the CTA and the
    // desk scene. The fleet section begins immediately after it, so "fades in from the second
    // section" and "fades in as main ends" are the same instant.
    const measure = () => {
      const hero = document.querySelector<HTMLElement>('.crx main')
      heroEnd = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight
    }

    const write = () => {
      queued = false
      const y = window.scrollY
      // 0.6 -> 0.98 of the hero, the original's own ramp: it starts arriving while the hero is
      // still leaving, so the room is already there by the time the next section is.
      const gate = Math.max(0, Math.min(1, (y - heroEnd * 0.6) / Math.max(1, heroEnd * 0.38)))
      root.style.opacity = String(gate)
      // Nothing below this point is visible at gate 0, so skip the maths entirely for the whole
      // hero — which is most of the scrolling anyone does on this page.
      if (gate <= 0) return

      const doc = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      // Under reduced motion every path collapses to its first value: the layer still renders,
      // because it is atmosphere rather than decoration, but it stops moving.
      const p = reduce ? 0 : Math.max(0, Math.min(1, y / doc))

      const keys = ['iris', 'cyan', 'blue'] as const
      for (let i = 0; i < 3; i++) {
        const path = PATHS[keys[i]]
        orbs[i].style.transform =
          `translate3d(${track(p, path.xs, path.x)}vw, ${track(p, path.ys, path.y)}vh, 0)`
      }
      star.style.transform =
        `translate(-50%, -50%) rotate(${track(p, [0, 1], [0, 540])}deg) scale(${track(p, [0, 0.5, 1], [0.88, 1.14, 0.94])})`
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(write)
    }
    const onResize = () => { measure(); onScroll() }

    measure()
    write()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="crx-bd" ref={rootRef} aria-hidden="true">
      <span className="crx-orb crx-orb-iris" />
      <span className="crx-orb crx-orb-cyan" />
      <span className="crx-orb crx-orb-blue" />
      {/* x/y centring lives in the transform alongside rotate/scale (paired with left/top: 50% in
          CSS) — the original's trick, and it avoids a wrapper element per star. */}
      <svg className="crx-star" viewBox="0 0 32 32" fill="currentColor">
        <path d={LOGO_STAR} />
      </svg>
    </div>
  )
}
