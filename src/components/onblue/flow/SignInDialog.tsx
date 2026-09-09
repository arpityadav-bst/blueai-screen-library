'use client'

import { useCrx } from './CrxState'
import { CARD_FONT, CTA, CTA_SHADOW, FORM_WIDTH, RING, SKIN } from './signinSkin'

// COPIED near-verbatim from the frozen creator-brand tree's creators/SignInDialog.tsx (read-only
// reference, never imported) — designer directive: "the sign in pop up will remain the same". Three
// changes only: useCrx replaces useApply, the root carries its own w-full max-w-[360px] (the frozen
// Modal's size="xs" used to supply it; this page's Modal is an unsized slot), and this header note.
// Everything below — waves, measured paddings, provider buttons, legal line — is byte-faithful,
// Tailwind classes included: this card is a self-contained replica of now.gg's own screen, not a
// kit consumer, so the page's no-Tailwind convention deliberately does not apply inside it.
//
// The now.gg sign-in card, rebuilt from the real page's own computed styles and assets.
//
// SCRAPED, NOT EYEBALLED (2026-08-13, designer authority — "its mine only"). Every number below came
// off now.gg/accounts/auth/v1/identifier via getComputedStyle at the card's real 360px width, and the
// logos and provider icons are the actual files from cdn.now.gg, saved under
// public/creator-brand/nowgg-signin/ (shared public assets — the paths work from this route too).
// The previous version of this file was a likeness built from a screenshot and it was wrong in ways
// a screenshot cannot show: the typeface is POPPINS (not this site's Inter/Space Grotesk), the card
// is a dark panel with a 0.8px #7B4CFF ring — not the warm brown it looked like — and the header is
// TWO translucent gradient wave SVGs layered over that glass rather than a solid gradient strip.
//
// The measured spec, so nobody has to re-scrape to check a value:
//   card        360px wide · radius 12 · 0.8px solid #7B4CFF · overflow hidden. Ours is a SOLID
//               dark grey with NO backdrop blur (scraped: translucent black + blur) — SKIN.dark.card.
//   waves       360x135 @ opacity .4 and 360x123 @ opacity .5, both #7B4CFF -> #0EA4C5, second
//               reversed · header block 110px tall, 16px below it
//   (the "One account for" line and the BlueStacks / now.gg lockup that sat here were removed
//    on 2026-09-02 - the two rows below are kept as the record of what the real card shows,
//    since this file is a transcription of it and the next reader will compare the two)
//   logos row   gap 18 · BlueStacks mark 42x38 + wordmark 75x13 at gap 10.84 · a 1x35 vertical
//               gradient rule (transparent -> rgba(255,255,255,.4) -> transparent) · now.gg 122x37
//   heading     Poppins 20/30 · 600 · #fff
//   sub-heading Poppins 14/21 · 400 · rgba(255,255,255,.7) at opacity .9 · 8 above
//   field label 10 · 600 · +1.5px tracking · uppercase · rgba(255,255,255,.8) · 4 above its input
//   input       14/21 · 400 · #fff · bg rgba(0,0,0,.2) · radius 8 · 0.8px rgba(255,255,255,.5) ·
//               shadow 0 2px 8px rgba(0,0,0,.04) · padding 8 16
//   Continue    14/21 · 600 · linear-gradient(270deg,#7B4CFF 0%,#0EA4C5 99.48%) · radius 8 ·
//               padding 6 24 · 41px tall
//   separator   row gap 16 · rule + "Or sign in with" at 14/14 · 400 · rgba(255,255,255,.4)
//   providers   Google only since 2026-09-10 - ONE full-width pill. The scrape's row was four
//               68x40 tiles (Apple/Google white, Discord #8061FF, Facebook #2178FA); this is
//               the one line in the block that is deliberately not the replica any more.
//   legal       12/18 · 400 · #fff · links underlined, same colour
//   form gaps   16 between blocks, 4 between a label and its input, 24 horizontal padding
//
// STILL NOT A REAL LOGIN, and it must never become one. There is no auth behind this: the email
// field collects nothing, has no name/autoComplete, and posts nowhere. Every control lands on the
// same prototype sign-in so a reviewer can't dead-end on a button that looks operable.
// SOLID DARK GREY, NO BLUR (designer, 2026-08-13). The scrape's card is glass, but the blur was
// never visible — the site scrim sits between this card and the page, and a backdrop-filter can
// only reveal what is behind it. Solid rather than any alpha: a translucent card's read changes
// with whatever page is behind it, and a solid one is the same card every time.
// THE CARD IS NO LONGER A STRICT REPLICA (Appy, 2026-09-02). Everything above still describes the
// real now.gg card and is kept as the record this file was transcribed from - but the surface, the
// ink and the field follow the page's theme, the band and the branding are gone, and since the
// dialog grew a first level (Expectations.tsx) the palette lives in ./signinSkin so both levels
// draw from one set. This is LEVEL 2: the sign-in itself.
const A = '/creator-brand/nowgg-signin'

