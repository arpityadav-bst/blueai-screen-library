'use client'

import { useCrx } from './CrxState'

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
//   providers   row gap 16 · each 68x40 · radius 8 · padding 10 24 · Apple/Google rgba(255,255,255,.9),
//               Discord #8061FF, Facebook #2178FA
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
// THE CARD IS NO LONGER A STRICT REPLICA (Appy, 2026-09-02: "convert this into the light theme").
// Everything above still describes the real now.gg card, and it is kept as the record this file was
// transcribed from - but the surface, the ink and the field now follow the page's theme. That is a
// deliberate divergence: a dark auth card was the last dark surface on a light page, and matching
// the product it lives in beats matching the page it was copied from.
//
// A PALETTE OBJECT RATHER THAN CSS TOKENS. This component paints with inline styles and Tailwind
// utilities, not the .crx kit, so var(--sur) would resolve to nothing on most of these and CSS
// overrides would be fighting utility specificity. Two literal sets, chosen from the same DS values
// the light block uses, is the honest shape for a component built this way.
const SKIN = {
  dark: {
    card: '#1F1F23',
    ink: '#fff',
    ink70: 'rgba(255,255,255,0.7)',   // sub-heading
    ink80: 'rgba(255,255,255,0.8)',   // field label
    ink40: 'rgba(255,255,255,0.4)',   // separator + legal
    ink60: 'rgba(255,255,255,0.6)',   // the prototype line
    rule: 'rgba(255,255,255,0.2)',    // the hairlines either side of "Or sign in with"
    tileLine: 'transparent',          // the white provider tiles need no edge on a dark card
    field:
      'border-white/50 bg-black/20 text-white placeholder:text-white/40 hover:border-white/80' +
      ' focus:border-[#7B4CFF] focus:shadow-[0_0_0_3px_rgba(123,76,255,0.25)]',
  },
  light: {
    card: '#ffffff',
    ink: 'rgb(8,10,31)',
    ink70: 'rgb(55,58,88)',
    ink80: 'rgb(43,46,76)',
    ink40: 'rgb(106,110,136)',
    ink60: 'rgb(106,110,136)',
    rule: 'rgb(223,228,238)',
    // On white, the Apple and Google tiles ARE white - without an edge they are two invisible
    // buttons in a row of four. Discord and Facebook keep their brand fills and ignore this.
    tileLine: 'rgb(223,228,238)',
    field:
      'border-[#cdd4e2] bg-white text-[rgb(8,10,31)] placeholder:text-[rgb(106,110,136)] hover:border-[#7B4CFF]' +
      ' focus:border-[#7B4CFF] focus:shadow-[0_0_0_3px_rgba(123,76,255,0.18)]',
  },
} as const

const RING = '#7B4CFF'
const CTA = 'linear-gradient(270deg, #7B4CFF 0%, #0EA4C5 99.48%)'
const A = '/creator-brand/nowgg-signin'

const PROVIDERS = [
  { id: 'apple', icon: `${A}/apple_dark.png`, bg: 'rgba(255,255,255,0.9)', w: 21, h: 20 },
  { id: 'discord', icon: `${A}/discord_light.png`, bg: '#8061FF', w: 20, h: 20, brand: true },
  { id: 'google', icon: `${A}/google_light.png`, bg: 'rgba(255,255,255,0.9)', w: 20, h: 20 },
  { id: 'facebook', icon: `${A}/facebook_light.png`, bg: '#2178FA', w: 20, h: 20, brand: true },
]

