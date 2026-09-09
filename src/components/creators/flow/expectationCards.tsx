'use client'

// THE THREE CARDS — an animated line illustration and a title, and nothing else.
//
// TITLE ONLY (Appy, 2026-09-09: "we will only have the title and the icon in a card"). The onBlue
// fork carries the same three points as a timed carousel with a title AND a body; here all three
// stand side by side, which buys the reader the whole picture at a glance and costs them the detail
// line. That trade is the instruction, and it is survivable for one reason: none of these three
// facts is NEW at this point in the flow — the homepage said all of them, and the application
// restates the ones with numbers in them. This screen exists to have them acknowledged together,
// not to teach them.
//
// SO THE TITLES CARRY THE CONSTRAINT, not the topic. "Your PC" is a subject; "Runs on your PC" is
// the thing being agreed to. Three or four words each, because at 400px a row of three cards gives
// each of them about 100px and a fifth word starts a third line — which is also why the numbers
// that survive are the ones short enough to stay on their own line.
//
// ONE DRAWING LANGUAGE, INHERITED: the introIcons stroke style scaled up — 1.8 stroke, round caps
// and joins, no fills. A dialog that suddenly speaks a second visual language reads as a screen
// from another product.
//
// EACH ANIMATION SHOWS ITS OWN SENTENCE, which is the only rule they follow. The arrow travels DOWN
// INTO the monitor because the line says it runs there, the tick DRAWS ITSELF because the line says
// you approve it, and the coin FALLS INTO the wallet because the line says you get paid. If a title
// changed, its drawing would have to.
//
// THEY PLAY ON HOVER (Appy: "hover over them the animation will happen), not on arrival. Three
// illustrations animating at once the moment a dialog opens is a fireworks display in front of a
// button; on hover each one answers a reader who went looking. Under prefers-reduced-motion every
// one is switched off in creators.css and the drawing simply sits there — the illustration is the
// information, its arrival is not.
//
// pathLength=1 on everything that DRAWS ITSELF, so the dash animation is written once in CSS as
// 1 -> 0 and never has to know a shape's real perimeter. Without it every drawn shape needs its own
// dasharray, and every edit to a rect's size silently breaks its own animation.

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Runs on your PC: an arrow travels down into a monitor. */
function InstallArt() {
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true" className="crx-xp-art">
      <rect x="8" y="12" width="48" height="34" rx="4" {...S} pathLength={1} className="crx-xp-draw" />
      <path d="M24 56h16" {...S} />
      <path d="M32 46v10" {...S} />
      {/* its own group, so the arrow can travel independently of the frame it lands in */}
      <g className="crx-xp-drop">
        <path d="M32 20v12" {...S} />
        <path d="M26.5 27.5 32 33l5.5-5.5" {...S} />
      </g>
    </svg>
  )
}

/** You approve it first: a post, and a tick that draws itself across it. */
function ApproveArt() {
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true" className="crx-xp-art">
      <rect x="9" y="14" width="46" height="32" rx="5" {...S} pathLength={1} className="crx-xp-draw" />
      <path d="M20 54h24" {...S} strokeOpacity="0.45" />
      <path d="M21 26.5 29 34.5 43 20.5" {...S} strokeWidth="2.4" pathLength={1} className="crx-xp-tick" />
    </svg>
  )
}

/** $30 a month: a coin falls into a wallet. */
function PaidArt() {
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true" className="crx-xp-art">
      <g className="crx-xp-coin">
        <circle cx="32" cy="16" r="7" {...S} />
        <path d="M32 12.5v7" {...S} strokeWidth="1.6" />
      </g>
      <path d="M10 30h44a3 3 0 0 1 3 3v17a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4V34a4 4 0 0 1 4-4Z" {...S} pathLength={1} className="crx-xp-draw" />
      <path d="M57 39h-9a4 4 0 0 0 0 8h9" {...S} />
    </svg>
  )
}

export type Card = { key: string; art: () => JSX.Element; title: string; full: string }

/**
 * `full` is not shown. It is the sentence the title compresses, and it goes to the card's
 * aria-label: a screen reader gets "Runs on your PC. You install onBlue and keep it running at
 * least 20 days a month." where the eye gets four words. Losing the detail was a visual decision
 * about a 100px column, and a visual decision should not also cost a blind reader the fact.
 * NO UNIT NOUN anywhere — not "program", not "offer" — so all three are correct under Versions A,
 * B and C with no variant branch. "PC", never "Windows": the site does not say Windows.
 */
export const CARDS: readonly Card[] = [
  {
    key: 'pc',
    art: InstallArt,
    title: 'Runs on your PC',
    full: 'Runs on your PC. You install BlueAI and keep it running at least 20 days a month.',
  },
  {
    key: 'approve',
    art: ApproveArt,
    title: 'You approve it first',
    full: 'You approve it first. It works on your platform accounts, and nothing goes out unseen.',
  },
  {
    key: 'paid',
    art: PaidArt,
    title: '$30 a month',
    full: '$30 a month, via PayPal, once your application is approved. There is a waitlist.',
  },
]
