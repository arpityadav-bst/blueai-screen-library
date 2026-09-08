import { useEffect } from 'react'

// Scroll-entry for everything below the hero (Appy, 2026-08-19), using the SAME blur recipe the
// hero's staged entry uses — crx-rise-in, cubic-bezier(0.22,1,0.36,1), ported from
// blueai-product's moneymaker onboarding. One entrance language for the whole page: the hero
// assembles on a timeline because nothing has happened yet, and the sections below assemble on
// arrival because scrolling is what makes them happen.
//
// OBSERVER, NOT A SCROLL HANDLER, for the reveal: it fires once per element and unobserves
// immediately, so a long page costs nothing after everything has appeared. A scroll listener would
// keep running for the life of the page to answer a question each element only asks once.
//
// REVEAL ONCE, NEVER RE-HIDE. Elements that fade back out when they leave the viewport make a page
// feel unstable when you scroll back up, and re-triggering the blur on every pass is nauseating.
//
// prefers-reduced-motion gets the assembled page immediately — the animation is atmosphere, and
// atmosphere is exactly what that setting is asking us to drop.
export default function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.crx-reveal'))
    if (els.length === 0) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('in')
          io.unobserve(e.target)
        })
      },
      // -12% bottom margin so a block starts its entrance a beat AFTER its top edge appears,
      // rather than animating while still half off-screen where the motion cannot be read.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )
    els.forEach((el) => io.observe(el))

    // Anything already on screen at mount (short viewports, or a reload part-way down the page)
    // is caught by the observer's own initial callback — no separate first-paint pass needed.
    return () => io.disconnect()
  }, [])
}