export default function SignInDialog({ onClose }: { onClose: () => void }) {
  const { signIn, theme } = useCrx()
  const skin = SKIN[theme]

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
    // Poppins is set here rather than in a Tailwind token: it exists on this page for this one card,
    // and adding it to the theme would invite it onto surfaces that are on Inter by design.
    // w-full max-w-[360px]: the frozen Modal's SIZES.xs — 360 is the card's MEASURED width; every
    // type size, padding and control height here was scraped at it, so changing it rescales a
    // replica that is supposed to be exact.
    <div
      style={{
        background: skin.card,
        color: skin.ink,
        border: `0.8px solid ${RING}`,
        fontFamily: "'Poppins', sans-serif",
      }}
      className="relative flex w-full max-w-[360px] flex-col overflow-hidden rounded-[12px]"
    >
      <>
        {/* HEADER — the waves are absolutely positioned so they bleed past it exactly as they do on
            the real card (both SVGs are taller than the header and start above y=0). */}
        {/* NO BRANDING IN THE BAND (Appy, 2026-09-02): the "One account for" line and the
            BlueStacks / now.gg lockup are gone, and the card opens on "Login or Sign up".
            THE HEIGHT DERIVATION CHANGED WITH THEM. It used to be 135px because that is the taller
            wave's height, and anything shorter let the heading collide with a wave crest somewhere
            across the card's width - the clearance was structural because there was content sitting
            in the band. With the band empty there is nothing left to clear, so its height is now
            purely how much wave you want to see, and 56 is that.
            The waves come down to match (Waves(), 56/51 from 135/123, the same 1.1:1 ratio). Both
            SVGs are preserveAspectRatio="none", so this FLATTENS the curve rather than cropping it
            - the crest still lands at the same fractions of the width, just shallower. */}
        <div className="relative h-[56px] shrink-0">
          <Waves />
        </div>

        {/* BODY — 24px horizontal padding (the real card's 358.4 outer vs 310.4 content), 16px between
            blocks. pb is ours: the real page has a taller viewport below the legal line. */}
        <div className="flex flex-col gap-4 px-6 pb-6">
          <div>
            <h3 className="text-center text-[20px] font-semibold leading-[30px]">Login or Sign up</h3>
            <h3 className="mt-2 text-center text-[14px] font-normal leading-[21px] opacity-90" style={{ color: skin.ink70 }}>
              Save your progress &amp; earn rewards
            </h3>
          </div>

          {/* 4px between the label and its field — the real .form-field gap. */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase leading-[14.4px] tracking-[1.5px]" style={{ color: skin.ink80 }}>
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
              className={`w-full rounded-[8px] border-[0.8px] px-4 py-2 text-[16px] font-normal leading-[21px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] outline-none transition-[border-color,box-shadow] duration-base ease-out-bai sm:text-[14px] ${skin.field}`}
            />
          </div>

          <button
            type="button"
            onClick={go}
            // h-[41px] is the MEASURED height, not padding maths: the scraped `padding: 6px 24px`
            // against a 21px line box gives 33px — 8px short. Colour is #fff explicitly so nothing
            // in this card's inherited colour chain can tint the label.
            style={{ background: CTA, color: '#fff' }}
            className="flex h-[41px] w-full items-center justify-center rounded-[8px] px-6 text-[14px] font-semibold leading-[21px] transition-transform duration-base ease-out-bai hover:-translate-y-0.5 active:translate-y-0"
          >
            Continue
          </button>

          <div className="flex flex-row items-center justify-center gap-4">
            <span className="h-px flex-auto" style={{ background: skin.rule }} />
            <span className="flex-none text-[14px] font-normal leading-[14px]" style={{ color: skin.ink40 }}>
              Or sign in with
            </span>
            <span className="h-px flex-auto" style={{ background: skin.rule }} />
          </div>

          {/* gap-2 below sm. MEASURED: each button floors at ~68px (20px icon + px-6), so four plus
              three 16px gaps need 316px against 236px of usable width at a 320px viewport. Tighter
              padding and gap on small screens drops the floor to ~36px each and the row fits. */}
          <div className="flex flex-row justify-center gap-2 sm:gap-4">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={go}
                aria-label={`Continue with ${p.id}`}
                style={{ background: p.bg, border: `1px solid ${'brand' in p ? 'transparent' : skin.tileLine}` }}
                className="flex h-11 min-w-0 flex-auto items-center justify-center rounded-[8px] px-2 transition-transform duration-base ease-out-bai hover:-translate-y-0.5 active:translate-y-0 sm:px-6"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.icon} alt="" width={p.w} height={p.h} className="shrink-0" />
              </button>
            ))}
          </div>

          {/* REAL ANCHORS since 2026-08-31 — the legal page exists now (/creators/terms, tabbed),
              so the underlines stopped being costume. New tab on purpose: this dialog sits over a
              page the reader was in the middle of. */}
          {/* Same colour as "Or sign in with" — both are supporting text and should read as one tier;
              full white put a boilerplate consent line at the heading's own weight. */}
          <p className="text-center text-[12px] font-normal leading-[18px]" style={{ color: skin.ink40 }}>
            By signing up, you agree to the{' '}
            <a className="underline" href="/creators/terms#terms" target="_blank" rel="noopener">Terms of Use</a> and{' '}
            <a className="underline" href="/creators/terms#privacy" target="_blank" rel="noopener">Privacy Policy</a>, including{' '}
            <a className="underline" href="/creators/terms#cookies" target="_blank" rel="noopener">Cookie Use</a>.
          </p>
          <p className="text-center text-[10.5px] leading-snug" style={{ color: skin.ink60 }}>
            Prototype. No account is created and nothing is sent.
          </p>
        </div>
      </>
    </div>
  )
}

/**
 * The header's two gradient waves, copied path-for-path from the real card's inline SVGs (the
 * portrait pair; the page also ships a landscape pair we don't use at this width).
 *
 * w-full + preserveAspectRatio="none", NOT the scraped width="360": at a 360px viewport the card is
 * 353px and at 320 it is 284, so a hard-coded 360 wave was 71px too wide inside its own card —
 * measured — and the overflow-hidden simply cropped the crest off-centre. The wave now always spans
 * exactly the card it sits in. Non-uniform scaling is safe HERE and would not be for most art:
 * these are two gentle curves with no circles, text or corner radii, so stretching horizontally is
 * imperceptible. Height stays pinned so the header's 135px still clears the crest at every width.
 */
function Waves() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 135" fill="none" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[56px] w-full">
        <path
          opacity="0.4"
          d="M237.886 105.464C363.827 91.9235 407.104 113.841 413 126.492V-12.5H-41V126.492C31.5221 147.52 80.4597 122.389 237.886 105.464Z"
          fill="url(#crxNowggWaveA)"
        />
        <defs>
          <linearGradient id="crxNowggWaveA" x1="-41" y1="60.9999" x2="413" y2="60.9999" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7B4CFF" />
            <stop offset="0.994792" stopColor="#0EA4C5" />
          </linearGradient>
        </defs>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 123" fill="none" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[51px] w-full">
        <path
          opacity="0.5"
          d="M136.8 95.834C31.9418 83.3991 -4.09091 103.527 -9 115.146V-12.5H369V115.146C308.618 134.457 267.873 111.378 136.8 95.834Z"
          fill="url(#crxNowggWaveB)"
        />
        <defs>
          <linearGradient id="crxNowggWaveB" x1="369" y1="54.9999" x2="-9" y2="54.9999" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7B4CFF" />
            <stop offset="0.994792" stopColor="#0EA4C5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
