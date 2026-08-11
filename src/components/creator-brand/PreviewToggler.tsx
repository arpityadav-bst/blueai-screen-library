'use client'

import { useState } from 'react'
import { useCBModal } from './ModalHost'

// Design-handoff state toggler — creators page only. Modelled on blueai-desktop's bottom-left dev
// Preview panel (collapsible FAB + card of labelled segmented rows), for the same reason that panel
// exists: the "we couldn't read your channel" path has no real YouTube API behind it to fail on its
// own, so without a control it is a state nobody can reach and therefore a state nobody reviews.
//
// IT MUST NOT LOOK LIKE A CTA — the designer's constraint, and the reason the source panel was built
// as its own visual language too. Nothing here is a gradient or a 128px pill: the track is a flat
// grey inset, the active segment is a plain white chip with a hairline shadow (the classic light
// segmented control), and everything is 11–12px. A reviewer should never have to wonder whether a
// control belongs to the product being reviewed.
//
// LIGHT, not the source panel's near-black (designer, 2026-08-11). The dark version was a hole in a
// light page. blueai-desktop's is dark because it floats over a dark app window; here the reason to
// copy is the STRUCTURE, not the palette.
//
// STACKED — label above, track below, segments sharing the width. The inline version put a fixed
// label and a fixed track on one 236px row and "Not found" ran off the edge. Stacking is what the
// source panel's own `.stacked` variant exists for, and it holds for any label length rather than
// until the next word gets longer.
//
// BOTTOM-LEFT and ABOVE the dialogs (z-[110] vs the modal's z-[100]), both from the source panel's
// reasoning: the page's own CTAs and closing band claim the bottom-right, and a reviewer needs to
// flip the state WHILE a popup is open and watch it re-run.

const CARD = 'border border-divider bg-white/95 shadow-float backdrop-blur-[6px]'

export default function PreviewToggler() {
  const { lookupMode, setLookupMode } = useCBModal()
  // MINIMIZED by default (designer, 2026-08-11) — the source panel opens itself because it is the
  // only way to reach several of that prototype's states, but here it governs one optional branch
  // and this is a page a designer reviews as a page. The FAB keeps it one click away.
  const [openPanel, setOpenPanel] = useState(false)

  if (!openPanel) {
    return (
      <button
        type="button"
        onClick={() => setOpenPanel(true)}
        aria-label="Preview state"
        className={`fixed bottom-3.5 left-3.5 z-[110] flex h-9 w-9 items-center justify-center rounded-circle text-ink-muted transition-colors duration-base ease-out-bai hover:text-ink-heading ${CARD}`}
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.2.61.77 1.02 1.42 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    )
  }

  return (
    <div className={`fixed bottom-3.5 left-3.5 z-[110] w-[228px] rounded-field p-3 ${CARD}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-label text-ink-muted">Preview</span>
        <button
          type="button"
          onClick={() => setOpenPanel(false)}
          aria-label="Collapse preview panel"
          className="-mr-1 flex h-6 w-6 items-center justify-center rounded-card text-ink-muted transition-colors duration-base ease-out-bai hover:bg-[var(--cb-hover)] hover:text-ink-heading"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9.5l6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className="mt-2.5">
        <span className="block text-[12px] font-semibold text-ink-body-2">Handle lookup</span>
        {/* Concentric radii: the track is 8px with 2px of padding, so the inner chips are 8−2=6.
            Taken from the source panel, which had this exact pair caught by its own radius audit —
            the segments fill the track's corners, so matching the outer radius inside would leave a
            visible sliver of track at each corner. */}
        <div className="mt-1.5 flex gap-0.5 rounded-card bg-[var(--cb-track)] p-0.5">
          {([['auto', 'Found'], ['manual', 'Not found']] as const).map(([m, label]) => (
            <button
              key={m}
              type="button"
              aria-pressed={lookupMode === m}
              onClick={() => setLookupMode(m)}
              className={`flex-1 rounded-[6px] px-2 py-1 text-[11.5px] font-semibold transition-all duration-fast ease-out-bai ${
                lookupMode === m
                  ? 'bg-white text-ink-heading shadow-hairline'
                  : 'text-ink-muted hover:text-ink-body-2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-[10.5px] leading-snug text-ink-muted">
        Switches what the handle lookup finds. Re-runs live while the popup is open.
      </p>
    </div>
  )
}
