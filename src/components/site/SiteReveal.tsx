'use client'
import { useEffect } from 'react'

// Scroll-reveal for [data-reveal] elements on the site pages: fade+rise in once on view.
// Reduced-motion users get everything revealed immediately (handled in site.css).
export function SiteReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }),
      { rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    // safety: reveal anything still hidden shortly after load (e.g. above-the-fold)
    const t = window.setTimeout(() => els.forEach((el) => el.classList.add('is-in')), 1200)
    return () => { io.disconnect(); window.clearTimeout(t) }
  }, [])
  return null
}
