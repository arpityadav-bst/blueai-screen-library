'use client'

// THE THREE CARDS — an animated line illustration and one line of copy.
//
// ONE LINE, NO TITLE, and it took three passes to land on that. The original rows were a bold
// lead-in plus two or three lines of detail ("It lives on your PC. You install BlueAI and keep it
// running at least 20 days a month..."). Compressing that to a four-word title lost the substance;
// putting a title AND a qualifier back reproduced the original two-part shape in a 136px column,
// where a two-word heading over a three-word line is a hierarchy with nothing to be hierarchical
// about. What was actually being asked for (Appy, 2026-09-09) is the CRUX of the pair as a single
// sentence, in the detail line's voice — so that is what each card carries.
//
// EACH LINE IS FACT PLUS CONDITION, joined. Not the heading and not the caveat but the sentence a
// reader would write if they had to say the whole thing once: what it does, and the terms it does
// it on. "Runs on your PC" alone is a feature; "at least 20 days a month" alone is a rule; together
// in one line they are the deal.
//
// THE DIALOG KEPT ITS 480 (see signinSkin's CARD_WIDTH note). One line needs the width more than
// two did — at 400 each card is ~105px and these sentences wrap to five lines.
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

export type Card = { key: string; art: () => JSX.Element; line: string; full: string }

/**
 * `full` is not shown. It is the whole sentence the pair compresses, and it goes to the card's
 * aria-label — so a screen reader still gets the waitlist and the "nothing goes out unseen" that
 * the visible line had to drop. Trimming for a 136px column is a visual decision, and a visual
 * decision should not also cost a blind reader the fact.
 * EVERY FACT IS ALREADY ON THE SITE: the 20 days and the $30 via PayPal from the application's
 * intro step, the approval from card 04, the waitlist from the confirmation. Nothing new is claimed
 * here; this screen exists to have them acknowledged together, not to teach them.
 * NO UNIT NOUN anywhere — not "program", not "offer" — so all three are correct under Versions A,
 * B and C with no variant branch. "PC", never "Windows": the site does not say Windows.
 */
export const CARDS: readonly Card[] = [
  {
    key: 'pc',
    art: InstallArt,
    line: 'Runs on your PC, at least 20 days a month.',
    full: 'Runs on your PC. You install BlueAI and keep it running at least 20 days a month — a few minutes of your day.',
  },
  {
    key: 'approve',
    art: ApproveArt,
    line: 'Uses your accounts — you approve each campaign first.',
    full: 'You approve it first. It works on your platform accounts, and you approve each campaign before your worker runs it — nothing goes out unseen.',
  },
  {
    key: 'paid',
    art: PaidArt,
    line: '$30 a month via PayPal, once you are approved.',
    full: '$30 a month, via PayPal, once your application is approved. There is a waitlist, so it can take a little time.',
  },
]
