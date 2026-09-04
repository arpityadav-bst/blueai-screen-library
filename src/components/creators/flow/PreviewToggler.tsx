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

// THE JOURNEY LIST IS PER VERSION (Appy, 2026-08-27: "some of them may be applicable, some of them
// may not be... we should keep them relevant under each version"). Version A's ten rows describe
// program inventory - one program vs many, applied vs accepted - and Version B has no programs, so
// six of those ten rows resolve to the same screen there. A panel offering ten choices with three
// outcomes is not a state switch, it is a list of buttons that mostly do nothing - and the two
// headings would still be saying "program" on the version whose whole point is that the word is
// gone.
//
// `also` IS WHAT MAKES THE FLIP LOSSLESS. B's rows are not new journeys - they are the A journeys
// collapsed by destination (see CreatorsHome's SignedInViewV1), so each B row names the set it
// stands for. A row shows as chosen when the live journey is anywhere in its set, which is why
// flipping A -> B lands on the right row instead of appearing to reset; and clicking a row that is
// already chosen does nothing, so flipping back to A returns the persona you left rather than the
// representative B would have written over it.
type Row = { value: Journey; label: string; also?: Journey[] }
type Group = { heading: string | null; rows: Row[] }

const isOn = (row: Row, journey: Journey) => journey === row.value || !!row.also?.includes(journey)

// GROUPED BY INVENTORY, not flat (Abhisht, 2026-08-24 meeting): launch ships with exactly one
// program, so the one-program journeys ARE the going-live experience and the many-programs
// journeys are parked future states. The grouping is the navigation aid the flat list stopped
// being at eight rows.
const GROUPS_A: Group[] = [
  {
    heading: 'One program · launch',
    rows: [
      { value: 'newUser', label: 'New user' },
      { value: 'applied', label: 'Applied (in review)' },
      { value: 'returningUser', label: 'Returning user' },
      { value: 'returningEmpty', label: 'Returning, no program' },
      { value: 'fullCapacity', label: 'Full capacity' },
      { value: 'noPrograms', label: 'No programs open' },
    ],
  },
  {
    heading: 'Many programs · future',
    rows: [
      { value: 'multiPrograms', label: 'New user' },
      { value: 'appliedMulti', label: 'Applied to one, others open' },
      { value: 'enrolledMulti', label: 'Accepted in one, others open' },
      { value: 'returningMulti', label: 'Returning user' },
    ],
  },
]

// VERSION B: three rows, because v1 has three signed-in destinations and no inventory to group by.
// NO HEADINGS - "one program / many programs" is a count of a thing B does not have, and the
// launch / future split is a roadmap fact about programs specifically. One flat list is also what
// this panel looked like before programs existed, which is the version this is.
// Every A journey is covered by exactly one row below (checked against SignedInViewV1: the three
// returning personas take the dashboard, fullCapacity takes the notice, and the remaining six -
// newUser, multiPrograms, appliedMulti, enrolledMulti, applied, noPrograms - all land on the
// application). If a journey is ever added to A it belongs in one of these sets too, or B will
// quietly show no row selected at all.
const GROUPS_B: Group[] = [
  {
    heading: null,
    rows: [
      {
        value: 'newUser',
        label: 'New user',
        // 'applied' and 'noPrograms' sit here rather than getting rows of their own: B has no
        // in-review screen, and nothing to be open or closed, so both land on the application.
        also: ['multiPrograms', 'appliedMulti', 'enrolledMulti', 'applied', 'noPrograms'],
      },
      {
        value: 'returningUser',
        label: 'Returning user',
        // returningEmpty and returningMulti are program-inventory variants of one person - in B
        // there is only "you are earning", so the dashboard they all open is the same screen.
        also: ['returningEmpty', 'returningMulti'],
      },
      { value: 'fullCapacity', label: 'Full capacity' },
    ],
  },
]

// VERSION C: A's rows exactly, because C keeps the chooser and therefore keeps every state A has -
// one open, several open, applied, accepted-with-others-open, nothing open. Only the heading noun
// differs, so C's list is DERIVED from A's rather than written out again. A row added to A is a row
// added to C for free, which is the drift this file would otherwise grow: two lists of ten that
// have to be edited in step, and are discovered out of step months later.
// "offer" is C's own noun (ProgramsHome picks the same word for its four chooser strings), and one
// replace covers both headings - "One program" -> "One offer", "Many programs" -> "Many offers".
const GROUPS_C: Group[] = GROUPS_A.map((g) => ({
  ...g,
  heading: g.heading ? g.heading.replace('program', 'offer') : null,
}))

