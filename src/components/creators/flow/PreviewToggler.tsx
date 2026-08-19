'use client'

import { useState } from 'react'
import { useCrx, type Journey } from './CrxState'

// Design-handoff state toggler — re-skinned from the frozen creator-brand tree's PreviewToggler.tsx
// (read-only reference, never imported) into the kit's .crx-toggler language (creators.css). Same
// reason it exists there: a state that can only be reached by walking a flow is a state nobody
// reviews — none of the three personas can be reached by actually doing the thing they simulate
// (downloading BlueAI and earning through it; BlueAI itself being full).
//
// IT SETS WHAT "sign in" RESOLVES TO — it does NOT jump straight to the dashboard. The frozen tree
// learned that the hard way: an early version bypassed signedIn entirely, so Log out from the
// dashboard had nothing to undo. New user → application form; Returning user → dashboard; Full
// capacity → the "we'll be back" notice. signedIn always gates first (see CrxState.tsx).
//
// IT MUST NOT LOOK LIKE A CTA — the designer's constraint, and the kit's own: no gradient anywhere,
// flat inset track, 11–12px type. A reviewer should never wonder whether a control belongs to the
// product being reviewed. On this dark page the panel is the kit's dark glass, not the frozen
// tree's white card — that one was light only because it floated over a light page; what carries
// over is the STRUCTURE, not the palette.
//
// STACKED RADIO ROWS, NOT A SEGMENTED TRACK: three labels of different lengths sharing one ~200px
// horizontal track fail silently — text overflows its chip or shrinks until it does, and recurs
// every time a label grows. Stacked, each row gets the panel's full width; a longer label only
// costs panel height, which a floating card has room for.
//
// BOTTOM-LEFT and ABOVE the dialogs (the kit pins .crx-toggler at z-110 vs the modal's 100): the
// page's own CTAs claim the bottom-right, and a reviewer needs to flip the journey WHILE the
// sign-in dialog is open and watch where it lands.

const JOURNEYS: { value: Journey; label: string }[] = [
  { value: 'newUser', label: 'New user' },
  { value: 'returningUser', label: 'Returning user' },
  { value: 'fullCapacity', label: 'Full capacity' },
]

function Gear() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.2.61.77 1.02 1.42 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export default function PreviewToggler() {
  const { journey, setJourney } = useCrx()
  // MINIMIZED by default (the frozen tree's designer call, 2026-08-11): this governs one optional
  // branch, and the page is reviewed as a page. The FAB keeps it one click away.
  const [openPanel, setOpenPanel] = useState(false)

  if (!openPanel) {
    return (
      <button type="button" onClick={() => setOpenPanel(true)} aria-label="Preview state" className="crx-toggler fab">
        <Gear />
      </button>
    )
  }

  return (
    <div className="crx-toggler">
      {/* The head row IS the collapse control — the kit has no dedicated collapse-button style, and
          a full-width target beats a tiny chevron anyway. .crx-toggler-row supplies the ghost-button
          reset (font, cursor, hover ink); the nested span keeps the head's mono micro-label voice. */}
      <button type="button" onClick={() => setOpenPanel(false)} aria-expanded="true" aria-label="Collapse preview panel" className="crx-toggler-row">
        <span className="crx-toggler-head">Preview · journey</span>
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9.5l6 6 6-6" />
        </svg>
      </button>

      {/* Each row is a radio: dot indicator + full-width hit target, stacked (see file comment).
          The kit paints the chosen dot via .on's ::after — markup only supplies the ring. */}
      <div className="crx-toggler-track" role="radiogroup" aria-label="Journey">
        {JOURNEYS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={journey === value}
            onClick={() => setJourney(value)}
            className={journey === value ? 'crx-toggler-row on' : 'crx-toggler-row'}
          >
            <span className="crx-toggler-dot" />
            {label}
          </button>
        ))}
      </div>

      <p className="crx-toggler-note">
        Sets what signing in leads to — click Apply Now and sign in to see it. New user opens the
        application; Returning user opens the dashboard; Full capacity shows the &quot;we&apos;ll be
        back&quot; notice. Survives a reload; resets when the tab closes.
      </p>
    </div>
  )
}