// GOOGLE ONLY, matching the creators card (Appy, 2026-09-10: "the login pop-up will be the same as
// what is there on the BlueAI creators screens... we will also not be needing Discord, Facebook,
// Apple options there too"). Those three came from the now.gg card this was a replica of, and being
// a replica is the only reason they were ever here - nothing on this site signs in with Discord.
// Four icon-only tiles also asked the reader to identify each provider by logo alone; one
// full-width labelled button says what it does.
const GOOGLE = `${A}/google_light.png`

export default function SignInDialog({
  onClose,
  onBack,
  returning,
  enter,
}: {
  onClose: () => void
  /** Present only on the applicant path - a way back to the expectations they just read. */
  onBack?: () => void
  /** Decides the sub-heading: an applicant is here to submit, a returning account to get back in. */
  returning: boolean
  /** 'fwd' when reached from level 1, so the card slides in from the right. */
  enter?: 'fwd'
}) {
  const { signIn } = useCrx()

  // TOP OF THE PAGE, not the form (designer, 2026-08-13). This used to scroll the form into view,
  // which landed it under the header with the headline already gone — you arrived mid-page at
  // something you had not been introduced to. Scrolling to 0 needs no target at all, and it matters
  // most from the closing band, where the reader is at the bottom when they sign in.
  function go() {
    signIn()
    onClose()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    // Width, face and ring come from signinSkin so level 1 cannot drift from them. 400, not the
    // measured 360 (see FORM_WIDTH for why): the card stopped being an exact replica when the band
    // went, and level 1 needs the room.
    <div
      style={{
        background: SKIN.card,
        color: SKIN.ink,
        border: `0.8px solid ${RING}`,
        fontFamily: CARD_FONT,
      }}
      className={`relative flex w-full ${FORM_WIDTH} flex-col overflow-hidden rounded-[12px] ${enter === 'fwd' ? 'crx-step-fwd' : ''}`}
    >
      <>
        {/* HEADER — the waves are absolutely positioned so they bleed past it exactly as they do on
            the real card (both SVGs are taller than the header and start above y=0). */}
        {/* NO BAND AT ALL (Appy, 2026-09-02). It held "One account for" and the BlueStacks /
            now.gg lockup, then just a flattened wave, and now nothing: the card opens straight on
            "Login or Sign up". Waves() went with it rather than being left unrendered - a component
            with no consumer is the thing that makes the next reader look for where it is used. */}
        {/* THE WAY BACK, applicant path only. Someone who arrived through the expectations screen
            may want to re-read it; someone who came in through "Sign in" never saw it and gets no
            link to a screen that was not there. Top-left, mirroring the dismiss at top-right, so the
            two controls read as the card's pair of corners rather than as content. */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            style={{ color: SKIN.ink40 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = SKIN.ink }}
            onMouseLeave={(e) => { e.currentTarget.style.color = SKIN.ink40 }}
          >
            {/* A DRAWN CHEVRON, not a glyph. This was &lsaquo; plus the word "Back" - a typographic
                angle-quote, which is not an arrow: it renders thin and at a different weight in
                every face, and it left a text link in one corner facing a 32px icon button in the
                other. Same 32px round target, same stroke width and same hover as the dismiss, so
                the two corners are actually the pair the comment above claims. Icon-only for the
                same reason: the label is on the screen it returns to. */}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14.5 6l-6 6 6 6" />
            </svg>
          </button>
        )}
        {/* The dismiss. This card paints its own surface and is NOT inside the .crx token scope, so
            it cannot borrow the kit's .crx-modal-x; it is built from the same SKIN the rest of the
            card uses. Absolutely positioned so it never joins the content flow - the heading stays
            optically centred in the card's full width rather than being pushed off-centre by a
            control sharing its row. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ color: SKIN.ink40 }}
          onMouseEnter={(e) => { e.currentTarget.style.color = SKIN.ink }}
          onMouseLeave={(e) => { e.currentTarget.style.color = SKIN.ink40 }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* BODY. The real card's measurements were 24px sides / 16px between blocks, and both went
            up when the band was removed (Appy, 2026-09-02: "keep generous padding throughout and
            around the edges especially top edge"): 28 sides, 28 bottom, 20 between blocks.
            THE TOP IS 40, not 28, and deliberately unequal. The card used to open with 56px of wave
            above the heading, so the eye had a run-up; with the band gone, matching the side padding
            at the top would put the heading almost against the card's edge. 40 also clears the
            close control at top-3, so the two never crowd. */}
        <div className="flex flex-col gap-5 px-7 pb-7 pt-10">
          <div>
            <h3 className="text-center text-[20px] font-semibold leading-[30px]">Login or Sign up</h3>
            {/* Was now.gg's "Save your progress & earn rewards" - true of their product, not of this
                flow. Two honest lines instead, one per door: an applicant is here to submit, a
                returning account is here to get back to its dashboard. */}
            <h3 className="mt-2 text-center text-[14px] font-normal leading-[21px] opacity-90" style={{ color: SKIN.ink70 }}>
              {returning ? 'Sign in to open your dashboard.' : 'Sign in to submit your application.'}
            </h3>
          </div>

          {/* 4px between the label and its field — the real .form-field gap. */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase leading-[14.4px] tracking-[1.5px]" style={{ color: SKIN.ink80 }}>
              Email
            </span>
            {/* Every visual is a class, none in `style` — an inline border would beat the hover/focus
                variants silently (the frozen file's own hard-won fix). Rest is the scraped 0.8px
                rgba(255,255,255,.5) on rgba(0,0,0,.2); hover lifts the border only; focus goes to
                the card's own #7B4CFF with a soft ring, which is why outline-none is safe here. */}
            <input
              type="email"
              inputMode="email"
              autoComplete="off"
              placeholder="abc@xyz.com"
              // text-[16px] BELOW sm, 14px above. iOS Safari zooms the whole page when a focused
              // field is under 16px; 14 is the scraped value, kept everywhere that isn't a phone.
              className={`w-full rounded-[8px] border-[0.8px] px-4 py-2 text-[16px] font-normal leading-[21px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] outline-none transition-[border-color,box-shadow] duration-base ease-out-bai sm:text-[14px] ${SKIN.field}`}
            />
          </div>

          <button
            type="button"
            onClick={go}
            // THE PAGE'S PRIMARY, not the replica's. h-[41px]/8px/600 were now.gg's measured
            // button; the page's own .btn is a pill at 700 with an iris shadow, and one primary
            // action should have one appearance whether it is on the hero or in a dialog. 44px
            // rather than .btn's padding maths, because this one is full-width in a fixed card.
            // Colour is #fff explicitly so nothing in the card's inherited chain can tint it.
            style={{ background: CTA, color: '#fff', boxShadow: CTA_SHADOW }}
            className="flex h-[44px] w-full items-center justify-center rounded-pill px-6 text-[15px] font-bold leading-[21px] transition-[transform,box-shadow] duration-base ease-out-bai hover:-translate-y-0.5 active:translate-y-0"
          >
            Continue
          </button>

          {/* Kept even though it now introduces ONE option: without it the Google button reads as a
              second primary action stacked under Continue, rather than as the other way in. */}
          <div className="flex flex-row items-center justify-center gap-4">
            <span className="h-px flex-auto" style={{ background: SKIN.rule }} />
            <span className="flex-none text-[14px] font-normal leading-[14px]" style={{ color: SKIN.ink40 }}>
              Or sign in with
            </span>
            <span className="h-px flex-auto" style={{ background: SKIN.rule }} />
          </div>

          {/* FULL WIDTH AND LABELLED, the same shape the creators card takes. With one provider left
              there is no row to lay out, and a lone 68px tile floating in a 400px card would read as
              an afterthought. It takes Continue's pill shape so the two read as the same KIND of
              control - the fill is what says which of them is primary. The measured-widths note that
              used to live here went with the four tiles it was measuring.
              THE INK IS THIS FORK'S. Google's own button is dark text on white, so the tile stays
              white either way; the text takes SKIN.ink, which on this page is the charcoal-derived
              #23262C rather than creators' blue-black. */}
          <button
            type="button"
            onClick={go}
            style={{ background: '#fff', border: `1px solid ${SKIN.tileLine}`, color: SKIN.ink }}
            className="flex h-[44px] w-full items-center justify-center gap-2.5 rounded-pill px-6 text-[15px] font-semibold leading-[21px] transition-transform duration-base ease-out-bai hover:-translate-y-0.5 active:translate-y-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GOOGLE} alt="" width={20} height={20} className="shrink-0" />
            Continue with Google
          </button>

          {/* REAL ANCHORS since 2026-08-31 — the legal page exists now (/creators/terms, tabbed),
              so the underlines stopped being costume. New tab on purpose: this dialog sits over a
              page the reader was in the middle of. */}
          {/* Same colour as "Or sign in with" — both are supporting text and should read as one tier;
              full white put a boilerplate consent line at the heading's own weight. */}
          <p className="text-center text-[12px] font-normal leading-[18px]" style={{ color: SKIN.ink40 }}>
            By signing up, you agree to the{' '}
            <a className="underline" href="/onblue/terms#terms" target="_blank" rel="noopener">Terms of Use</a> and{' '}
            <a className="underline" href="/onblue/terms#privacy" target="_blank" rel="noopener">Privacy Policy</a>, including{' '}
            <a className="underline" href="/onblue/terms#cookies" target="_blank" rel="noopener">Cookie Use</a>.
          </p>
        </div>
      </>
    </div>
  )
}
