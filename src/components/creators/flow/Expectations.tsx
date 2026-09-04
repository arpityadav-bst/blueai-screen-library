'use client'

import { useEffect, useState } from 'react'
import { useCrx } from './CrxState'
import { CARD_FONT, CARD_WIDTH, CTA, RING, SKIN } from './signinSkin'
import { MonitorIcon, WalletIcon } from './apply/introIcons'

// LEVEL 1 OF THE SIGN-IN DIALOG (Appy, 2026-09-02: "sign up becomes a 2 level thing... where we
// set the right expectations for the user"). It shows before the sign-in card, to applicants only:
// the "Sign in" door for returning accounts skips straight past it.
//
// WHAT THIS IS FOR, AND WHAT IT IS NOT. The homepage's four cards (Apply, Get accepted, Deploy it,
// Collect) explain what HAPPENS. This has a different job: what you are AGREEING TO - the three
// constraints people misread and then drop out over, pulled to the front before anyone types an
// email. So it is not the four cards again in a popup, and it is not a form either: the application
// already asks the qualifying questions, and ticking them here too would be friction dressed as
// diligence. Three facts, then one "got it".
//
// EVERY FACT IS SOURCED from copy already on the site - the 20 days and the $30 via PayPal from the
// application's intro step, "you approve each campaign" from card 04, the waitlist from the
// confirmation. Nothing new is claimed here. And the copy carries NO UNIT NOUN - not "program", not
// "offer" - so it is correct under Versions A, B and C without a variant branch. "Windows" is not
// said because the site never says it; "PC" is what the desk caption and the application say.

type Platform = 'phone' | 'desktop' | null

/** A play glyph in the introIcons stroke style - a YouTube-account row needs one and the set had none. */
function PlayIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3.5" />
      <path d="M10 9.2v5.6l4.6-2.8z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function Expectations({
  onContinue,
  onSignIn,
  onClose,
  enter,
}: {
  onContinue: () => void
  /** "Already have an account? Sign in" - jumps to level 2 as a returning account. */
  onSignIn: () => void
  onClose: () => void
  /** 'back' when reached from level 2's Back link, so it slides in from the left. */
  enter?: 'back'
}) {
  const { theme } = useCrx()
  const skin = SKIN[theme]

  // THE FIRST ROW KNOWS WHAT YOU ARE ON. Read after mount (never during render - the server cannot
  // know, and a mismatch is a hydration error), and only for the one distinction that is
  // unambiguous: a phone or tablet is not a PC. A hint, never a gate - the sentence changes, the
  // path does not. Nothing is said about Macs, because the site itself only ever says "PC".
  const [platform, setPlatform] = useState<Platform>(null)
  useEffect(() => {
    const ua = navigator.userAgent
    setPlatform(/Android|iPhone|iPad|iPod|Mobile/i.test(ua) ? 'phone' : 'desktop')
  }, [])

  const rows = [
    {
      icon: <MonitorIcon size={18} />,
      fact:
        platform === 'phone'
          ? 'It lives on a PC. You are on a phone right now.'
          : 'It lives on your PC.',
      detail:
        platform === 'phone'
          ? 'That is fine for applying. BlueAI itself runs on a PC, and you will set it up there.'
          : 'You install BlueAI and keep it running at least 20 days a month. A few minutes of your day.',
    },
    {
      icon: <PlayIcon />,
      fact: 'It works on your YouTube account.',
      detail: 'You approve each campaign before your worker runs it.',
    },
    {
      icon: <WalletIcon size={18} />,
      fact: 'You get $30 a month, via PayPal.',
      detail: 'Once your application is approved. There is a waitlist, so it can take a little time.',
    },
  ]

  return (
    <div
      style={{ background: skin.card, color: skin.ink, border: `0.8px solid ${RING}`, fontFamily: CARD_FONT }}
      className={`relative flex w-full ${CARD_WIDTH} flex-col overflow-hidden rounded-[12px] ${enter === 'back' ? 'crx-step-back' : ''}`}
    >
      {/* Same dismiss as level 2, same place - the two levels have to feel like one card. */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
        style={{ color: skin.ink40 }}
        onMouseEnter={(e) => { e.currentTarget.style.color = skin.ink }}
        onMouseLeave={(e) => { e.currentTarget.style.color = skin.ink40 }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {/* Same padding budget as level 2: 28 sides, 28 bottom, 40 top, 20 between blocks. */}
      <div className="flex flex-col gap-5 px-7 pb-7 pt-10">
        {/* The eyebrow says where you are, and the two dots say how far there is to go - which is
            the whole reason to have a level 1 at all: the reader knows the next screen is the last
            one before they have even seen it. pr-8 keeps the dots clear of the close control. */}
        <div className="flex items-center justify-between pr-8">
          <span className="text-[10px] font-semibold uppercase tracking-[1.5px]" style={{ color: skin.ink60 }}>
            Before you start
          </span>
          <span className="flex items-center gap-1.5" aria-label="Step 1 of 2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: skin.accent }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: skin.rule }} />
          </span>
        </div>

        <div>
          <h3 className="text-[20px] font-semibold leading-[30px]">Three things, then you&apos;re in.</h3>
          <p className="mt-1 text-[14px] leading-[21px]" style={{ color: skin.ink70 }}>
            Takes ten seconds.
          </p>
        </div>

        {/* STAGGERED ARRIVAL. Each row lands 90ms after the one above it, on the same easing the
            laptop's task rows use (crx-emerge's curve) but translating rather than growing - that
            keyframe animates margin-top for a stacking list, which would make this one jump. Three
            rows arriving in sequence read as being told three things, not shown a block. */}
        <ul className="flex flex-col gap-4">
          {rows.map((r, i) => (
            <li key={r.fact} className="crx-xp-row flex items-start gap-3.5" style={{ animationDelay: `${120 + i * 90}ms` }}>
              <span
                className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-[8px]"
                style={{ background: skin.wash, color: skin.accent }}
              >
                {r.icon}
              </span>
              <p className="text-[14px] leading-[21px]" style={{ color: skin.ink70 }}>
                <b className="font-semibold" style={{ color: skin.ink }}>{r.fact}</b> {r.detail}
              </p>
            </li>
          ))}
        </ul>

        {/* THE SAME BUTTON AS LEVEL 2'S CONTINUE - one CTA treatment across the dialog, so "got it"
            and "continue" read as two presses of the same control rather than two controls. */}
        <button
          type="button"
          onClick={onContinue}
          className="flex h-[41px] w-full items-center justify-center rounded-[8px] px-6 text-[14px] font-semibold leading-[21px] transition-transform duration-base ease-out-bai hover:-translate-y-0.5 active:translate-y-0"
          style={{ background: CTA, color: '#fff' }}
        >
          Got it, continue
        </button>

        {/* The returning-account door, here too: a reader who already has an account should not
            have to read what they are agreeing to a second time. Same semantics as the hero's door -
            the journey becomes returningUser before level 2 opens. */}
        <p className="text-center text-[12px] leading-[18px]" style={{ color: skin.ink40 }}>
          Already have an account?{' '}
          <button type="button" onClick={onSignIn} className="underline underline-offset-2" style={{ color: skin.ink70 }}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
