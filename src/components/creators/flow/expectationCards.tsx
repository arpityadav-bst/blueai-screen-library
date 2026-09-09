'use client'

// THE FOUR CARDS — an animated line illustration and one line of copy, in two voices.
//
// THIS IS THE PM'S LAYOUT (2026-09-10), and it changes three things at once: a fourth card, new
// copy, and a bold lead-in inside each line rather than one flat sentence. The lead is the STEP
// ("Apply.", "Set up BlueAI.") and the remainder is the condition or the consequence, so the four
// leads read on their own as the whole arc — works on your PC, apply, set up, earn — and the grey
// half is there for the reader who stops on one card.
//
// A HEADING CAME BACK WITH IT, and that is a reversal worth naming. This screen carried "Before you
// start / Three things, then you're in / Takes ten seconds" until it was stripped on 2026-09-08 for
// describing the screen instead of being it. The PM's line does something the old one did not: it
// says what the product IS before listing what it asks of you, which is the one thing a first-time
// reader does not already have. It is not the deleted header returning, it is a different job.
//
// ONE DRAWING LANGUAGE, INHERITED: the introIcons stroke style — 1.8 stroke, round caps and joins,
// no fills. A dialog that suddenly speaks a second visual language reads as a screen from another
// product. They are 34px rather than the three-card version's 40: a fourth column takes ~20px off
// each card, and an icon that does not shrink with its card stops being an icon and becomes the
// card's subject.
//
// EACH ANIMATION SHOWS ITS OWN SENTENCE, which is the only rule they follow. The monitor draws
// itself, the envelope folds shut, the arrow travels down into the tray, and the coin lands on the
// card. If a line changed, its drawing would have to.
//
// THEY PLAY ON HOVER, not on arrival. Four illustrations animating at once the moment a dialog
// opens is a fireworks display in front of a button; on hover each one answers a reader who went
// looking. Under prefers-reduced-motion every one is switched off in creators.css and the drawing simply
// sits there — the illustration is the information, its arrival is not.
//
// pathLength=1 on everything that DRAWS ITSELF, so the dash animation is written once in CSS as
// 1 -> 0 and never has to know a shape's real perimeter.

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Works on your PC: a monitor, drawing itself. */
function MonitorArt() {
  return (
    <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true" className="crx-xp-art">
      <rect x="8" y="12" width="48" height="34" rx="4" {...S} pathLength={1} className="crx-xp-draw" />
      <path d="M24 56h16" {...S} />
      <path d="M32 46v10" {...S} />
    </svg>
  )
}

/** Apply: an envelope, and its flap folding shut. */
function MailArt() {
  return (
    <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true" className="crx-xp-art">
      <rect x="7" y="15" width="50" height="34" rx="4" {...S} pathLength={1} className="crx-xp-draw" />
      {/* the flap is its own group so it can fold independently of the envelope it closes */}
      <g className="crx-xp-drop">
        <path d="M9 18 32 36 55 18" {...S} />
      </g>
    </svg>
  )
}

/** Set up: an arrow travelling down into a tray. */
function InstallArt() {
  return (
    <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true" className="crx-xp-art">
      <path d="M10 40v8a4 4 0 0 0 4 4h36a4 4 0 0 0 4-4v-8" {...S} pathLength={1} className="crx-xp-draw" />
      <g className="crx-xp-drop">
        <path d="M32 12v24" {...S} />
        <path d="M22 27 32 37l10-10" {...S} />
      </g>
    </svg>
  )
}

/** Earn: a card, and a coin landing on it. */
function PaidArt() {
  return (
    <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true" className="crx-xp-art">
      <rect x="7" y="18" width="50" height="32" rx="5" {...S} pathLength={1} className="crx-xp-draw" />
      <path d="M7 28h50" {...S} strokeOpacity="0.45" />
      <g className="crx-xp-coin">
        <circle cx="44" cy="40" r="6" {...S} strokeWidth="1.6" />
      </g>
    </svg>
  )
}

/** The line above the cards: what the product is, before what it asks of you. */
export const INTRO = 'BlueAI is an AI worker that earns for you. Here’s how it works:'

export type Card = { key: string; art: () => JSX.Element; lead: string; rest: string; full: string }

/**
 * `lead` is bold and `rest` is not; `full` is the pair as one string for the card's aria-label — a
 * screen reader should hear a sentence, not two fragments that happen to be styled apart.
 * COPY IS THE PM'S, verbatim. It replaces a set this side had already put through four rounds of
 * shortening; the figures it keeps ($30, PayPal) are the ones every other surface quotes.
 * "PC", never "Windows": the site does not say Windows.
 */
export const CARDS: readonly Card[] = [
  {
    key: 'pc',
    art: MonitorArt,
    lead: 'Works on your PC.',
    rest: 'Other devices coming soon.',
    full: 'Works on your PC. Other devices coming soon.',
  },
  {
    key: 'apply',
    art: MailArt,
    lead: 'Apply.',
    rest: 'We review and email you when you’re in.',
    full: 'Apply. We review and email you when you’re in.',
  },
  {
    key: 'setup',
    art: InstallArt,
    lead: 'Set up BlueAI.',
    rest: 'It runs campaigns you approve.',
    full: 'Set up BlueAI. It runs campaigns you approve.',
  },
  {
    key: 'earn',
    art: PaidArt,
    lead: 'Earn $30 a month,',
    rest: 'paid via PayPal.',
    full: 'Earn $30 a month, paid via PayPal.',
  },
]
