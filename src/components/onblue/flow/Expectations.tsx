'use client'

import { CARD_FONT, CARD_WIDTH, CTA, CTA_SHADOW, RING, SKIN } from './signinSkin'
import BandGrid from '../BandGrid'
import { CARDS, INTRO } from './expectationCards'

// LEVEL 1 OF THE SIGN-IN DIALOG (Appy, 2026-09-02: "sign up becomes a 2 level thing... where we
// set the right expectations for the user"). It shows before the sign-in card, to applicants only:
// the "Sign in" door for returning accounts skips straight past it.
//
// WHAT THIS IS FOR, AND WHAT IT IS NOT. The homepage's four cards (Apply, Get accepted, Deploy it,
// Collect) explain what HAPPENS. This has a different job: what you are AGREEING TO — the three
// constraints people misread and then drop out over, pulled to the front before anyone types an
// email. So it is not the four cards again in a popup, and it is not a form either: the application
// already asks the qualifying questions, and ticking them here too would be friction dressed as
// diligence. Three facts, then one "got it".
//
// THREE CARDS AT ONCE, AND THE CAROUSEL IS GONE (Appy, 2026-09-10: "we are not going to use the
// carousel one"). This page had the timed version — one card, one illustration, dots and an arrow —
// and it is deleted rather than parked behind a switch, because nothing is being compared any more.
// The reason the three-up wins: a carousel makes the second and third facts cost a wait or a click,
// and these three are a SET. "Runs on your PC, you approve it, you get paid" is one sentence in
// three parts, and a reader who has seen only the first part has not seen the offer.
// Each card carries ONE line — the crux of the old bold lead-in and its detail, said once. The note
// in expectationCards records why it is not a title plus a caption.
//
// EVERY FACT IS SOURCED from copy already on the site — the 20 days and the $30 via PayPal from the
// application's intro step, "you approve each campaign" from card 04, the waitlist from the
// confirmation. Nothing new is claimed here.
//
// onBlue'S COLOURS (Appy, 2026-09-10: "the only difference here is the colors, those will be onBlue
// oriented"). Same markup as the creators dialog, painted from THIS fork's palette: the charcoal
// CTA, #2f6dff on the icons, and the card surfaces from --sur-2 / --line, which on this page are
// the charcoal-derived neutrals rather than the DS's blue-greys.
// ONE SKIN, NO THEME READ. creators keeps a dark path and so reads SKIN[theme]; this fork is
// light-only, so SKIN is a single object and there is no useCrx() here at all.

export default function Expectations({
  onContinue,
  onSignIn,
  onClose,
  enter,
}: {
  onContinue: () => void
  /** "Already have an account? Sign in" — jumps to level 2 as a returning account. */
  onSignIn: () => void
  onClose: () => void
  /** 'back' when reached from level 2's Back link, so it slides in from the left. */
  enter?: 'back'
}) {
  return (
    <div
      style={{ background: SKIN.card, color: SKIN.ink, border: `0.8px solid ${RING}`, fontFamily: CARD_FONT }}
      className={`crx-xp relative flex w-full ${CARD_WIDTH} flex-col overflow-hidden rounded-[12px] ${enter === 'back' ? 'crx-step-back' : ''}`}
    >
      {/* THE GRID, top and bottom — the closer's own fans at dialog scale. No shine: the travelling
          wave belongs to a full-width band you scroll past, and behind three cards and a button it
          competes with the thing it frames. Its own idPrefix because the closer's grid is on the
          page behind this one, and two grids sharing mask ids break the moment their sizes differ.
          Colour comes from .crx-xp-grid in onblue.css. */}
      <BandGrid idPrefix="crxXp" className="crx-xp-grid" />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
        style={{ color: SKIN.ink40 }}
        onMouseEnter={(e) => { e.currentTarget.style.color = SKIN.ink }}
        onMouseLeave={(e) => { e.currentTarget.style.color = SKIN.ink40 }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {/* 56 TOP, not level 2's 40. The close control sits at top-3 and is 32px tall, so its bottom
          edge is at 44; 56 clears it by 12 and reads as the generous top edge this card was asked
          for. Sides, bottom and the block gap stay level 2's. */}
      <div className="relative z-10 flex flex-col gap-5 px-7 pb-7 pt-14">
        {/* NO HEADER AT ALL (Appy, 2026-09-08). This carried an eyebrow, a heading, a sub and a
            two-dot step indicator, all removed across earlier passes: every one described the
            screen instead of being it, and a card that spends its first three lines saying it will
            be quick is not being quick.
            THE CARD IS NOT UNNAMED — Modal.tsx sets aria-label="Before you start" on the dialog, so
            the accessible name survives the visible heading. */}
        {/* WHAT IT IS, BEFORE WHAT IT ASKS. See expectationCards for why a heading is back on a
            screen that had one deleted: this one names the product, which the stripped version
            never did. */}
        <p className="crx-xp-intro" style={{ color: SKIN.ink }}>{INTRO}</p>

        <ul className="crx-xp-cards">
          {CARDS.map((c) => {
            const Art = c.art
            return (
              // A LIST ITEM, NOT A BUTTON. Nothing here is pressable — the hover only plays a
              // drawing — so a <button> would promise an action that does not exist and put three
              // dead stops in the tab order before the one control that matters. tabIndex 0 on a
              // group role gives a keyboard reader the same access to the animation without
              // claiming it does something. The label is the FULL sentence rather than the two
              // visible lines: the trim to fit a 136px column dropped the waitlist and the "nothing
              // goes out unseen", and a visual decision should not also cost a blind reader a fact.
              <li key={c.key} className="crx-xp-card" tabIndex={0} role="group" aria-label={c.full}>
                <span className="crx-xp-icon" style={{ color: SKIN.accent }}>
                  <Art />
                </span>
                {/* ONE PARAGRAPH, TWO WEIGHTS - not two elements. The lead and the rest are a
                    single sentence that happens to change colour partway through, so they wrap as
                    one; a separate line for the lead would break mid-sentence at every card width
                    and put a ragged gap between halves that belong together. */}
                <p className="crx-xp-l" style={{ color: SKIN.ink70 }}>
                  <b style={{ color: SKIN.ink }}>{c.lead}</b> {c.rest}
                </p>
              </li>
            )
          })}
        </ul>

        {/* THE PAGE'S PRIMARY — the same button as level 2's Continue and as the hero's Get
            Access. One primary action, one appearance, on the page or in a dialog. */}
        <button
          type="button"
          onClick={onContinue}
          className="flex h-[44px] w-full items-center justify-center rounded-pill px-6 text-[15px] font-bold leading-[21px] transition-[transform,box-shadow] duration-base ease-out-bai hover:-translate-y-0.5 active:translate-y-0"
          style={{ background: CTA, color: '#fff', boxShadow: CTA_SHADOW }}
        >
          Got it, continue
        </button>

        {/* The returning-account door, here too: a reader who already has an account should not
            have to read what they are agreeing to a second time. Same semantics as the hero's door —
            the journey becomes returningUser before level 2 opens. */}
        <p className="text-center text-[12px] leading-[18px]" style={{ color: SKIN.ink40 }}>
          Already have an account?{' '}
          {/* It had no hover at all - an underlined word that does nothing on approach reads as
              emphasis rather than as a link. It goes to full ink, which is the only move available
              to text that is already underlined. */}
          <button
            type="button"
            onClick={onSignIn}
            className="underline underline-offset-2 transition-colors duration-fast ease-out-bai"
            style={{ color: SKIN.ink70 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = SKIN.ink }}
            onMouseLeave={(e) => { e.currentTarget.style.color = SKIN.ink70 }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
