'use client'
import '@/styles/hero-nav.css'
import { motion } from 'framer-motion'

// Shared hero nav: animated BlueAI logomark + wordmark · links · social icons.
// THE single source of truth for the marketing header — used by all three hero
// variants (Stage, Stage Original, 3 Cards) and showcased in the style guide.
// Styles live in hero-nav.css (imported above) so they travel with the component.
export function HeroNav() {
  return (
    <nav className="nav">
      <div className="brand">
        <motion.span className="nav-logomark" style={{ display: 'flex', width: 34, height: 34 }} initial={{ opacity: 0, scale: 0.4, rotate: -22 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.5, ease: 'backOut' }}>
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="BlueAI">
            <rect width="32" height="32" rx="16" fill="url(#bm-g)" />
            <path d="M16 6C16 11.5228 20.4772 16 26 16C20.4772 16 16 20.4772 16 26C16 20.4772 11.5228 16 6 16C11.5228 16 16 11.5228 16 6Z" fill="white" />
            <defs><linearGradient id="bm-g" x1="32" y1="16" x2="0" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#7B4CFF" /><stop offset="1" stopColor="#0EA4C5" /></linearGradient></defs>
          </svg>
        </motion.span>
        <span className="wordmark">BlueAI</span>
      </div>
      <div className="nav-right">
        <div className="nav-links"><a href="#">Social Rewards</a><a href="#">Developer</a><a href="#">Try Skills</a></div>
        <div className="nav-sep" />
        <div className="nav-social">
          <a href="#" aria-label="Discord"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.5A19.8 19.8 0 0 0 15.4 3l-.2.5a14 14 0 0 1 4.3 2.2 17.7 17.7 0 0 0-15 0A14 14 0 0 1 8.8 3.5L8.6 3a19.8 19.8 0 0 0-4.9 1.5C.6 9.1-.2 13.6.2 18a20 20 0 0 0 6 3l.8-1.6a13 13 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4c-.6.4-1.3.7-2 1L17 21a20 20 0 0 0 6-3c.5-5.2-.8-9.6-2.7-13.5ZM8 15.3c-1.2 0-2.1-1.1-2.1-2.4 0-1.3.9-2.4 2.1-2.4s2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Zm8 0c-1.2 0-2.1-1.1-2.1-2.4 0-1.3.9-2.4 2.1-2.4s2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Z" /></svg></a>
          <a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2h3.3l-7.2 8.3L23 22h-6.7l-5.2-6.8L5.1 22H1.8l7.7-8.8L1 2h6.8l4.7 6.2L18.2 2Zm-1.2 18h1.8L7.1 3.9H5.2L17 20Z" /></svg></a>
          <a href="#" aria-label="Reddit"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.1a2.1 2.1 0 0 0-3.6-1.4 10.3 10.3 0 0 0-5.4-1.7l.9-4.2 2.9.6a1.5 1.5 0 1 0 .2-1l-3.3-.7a.5.5 0 0 0-.6.4l-1 4.6a10.4 10.4 0 0 0-5.5 1.7 2.1 2.1 0 1 0-2.3 3.4 4 4 0 0 0 0 .6c0 3.1 3.6 5.6 8 5.6s8-2.5 8-5.6a4 4 0 0 0 0-.6 2.1 2.1 0 0 0 1.2-1.9ZM7 13.6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm8.4 4c-1 1-3.1 1.1-3.7 1.1-.6 0-2.7 0-3.7-1.1a.4.4 0 0 1 .6-.6c.7.7 2.1.9 3.1.9 1 0 2.5-.2 3.1-.9a.4.4 0 1 1 .6.6Zm-.3-2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" /></svg></a>
        </div>
      </div>
    </nav>
  )
}

export const HeroArrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>

export function HeroCta({ size = 18 }: { size?: number }) {
  return (
    <button className="cta" style={{ fontSize: size }}>
      <svg className="spark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" /></svg>
      Download BlueAI
      <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </button>
  )
}
