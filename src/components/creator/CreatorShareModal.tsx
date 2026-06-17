'use client'
import { motion } from 'framer-motion'
import { useStudio } from './CreatorStudio'

// Click a generation → this modal opens it (video + "Promote to" Instagram/TikTok/YouTube). Clicking
// a platform switches to the publish upsell: the only way to really publish is BlueAI's creator agent
// + virtual device → Download BlueAI. Design-only. Conditionally rendered (no AnimatePresence orphans).
const EASE = [0.22, 0.61, 0.36, 1] as const

const IG = (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.2" />
    <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none" />
  </svg>
)
const TT = (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M16.6 5.8a4.3 4.3 0 0 1-1-2.8h-3.1v12.3a2.5 2.5 0 1 1-2.5-2.5l.7.1V9.8a5.6 5.6 0 0 0-.7-.1 5.5 5.5 0 1 0 5.5 5.5V9a7.3 7.3 0 0 0 4 1.2V7.1a4.3 4.3 0 0 1-2.9-1.3z" />
  </svg>
)
const YT = (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5zM9.6 15.5v-7l6.3 3.5z" />
  </svg>
)
const PLATFORMS = [
  { key: 'Instagram', cls: 'ig', icon: IG },
  { key: 'TikTok', cls: 'tt', icon: TT },
  { key: 'YouTube', cls: 'yt', icon: YT },
]

export function CreatorShareModal() {
  const { openGen, shareTo, installing, closeGeneration, share, backToDetail, startInstall } = useStudio()
  const installSteps = [
    { t: 'Install & open BlueAI', d: 'Run the installer, then sign in to your BlueAI account.' },
    { t: 'Sign in to the Play Store', d: 'In the BlueStacks virtual device, sign in to Google Play.' },
    { t: `Install ${shareTo ?? 'the app'}`, d: `Add ${shareTo ?? 'the app'} from the Play Store so BlueAI can post to it.` },
  ]
  if (!openGen) return null
  return (
    <motion.div
      className="cr-modal-scrim" onClick={closeGeneration}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
    >
      <motion.div
        className={shareTo ? 'cr-modal' : 'cr-modal cr-genmodal'} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.32, ease: EASE }}
      >
        <button type="button" className="cr-modal-x" onClick={closeGeneration} aria-label="Close">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        {!shareTo ? (
          <div className="cr-gen-detail">
            <div className="cr-gen-video" style={{ background: 'linear-gradient(160deg,#1b1e38,#3a2d6b)' }}>
              <video src={`/videos/${openGen.video}.mp4`} poster={`/videos/${openGen.video}.jpg`} autoPlay muted loop playsInline controls />
            </div>
            <div className="cr-gen-info">
              <span className="cr-eyebrow-sm">Your generation</span>
              <h3 className="cr-gen-title">{openGen.title}</h3>
              <p className="cr-gen-meta">{openGen.model} · vertical short · Just now</p>
              <p className="cr-gen-promote">Promote to</p>
              <div className="cr-gen-platforms">
                {PLATFORMS.map((p) => (
                  <button type="button" key={p.key} className={`cr-plat cr-plat--${p.cls}`} onClick={() => share(p.key)}>
                    <span className="cr-plat-ico" aria-hidden="true">{p.icon}</span>{p.key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : !installing ? (
          <div className="cr-gen-publish">
            <span className="cr-modal-orb" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 16V4M12 16l-4-4M12 16l4-4M5 20h14" /></svg>
            </span>
            <h3 className="cr-modal-h">Publish to {shareTo} with BlueAI</h3>
            <p className="cr-modal-sub">Create and publish your videos with the BlueAI creator agent on a virtual device — it posts straight to {shareTo} for you. Get it on your PC to go live.</p>
            <button type="button" className="cr-dl-cta" onClick={startInstall}>Download BlueAI</button>
            <button type="button" className="cr-modal-back" onClick={backToDetail}>← Back to my video</button>
          </div>
        ) : (
          <div className="cr-gen-publish cr-gen-install">
            <span className="cr-modal-orb cr-modal-orb--pulse" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 16V4M12 16l-4-4M12 16l4-4M5 20h14" /></svg>
            </span>
            <h3 className="cr-modal-h">Finish setup in BlueAI</h3>
            <p className="cr-modal-sub">Your installer is downloading.</p>
            <div className="cr-install-bar" aria-hidden="true"><span /></div>
            <p className="cr-install-hint">Didn&rsquo;t start? <button type="button" className="cr-install-link" onClick={startInstall}>Download again</button></p>
            <ol className="cr-install-steps">
              {installSteps.map((s, i) => (
                <motion.li
                  key={s.t}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.1, ease: EASE }}
                >
                  <span className="cr-install-n">{i + 1}</span>
                  <div><b>{s.t}</b><span>{s.d}</span></div>
                </motion.li>
              ))}
            </ol>
            <button type="button" className="cr-dl-cta" onClick={closeGeneration}>Got it</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
