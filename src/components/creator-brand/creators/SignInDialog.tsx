'use client'

import { useApply } from './ApplyState'

// The now.gg sign-in card, rebuilt from the real page's own computed styles and assets.
//
// SCRAPED, NOT EYEBALLED (2026-08-13, designer authority — "its mine only"). Every number below came
// off now.gg/accounts/auth/v1/identifier via getComputedStyle at the card's real 360px width, and the
// logos and provider icons are the actual files from cdn.now.gg, saved under
// public/creator-brand/nowgg-signin/. The previous version of this file was a likeness built from a
// screenshot and it was wrong in ways a screenshot cannot show: the typeface is POPPINS (not this
// site's Inter/Space Grotesk), the card is a dark panel with a 0.8px
// #7B4CFF ring — not the warm brown it looked like — and the header is TWO translucent gradient wave
// SVGs layered over that glass rather than a solid gradient strip.
//
// The measured spec, so nobody has to re-scrape to check a value:
//   card        360px wide · radius 12 · 0.8px solid #7B4CFF · overflow hidden. Ours is a SOLID
//               dark grey with NO backdrop blur (scraped: translucent black + blur) — see CARD_BG.
//   waves       360x135 @ opacity .4 and 360x123 @ opacity .5, both #7B4CFF -> #0EA4C5, second
//               reversed · header block 110px tall, 16px below it
//   "One account for"   Poppins 12/18 · 400 · #fff · padding 16 0 8
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
// 70% BLACK, NO BLUR (designer, 2026-08-13). This landed after a detour worth recording, because the
// detour is the lesson.
//
// The scrape's card is glass: rgba(0,0,0,0.7) over rgba(0,0,0,0.2) with backdrop-blur(32px). Chasing
// that here meant the blur had to be visible, and it wasn't — Modal's shared scrim (58% + its own
// 3px blur) sits between this card and the page, and a backdrop-filter can only reveal what is behind
// it. The fix on offer was to lighten the scrim for this one dialog. It worked, and it was the wrong
// trade: the overlay belongs to the SITE, so a creators dialog dimming the page differently from a
// brands dialog breaks a consistency a visitor feels without naming. The blur went instead.
//
// At 70% opaque the card doesn't need one. The density that made the blur pointless is the same
// density that makes it unnecessary — and 0.7 is the scraped outer value, so this is closer to the
// real card than the 40% it replaced, not further from it.
// SOLID dark grey (designer, 2026-08-13) — not a translucent black. Every previous value here was an
// alpha over whatever happened to be behind the dialog, which meant the card's read changed with the
// page under it; a solid surface is the same card every time. It also ends the blur/scrim thread for
// good: there is nothing to see through, so nothing to blur and no reason to touch the shared overlay.
const CARD_BG = '#1F1F23'
const RING = '#7B4CFF'
const CTA = 'linear-gradient(270deg, #7B4CFF 0%, #0EA4C5 99.48%)'
const A = '/creator-brand/nowgg-signin'

const PROVIDERS = [
  { id: 'apple', icon: `${A}/apple_dark.png`, bg: 'rgba(255,255,255,0.9)', w: 21, h: 20 },
  { id: 'discord', icon: `${A}/discord_light.png`, bg: '#8061FF', w: 20, h: 20 },
  { id: 'google', icon: `${A}/google_light.png`, bg: 'rgba(255,255,255,0.9)', w: 20, h: 20 },
  { id: 'facebook', icon: `${A}/facebook_light.png`, bg: '#2178FA', w: 20, h: 20 },
]

