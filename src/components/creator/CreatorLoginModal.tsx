'use client'
import { motion } from 'framer-motion'
import { Sparkle } from '@/components/Sparkle'
import { useStudio } from './CreatorStudio'

// Mock Google login (matches the live-demo widget's "Continue with Google" pattern). Design-only:
// no real account, no real auth. Conditionally rendered (no AnimatePresence) so it unmounts cleanly.
const EASE = [0.22, 0.61, 0.36, 1] as const

export function CreatorLoginModal() {
  const { modal, closeModal, login } = useStudio()
  if (!modal) return null
  return (
    <motion.div
      className="cr-modal-scrim" onClick={closeModal}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
    >
      <motion.div
        className="cr-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.32, ease: EASE }}
      >
        <button type="button" className="cr-modal-x" onClick={closeModal} aria-label="Close">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <span className="cr-modal-orb" aria-hidden="true"><Sparkle size={26} /></span>
        <h3 className="cr-modal-h">Your first video is on us</h3>
        <p className="cr-modal-sub">Sign in and get <b>1 free generation</b> — no credit card. Your render lands in your library.</p>
        <button type="button" className="cr-gbtn" onClick={login}>
          <span className="cr-gmark" aria-hidden="true" /> Continue with Google
        </button>
        <p className="cr-modal-note">Mock login for this prototype — no real account is created.</p>
      </motion.div>
    </motion.div>
  )
}
