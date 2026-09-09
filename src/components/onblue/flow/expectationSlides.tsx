'use client'

// THE THREE SLIDES — each an animated line illustration, a title and a body.
//
// ONE DRAWING LANGUAGE, INHERITED. These are the introIcons stroke style scaled up: 1.8 stroke,
// round caps and joins, no fills except where a shape has to read as solid. They are bigger (56 vs
// 18) because they lead a card now instead of labelling a row, but they are deliberately not
// illustrations in a different style — a dialog that suddenly speaks a second visual language reads
// as a screen from another product.
//
// EACH ANIMATION SHOWS THE SENTENCE, and that is the only rule they follow. Not decoration attached
// to an icon: the arrow travels DOWN INTO the monitor because the line says you install it there,
// the tick DRAWS ITSELF because the line says you approve each campaign, and the coin FALLS INTO
// the wallet because the line says you get paid. If the copy changed, these would have to.
//
// THEY PLAY ONCE, on activation, and then rest. The carousel dwells 5s per slide; a looping
// animation would spend 3.5 of those seconds asking for attention the reader has already given.
// The `.on` class the carousel adds is what starts them, so nothing animates off-screen.
// Under prefers-reduced-motion every one of them is switched off in onblue.css and the drawing
// simply appears — the illustration is information, its arrival is not.

// pathLength=1 on everything that DRAWS ITSELF, so the dash animation is written once in CSS as
// 1 -> 0 and never has to know a shape's real perimeter. Without it every drawn shape needs its
// own dasharray, and every edit to a rect's size silently breaks its own animation.
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Install: an arrow travels down into a monitor. */
function InstallArt() {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" className="crx-xp-art">
      <rect x="8" y="12" width="48" height="34" rx="4" {...S} pathLength={1} className="crx-xp-draw" />
      <path d="M24 56h16" {...S} />
      <path d="M32 46v10" {...S} />
      {/* the arrow is its own group so it can travel independently of the frame it lands in */}
      <g className="crx-xp-drop">
        <path d="M32 20v12" {...S} />
        <path d="M26.5 27.5 32 33l5.5-5.5" {...S} />
      </g>
    </svg>
  )
}

/** Approve: a post, and a tick that draws itself across it. */
function ApproveArt() {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" className="crx-xp-art">
      <rect x="9" y="14" width="46" height="32" rx="5" {...S} pathLength={1} className="crx-xp-draw" />
      <path d="M20 54h24" {...S} strokeOpacity="0.45" />
      <path d="M21 26.5 29 34.5 43 20.5" {...S} strokeWidth="2.4" pathLength={1} className="crx-xp-tick" />
    </svg>
  )
}

/** Paid: a coin falls into a wallet. */
function PaidArt() {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" className="crx-xp-art">
      <g className="crx-xp-coin">
        <circle cx="32" cy="16" r="7" {...S} />
        <path d="M32 12.5v7" {...S} strokeWidth="1.6" />
      </g>
      <path d="M10 30h44a3 3 0 0 1 3 3v17a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4V34a4 4 0 0 1 4-4Z" {...S} pathLength={1} className="crx-xp-draw" />
      <path d="M57 39h-9a4 4 0 0 0 0 8h9" {...S} />
    </svg>
  )
}

export type Slide = { key: string; art: () => JSX.Element; title: string; body: string }

/**
 * The copy is the three rows this screen replaced, unchanged in substance — every fact still
 * sourced from elsewhere on the site (the 20 days and the $30 via PayPal from the application's
 * intro step, approval from card 04, the waitlist from the confirmation). Split into a title and a
 * body now that each has a card to itself: the bold half was already doing a title's job when the
 * three sat in a list.
 * NO UNIT NOUN anywhere — not "program", not "offer" — so all three are correct under Versions A,
 * B and C with no variant branch. "PC", never "Windows": the site does not say Windows.
 */
export const SLIDES: readonly Slide[] = [
  {
    key: 'pc',
    art: InstallArt,
    title: 'It lives on your PC.',
    body: 'You install onBlue and keep it running at least 20 days a month, which is a few minutes of your day.',
  },
  {
    key: 'accounts',
    art: ApproveArt,
    title: 'It works on your platform accounts.',
    body: 'You approve each campaign before your worker runs it. Nothing goes out unseen.',
  },
  {
    key: 'paid',
    art: PaidArt,
    title: 'You get $30 a month, via PayPal.',
    body: 'Once your application is approved. There is a waitlist, so it can take a little time.',
  },
]

/**
 * The phone variant of slide one. Read after mount and swapped in by the carousel — the server
 * cannot know the platform, and a mismatch is a hydration error. A hint, never a gate: the sentence
 * changes, the path does not. Nothing is said about Macs, because the site itself only says "PC".
 */
export const PHONE_SLIDE: Slide = {
  key: 'pc',
  art: InstallArt,
  title: 'It lives on a PC.',
  body: 'You are on a phone right now, which is fine for applying. onBlue itself runs on a PC, and you will set it up there.',
}