// The panel's note describes the list above it, so it varies the same way. C's is derived from A's
// for the same reason its groups are: the sentence differs by one noun, and two hand-written copies
// of it would eventually disagree.
const NOTE_A = 'The one-program group is the launch experience; the many-programs group holds the future states.'
const NOTE_C = NOTE_A.replace(/program/g, 'offer')
const NOTE_B =
  'Version B has three signed-in screens — the application, the dashboard and the full-capacity notice — so it lists three. Your Version A row is remembered while you are here.'

function Gear() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.2.61.77 1.02 1.42 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export default function PreviewToggler() {
  const { journey, setJourney, variant, setVariant, theme, setTheme } = useCrx()
  // B collapses to three rows; C keeps all ten under its own noun; A is the default.
  const groups = variant === 'original' ? GROUPS_B : variant === 'offers' ? GROUPS_C : GROUPS_A
  const note = variant === 'original' ? NOTE_B : variant === 'offers' ? NOTE_C : NOTE_A
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

      {/* THEME ABOVE VERSION (2026-09-02), and it is the one control here that is temporary: the
          page is being converted to light, and this exists so the two can be compared rather than
          remembered. It sits first because it governs every other row below it - a version or a
          journey judged in the wrong theme is judged twice.
          Session-backed, so a reload while reviewing a repaint keeps the theme it was on. */}
      <div className="crx-toggler-track" role="radiogroup" aria-label="Theme">
        <span className="crx-toggler-sect">Theme</span>
        {(
          [
            { value: 'dark', label: 'Dark · current' },
            { value: 'light', label: 'Light · in progress' },
          ] as const
        ).map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={theme === value}
            onClick={() => setTheme(value)}
            className={theme === value ? 'crx-toggler-row on' : 'crx-toggler-row'}
          >
            <span className="crx-toggler-dot" />
            {label}
          </button>
        ))}
      </div>

      {/* VERSION FIRST (2026-08-26, Abhisht): A is the programs build; B is the original v1
          experience with no "program" vocabulary anywhere — the term arrived via engg without
          internal agreement, so reviewers need both. In B the journey rows below collapse onto
          v1's three destinations (application / dashboard / full-capacity). */}
      <div className="crx-toggler-track" role="radiogroup" aria-label="Version">
        <span className="crx-toggler-sect">Version</span>
        {(
          [
            { value: 'programs', label: 'A · Programs' },
            { value: 'original', label: 'B · Original, no programs' },
            { value: 'offers', label: 'C · Chooser, no "program" word' },
          ] as const
        ).map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={variant === value}
            onClick={() => setVariant(value)}
            className={variant === value ? 'crx-toggler-row on' : 'crx-toggler-row'}
          >
            <span className="crx-toggler-dot" />
            {label}
          </button>
        ))}
      </div>

      {/* Each row is a radio: dot indicator + full-width hit target, stacked (see file comment).
          The kit paints the chosen dot via .on's ::after — markup only supplies the ring.
          `key` on the group is the heading OR the first row's value: B's single group has no
          heading, and null is not a key. */}
      <div className="crx-toggler-track" role="radiogroup" aria-label="Journey">
        {groups.map(({ heading, rows }) => (
          <div key={heading ?? rows[0].value} className="crx-toggler-group">
            {heading && <span className="crx-toggler-sect">{heading}</span>}
            {rows.map((row) => {
              const on = isOn(row, journey)
              return (
                <button
                  key={row.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  // Already chosen = no-op, deliberately. In B a row stands for a SET of A
                  // journeys, so re-clicking it would overwrite the live journey with the set's
                  // representative and quietly change which persona A comes back to.
                  onClick={() => { if (!on) setJourney(row.value) }}
                  className={on ? 'crx-toggler-row on' : 'crx-toggler-row'}
                >
                  <span className="crx-toggler-dot" />
                  {row.label}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* The note describes the list above it, so it changes with the list. The A copy explains a
          grouping B does not have; the B copy says what B's three rows are and, more usefully, that
          the A persona is not lost while you are over here. */}
      <p className="crx-toggler-note">
        Theme is a work-in-progress switch, not a product setting. Sets what signing in leads to.
        Click Get Access and sign in to see it.{' '}
        {note}{' '}
        Survives a reload; resets when the tab closes.
      </p>
    </div>
  )
}