export default function SignInDialog({ onClose }: { onClose: () => void }) {
  const { signIn } = useApply()

  // After signing in, the page's top section swaps the marketing hero for the application
  // (CreatorsTop.tsx), so the scroll has to wait for that render — hence the double rAF. One frame is
  // not enough: the first fires before React has committed the swap, so #apply doesn't exist yet and
  // scrollIntoView silently no-ops. It matters most from the closing band, where the reader is at the
  // bottom of the page and the form is now at the top.
  function go() {
    signIn()
    onClose()
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }),
    )
  }

  return (
    // Poppins is set here rather than in a Tailwind token: it exists on this page for this one card,
    // and adding it to the theme would invite it onto surfaces that are on Inter by design.
    <div
      style={{
        background: CARD_BG,
        border: `0.8px solid ${RING}`,
        fontFamily: "'Poppins', sans-serif",
      }}
      className="relative flex flex-col overflow-hidden rounded-[12px] text-white"
    >
      <>
        {/* HEADER — 110px, and the waves are absolutely positioned so they bleed past it exactly as
            they do on the real card (both SVGs are taller than the header and start above y=0). */}
        {/* HEIGHT IS THE TALLER WAVE'S HEIGHT, and that is the derivation, not a nudge. I removed the
            fixed height last round reading "space from the waves" as too MUCH space; it was the
            opposite — with the header collapsed to its ~80px of content, "Login or Sign up" rode up
            into the wave and merged with it.
            The waves are 135px and 123px SVGs whose bottom curves run to roughly y=96-135 depending
            on x, so any header shorter than 135 lets the heading overlap them somewhere across the
            card's width. Matching the taller SVG makes the clearance structural rather than tuned:
            content can never collide with a wave, and the body's own 16px gap below is then real
            separation instead of the last 16px of an overlap. Re-derive from Waves() if either SVG's
            height changes. */}
        <div className="relative h-[135px] shrink-0">
          <Waves />
          <div className="relative">
            <h3 className="pb-2 pt-4 text-center text-[12px] font-normal leading-[18px]">One account for</h3>
            <div className="flex items-center justify-center gap-[18px]">
              <span className="flex items-center gap-[10.84px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${A}/bluestacks-mark.svg`} alt="" width={42} height={38} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${A}/bluestacks-wordmark.svg`} alt="BlueStacks" width={75} height={13} />
              </span>
              <span
                className="h-[35px] w-px shrink-0"
                style={{ backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50.1%, rgba(255,255,255,0) 100%)' }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${A}/nowgg-logo.svg`} alt="now.gg" width={122} height={37} />
            </div>
          </div>
        </div>

        {/* BODY — 24px horizontal padding (the real card's 358.4 outer vs 310.4 content), 16px between
            blocks. pb is ours: the real page has a taller viewport below the legal line. */}
        <div className="flex flex-col gap-4 px-6 pb-6">
          <div>
            <h3 className="text-center text-[20px] font-semibold leading-[30px]">Login or Sign up</h3>
            <h3 className="mt-2 text-center text-[14px] font-normal leading-[21px] opacity-90" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Save your progress &amp; earn rewards
            </h3>
          </div>

          {/* 4px between the label and its field — the real .form-field gap. */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase leading-[14.4px] tracking-[1.5px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Email
            </span>
            {/* THE BORDER MOVED OUT OF `style` — that is the actual bug behind "hover/focus not
                present". An inline style beats any class, so the rest border was overriding every
                `hover:`/`focus:` variant silently: the states were written and could never win.
                Everything visual is a class now, so the variants apply.
                Rest is the scraped 0.8px rgba(255,255,255,.5) on rgba(0,0,0,.2). Hover lifts the
                border only — a hover that also moves the fill reads as a press. Focus goes to the
                card's own #7B4CFF with a soft ring outside it, which is why `outline-none` is safe
                here: the ring replaces the outline rather than deleting it. */}
            <input
              type="email"
              inputMode="email"
              autoComplete="off"
              placeholder="abc@xyz.com"
              className="w-full rounded-[8px] border-[0.8px] border-white/50 bg-black/20 px-4 py-2 text-[14px] font-normal leading-[21px] text-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] outline-none transition-[border-color,box-shadow] duration-base ease-out-bai placeholder:text-white/40 hover:border-white/80 focus:border-[#7B4CFF] focus:shadow-[0_0_0_3px_rgba(123,76,255,0.25)]"
            />
          </div>

          <button
            type="button"
            onClick={go}
            // h-[41px] is the MEASURED height, not padding maths. Rendering the scraped `padding:
            // 6px 24px` against a 21px line box gives 33px — 8px short — so the real control is
            // getting its height from somewhere the padding alone doesn't express. Setting the
            // measured height and centring the label is the honest way to land on it.
            // Colour is #fff explicitly rather than `text-white`, so nothing in this card's inherited
            // colour chain can tint the label.
            style={{ background: CTA, color: '#fff' }}
            className="flex h-[41px] w-full items-center justify-center rounded-[8px] px-6 text-[14px] font-semibold leading-[21px] transition-transform duration-base ease-out-bai hover:-translate-y-0.5 active:translate-y-0"
          >
            Continue
          </button>

          <div className="flex flex-row items-center justify-center gap-4">
            <span className="h-px flex-auto bg-white/20" />
            <span className="flex-none text-[14px] font-normal leading-[14px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Or sign in with
            </span>
            <span className="h-px flex-auto bg-white/20" />
          </div>

          <div className="flex flex-row justify-center gap-4">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={go}
                aria-label={`Continue with ${p.id}`}
                style={{ background: p.bg }}
                className="flex h-10 flex-auto items-center justify-center rounded-[8px] px-6 transition-transform duration-base ease-out-bai hover:-translate-y-0.5 active:translate-y-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.icon} alt="" width={p.w} height={p.h} className="shrink-0" />
              </button>
            ))}
          </div>

          {/* Underlined and white like the real page, but NOT anchors — they have no destination in
              this replica, and an <a> with no href is a keyboard trap wearing a link's clothes. */}
          {/* Same colour as "Or sign in with" — rgba(255,255,255,.4). It was full white, which put a
              boilerplate consent line at the same weight as the heading and made it the second
              loudest thing on the card. Both are supporting text and should read as one tier. */}
          <p className="text-center text-[12px] font-normal leading-[18px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            By signing up, you agree to the <u>Terms of Use</u> and <u>Privacy Policy</u>, including{' '}
            <u>Cookie Use</u>.
          </p>
          <p className="text-center text-[10.5px] leading-snug text-white/30">
            Prototype. No account is created and nothing is sent.
          </p>
        </div>
      </>
    </div>
  )
}

