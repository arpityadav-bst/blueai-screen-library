'use client'

// THE FOUR CARDS, and their copy is NOT this file's own any more.
//
// IT IS THE THIRD FOLD'S, VERBATIM (Appy, 2026-09-10: "use the same 4 box copies in the third fold
// for the popup"). HomeBelow's STEPS array is the source: Apply / Get accepted / Deploy it /
// Collect, with its bodies unchanged. Two surfaces telling the same four-step story in two
// different sets of words is how a reader ends up counting whether they are the same four steps,
// and this dialog opens ON that page, sometimes with the section still behind it.
//
// SO THIS FILE IS A COPY, AND THAT IS A LIABILITY worth naming: edit HomeBelow's STEPS and these do
// not follow. They are not imported from there because the two render differently (that section has
// numerals and a heading per card; this has an icon and one flowing line), and because the popup
// splits each box into a bold lead and a muted remainder. If they drift, this is the file that is
// wrong.
//
// THE LEAD IS THE BOX TITLE and the remainder is its body, which is what makes the split honest
// rather than invented: the four leads read across the row as the arc (apply, get accepted, deploy,
// collect) and the grey half is there for the reader who stops on one card.
//
// ONE DRAWING LANGUAGE, INHERITED: the introIcons stroke style, 1.8 stroke, round caps and joins, no
// fills. A dialog that suddenly speaks a second visual language reads as a screen from another
// product.
//
// EACH ANIMATION SHOWS ITS OWN SENTENCE, which is the only rule they follow, and all four changed
// when the copy did: the envelope folds shut for Apply, the tick draws itself for Get accepted, the
// arrow travels into the tray for Deploy it, and the coin lands on the card for Collect. The
// monitor went with "Works on your PC", which is not one of the four boxes.
//
// THEY PLAY ON HOVER, not on arrival. Four illustrations animating at once the moment a dialog opens
// is a fireworks display in front of a button; on hover each one answers a reader who went looking.
// Under prefers-reduced-motion every one is switched off in onblue.css and the drawing simply sits
// there: the illustration is the information, its arrival is not.
//
// pathLength=1 on everything that DRAWS ITSELF, so the dash animation is written once in CSS as
// 1 -> 0 and never has to know a shape's real perimeter.

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Apply: an envelope, and its flap folding shut. */
function MailArt() {
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true" className="crx-xp-art">
      <rect x="7" y="15" width="50" height="34" rx="4" {...S} pathLength={1} className="crx-xp-draw" />
      {/* the flap is its own group so it can fold independently of the envelope it closes */}
      <g className="crx-xp-drop">
        <path d="M9 18 32 36 55 18" {...S} />
      </g>
    </svg>
  )
}

/** Get accepted: a reply, with a tick drawing itself across it. */
function AcceptArt() {
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true" className="crx-xp-art">
      <rect x="9" y="14" width="46" height="32" rx="5" {...S} pathLength={1} className="crx-xp-draw" />
      <path d="M20 54h24" {...S} strokeOpacity="0.45" />
      <path d="M21 26.5 29 34.5 43 20.5" {...S} strokeWidth="2.4" pathLength={1} className="crx-xp-tick" />
    </svg>
  )
}

/** Deploy it: an arrow travelling down into a tray. */
function InstallArt() {
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true" className="crx-xp-art">
      <path d="M10 40v8a4 4 0 0 0 4 4h36a4 4 0 0 0 4-4v-8" {...S} pathLength={1} className="crx-xp-draw" />
      <g className="crx-xp-drop">
        <path d="M32 12v24" {...S} />
        <path d="M22 27 32 37l10-10" {...S} />
      </g>
    </svg>
  )
}

/** Collect: a card, and a coin landing on it. */
function PaidArt() {
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true" className="crx-xp-art">
      <rect x="7" y="18" width="50" height="32" rx="5" {...S} pathLength={1} className="crx-xp-draw" />
      <path d="M7 28h50" {...S} strokeOpacity="0.45" />
      <g className="crx-xp-coin">
        <circle cx="44" cy="40" r="6" {...S} strokeWidth="1.6" />
      </g>
    </svg>
  )
}

/** The line above the cards: what the product is, before what it asks of you.
 *  TWO STRINGS, NOT ONE WITH A BREAK IN IT (Appy, 2026-09-10: "in two lines"). The split is
 *  the sentence boundary, so it is the copy's own break rather than one placed to balance a
 *  measure: line one says what the product is, line two hands over to the cards. Keeping them
 *  as separate strings means the break cannot land mid-sentence when the copy is edited. */
export const INTRO = [
  'onBlue is an AI worker that earns for you.',
  'Here’s how it works:',
] as const

/** `n` is a SINGLE DIGIT here, not the third fold's 01-04 (Appy, 2026-09-10: "1, 2, 3, 4 on the
 *  top right, very subtle"). The two-digit form existed to keep four inline leads aligned; in the
 *  corner nothing follows it, so the leading zero is just an extra mark competing with the words. */
export type Card = { key: string; n: string; art: () => JSX.Element; lead: string; rest: string; full: string }

/**
 * `lead` is the third fold's box TITLE and `rest` is its BODY, unchanged. `full` is the pair as one
 * string for the card's aria-label: a screen reader should hear a sentence, not two fragments that
 * happen to be styled apart.
 * THE $30 CARRIES AN ASTERISK (Appy, 2026-09-10: "that can change"), AND NOTHING NOW EXPLAINS IT.
 * The footnote under the row was removed the same day ("we can just remove the line"); the mark was
 * kept because it was asked for separately and "rest is fine". So this is a deliberate orphan: it
 * reads as a soft qualifier on the figure without spending a line saying so. If it ever looks like
 * an error rather than a hedge, the mark is what goes, not a note coming back.
 */
export const CARDS: readonly Card[] = [
  {
    key: 'apply',
    n: '1',
    art: MailArt,
    lead: 'Apply.',
    rest: 'Tell us about yourself and the PC it will run on.',
    full: 'Step 1. Apply. Tell us about yourself and the PC it will run on.',
  },
  {
    key: 'accepted',
    n: '2',
    art: AcceptArt,
    lead: 'Get accepted.',
    rest: 'We review every application and email you when your worker is ready.',
    full: 'Step 2. Get accepted. We review every application and email you when your worker is ready.',
  },
  {
    key: 'deploy',
    n: '3',
    art: InstallArt,
    lead: 'Deploy it.',
    rest: "Install onBlue on your PC and sign in. That's the whole setup.",
    full: "Step 3. Deploy it. Install onBlue on your PC and sign in. That's the whole setup.",
  },
  {
    key: 'collect',
    n: '4',
    art: PaidArt,
    lead: 'Collect.',
    rest: 'You approve each campaign, your worker completes it, and you collect $30* every month via PayPal.',
    full: 'Step 4. Collect. You approve each campaign, your worker completes it, and you collect $30 every month via PayPal. The monthly amount can change.',
  },
]
