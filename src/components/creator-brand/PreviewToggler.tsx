'use client'

import { useState } from 'react'
import { useApply, type Journey } from './creators/ApplyState'

// Design-handoff state toggler — creators page only. Modelled on blueai-desktop's bottom-left dev
// Preview panel (collapsible FAB + card of labelled segmented rows), for the same reason that panel
// exists: a state that can only be reached by walking a flow is a state nobody reviews.
//
// ONE ROW NOW, NOT TWO (2026-08-14) — this used to carry "Account: Signed out / Signed in" (2026-08-13,
// itself a repurposing of the old handle-lookup row). That row is GONE, not renamed: signing in and out
// is a real flow you can click through — Apply Now opens sign-in, the account menu's Log out reverses
// it — with no design-review shortcut needed for either half any more.
//
// RESHAPED 2026-08-14: this row does NOT jump straight to the dashboard any more (it used to, and that
// was the bug — it bypassed signedIn entirely, so Log out from the dashboard had nothing to undo). It
// now sets what "Apply Now → sign in" resolves TO, same as picking which account you're about to sign
// into: New user goes to the application form (today's flow, untouched); Returning user goes to the
// dashboard; Full capacity goes to the "we'll be back" notice. None of these three personas can be
// reached by actually doing the thing they simulate (downloading BlueAI and earning through it; BlueAI
// itself being full), so this needs a design-review switch same as `signedIn` itself does. See
// ApplyState.tsx's `journey` for why this stays its own flag rather than a third/fourth `signedIn`
// value.
//
// STACKED RADIO ROWS, NOT A SEGMENTED CONTROL (2026-08-14) — widening this row from two options to
// three is exactly the case the old horizontal segmented control couldn't take: three labels sharing
// one 220px track, and "Returning user"/"Full capacity" are both longer than "New user". A segmented
// control's failure mode there is silent — text either overflows its chip or shrinks the type until it
// does — and it would recur every time a label got longer, not just now. Stacking vertically instead
// means width is never the constraint: each row gets the panel's full width to itself, so the only
// thing a longer label costs is a taller panel, which this floating card has room for.
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

const JOURNEYS: { value: Journey; label: string }[] = [
  { value: 'newUser', label: 'New user' },
  { value: 'returningUser', label: 'Returning user' },
  { value: 'fullCapacity', label: 'Full capacity' },
]

export default function PreviewToggler() {
  const { journey, setJourney } = useApply()
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
        className={`fixed bottom-3.5 left-3.5 z-[110] flex h-11 w-11 items-center justify-center rounded-circle text-ink-muted transition-colors duration-base ease-out-bai hover:text-ink-heading ${CARD}`}
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.2.61.77 1.02 1.42 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    )
  }

  return (
    <div className={`fixed bottom-3.5 left-3.5 z-[110] w-[212px] rounded-field p-3 ${CARD}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-label text-ink-muted">Preview</span>
        <button
          type="button"
          onClick={() => setOpenPanel(false)}
          aria-label="Collapse preview panel"
          className="-mr-1 flex h-9 w-9 items-center justify-center rounded-card text-ink-muted transition-colors duration-base ease-out-bai hover:bg-[var(--cb-hover)] hover:text-ink-heading"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9.5l6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className="mt-2.5">
        <span className="block text-[12px] font-semibold text-ink-body-2">Journey</span>
        {/* Each row is a radio: a dot indicator + its own full-width hit target, stacked — see the
            file comment above for why this replaced the two-option segmented control. Concentric
            radii inside the track follow the same rule the old segmented control used: an 8px track
            with 2px of padding leaves 6px for each row. */}
        <div className="mt-1.5 flex flex-col gap-0.5 rounded-card bg-[var(--cb-track)] p-0.5">
          {JOURNEYS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={journey === value}
              onClick={() => setJourney(value)}
              className={`flex items-center gap-2 rounded-[6px] px-2 py-2 text-left text-[11.5px] font-semibold transition-all duration-fast ease-out-bai ${
                journey === value ? 'bg-white text-ink-heading shadow-hairline' : 'text-ink-muted hover:text-ink-body-2'
              }`}
            >
              <span
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-circle border transition-colors duration-fast ease-out-bai ${
                  journey === value ? 'border-[var(--cb-accent)]' : 'border-stroke-warm'
                }`}
              >
                {journey === value && <span className="h-[7px] w-[7px] rounded-circle bg-[var(--cb-accent)]" />}
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-[10.5px] leading-snug text-ink-muted">
        Sets what signing in leads to — click Apply Now and sign in to see it. New user opens the
        application; Returning user opens the dashboard; Full capacity shows the &quot;we&apos;ll be
        back&quot; notice. Survives a reload; resets when the tab closes.
      </p>
    </div>
  )
}