/**
 * The header's two gradient waves, copied path-for-path from the real card's inline SVGs (the
 * portrait pair; the page also ships a landscape pair we don't use at this width). Both are wider and
 * taller than the 360px header and start above its top edge, which is what makes the crest sit where
 * it does — so they are absolutely positioned at top-0 and allowed to overflow, not scaled to fit.
 */
function Waves() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="360" height="135" viewBox="0 0 360 135" fill="none" className="absolute left-0 top-0">
        <path
          opacity="0.4"
          d="M237.886 105.464C363.827 91.9235 407.104 113.841 413 126.492V-12.5H-41V126.492C31.5221 147.52 80.4597 122.389 237.886 105.464Z"
          fill="url(#cbNowggWaveA)"
        />
        <defs>
          <linearGradient id="cbNowggWaveA" x1="-41" y1="60.9999" x2="413" y2="60.9999" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7B4CFF" />
            <stop offset="0.994792" stopColor="#0EA4C5" />
          </linearGradient>
        </defs>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="360" height="123" viewBox="0 0 360 123" fill="none" className="absolute left-0 top-0">
        <path
          opacity="0.5"
          d="M136.8 95.834C31.9418 83.3991 -4.09091 103.527 -9 115.146V-12.5H369V115.146C308.618 134.457 267.873 111.378 136.8 95.834Z"
          fill="url(#cbNowggWaveB)"
        />
        <defs>
          <linearGradient id="cbNowggWaveB" x1="369" y1="54.9999" x2="-9" y2="54.9999" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7B4CFF" />
            <stop offset="0.994792" stopColor="#0EA4C5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
