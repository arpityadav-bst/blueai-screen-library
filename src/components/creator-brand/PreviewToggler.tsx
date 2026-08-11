'use client'

import { useState } from 'react'
import { useCBModal } from './ModalHost'

// Design-handoff state toggler — creators page only. Modelled directly on blueai-desktop's
// bottom-left dev Preview panel (collapsible FAB + card of labelled segmented rows), for the same
// reason that panel exists: the "we couldn't read your channel" path has no real YouTube API
// behind it to fail on its own, so without a control it is a state nobody can reach and therefore
// a state nobody reviews.
//
// IT LOOKS NOTHING LIKE A CTA, ON PURPOSE — the designer's constraint, and the reason the source
// panel was built this way too. Its colours are FIXED dev chrome, not --bai-* tokens: flat slate
// on near-black, 12px, 4px corners, no gradient, no pill, no shadow-cta. A reviewer must never
// have to wonder whether a control is part of the product being reviewed. Every real CTA on this
// site is a gradient pill; nothing here is.
//
// BOTTOM-LEFT and ABOVE the dialogs (z-[110] vs the modal's z-[100]), both copied from the source
// panel's own reasoning: the page's own CTAs and the closing band claim the bottom-right, and a
// reviewer needs to keep flipping the state WHILE a popup is open and watch it re-run.

const PANEL = 'border border-white/[0.14] bg-[rgba(10,14,26,0.92)] backdrop-blur-[6px]'
const DIM = 'text-[#8190ad]'

export default function PreviewToggler() {
  const { lookupMode, setLookupMode } = useCBModal()
  // Open by default, like the source panel: this is the only way to reach one of the two states,
  // so a reviewer arriving at the page should see the control rather than discover a FAB first.
  const [openPanel, setOpenPanel] = useState(true)

  return (
    <div className="fixed bottom-3.5 left-3.5 z-[110]">
      {openPanel ? (
        <div className={`w-[236px] rounded-field p-3 shadow-[0_10px_34px_rgba(0,0,0,0.4)] ${PANEL}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-label ${DIM}`}>Preview</span>
            <button
              type="button"
              onClick={() => setOpenPanel(false)}
              aria-label="Collapse preview panel"
              className={`flex p-0.5 transition-colors hover:text-[#cdd6f4] ${DIM}`}
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9.5l6 6 6-6" />
              </svg>
            </button>
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-3 py-1">
            <span className={`shrink-0 text-[12px] font-bold ${DIM}`}>Handle lookup</span>
            {/* Concentric radii: the track is 6px with 2px of padding, so the inner buttons are
                6−2=4. Taken from the source panel, which had this exact pair caught by its own
                radius audit — the segments fill the track's corners, so a matching 6px inside a
                6px would leave a visible sliver of track at each corner. */}
            <div className="flex shrink-0 gap-px rounded-[6px] bg-white/[0.07] p-0.5">
              {([['auto', 'Found'], ['manual', 'Not found']] as const).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={lookupMode === m}
                  onClick={() => setLookupMode(m)}
                  className={`rounded-[4px] px-2 py-1 text-[12px] font-semibold transition-colors duration-fast ${
                    lookupMode === m ? 'bg-[#2a4a86] text-[#eaf0ff]' : `${DIM} hover:text-[#cdd6f4]`
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-1.5 text-[10.5px] leading-snug text-[#5f6d88]">
            Switches what the handle lookup finds. Re-runs live while the popup is open.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpenPanel(true)}
          aria-label="Preview state"
          className={`flex h-[34px] w-[34px] items-center justify-center rounded-circle shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-colors hover:text-[#cdd6f4] ${PANEL} ${DIM}`}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.2.61.77 1.02 1.42 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      )}
    </div>
  )
}
