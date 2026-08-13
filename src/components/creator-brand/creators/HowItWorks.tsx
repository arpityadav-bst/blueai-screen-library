import StepCards, { type Step } from '../StepCards'

// FOUR steps now, not three, and the copy is the PM's own (2026-08-13): Apply → Get selected → Set up
// BlueAI → Earn. That replaces a three-card set describing a per-job loop (accept a job → BlueAI
// handles it → get paid, on repeat) which the current model no longer has — this is a program you
// apply to once, not a queue you pick from.
//
// ART: the v3 set, delivered 2026-08-13, one file per step and named to these steps. It replaced both
// the placeholder panels this file briefly rendered AND the v2 set, which drew the engagement
// mechanics as labelled icons (an eye, a heart, a speech bubble, a repost arrow) — the reason the
// brief ruled it out. Checked before wiring: v3 draws none of those, and carries no baked text, no
// numbers and no logos, which is the other standing rule for this art.
//
// WebP q90, not the supplied PNGs: 7.24 MB -> 0.494 MB across the four, at 40.8-42.3 dB PSNR (above
// ~40 dB is visually indistinguishable on smooth gradient art like this). The PNG originals are
// preserved outside the repo, so this is one path edit to reverse.
//
// Backgrounds measured before use, per this project's rule about not reaching for a blend mode until
// you have: all four sit 7.0-8.4 units below the card's white at the top edge, within 1.4 units of
// each other. Full-bleed against the card's own edge with the existing hairline under them, so that
// tone reads as the media panel's — there is no inset box to betray it and nothing to correct.
//
// COPY LENGTHS ARE THE PM'S, UNBALANCED ON PURPOSE. This project's convention is that sibling bodies
// sit within ~10 characters of each other so they wrap to the same line count; these run 65 / 57 / 95
// / 107, so cards 1 and 2 will show some dead space below their bodies where 3 and 4 fill it. Left
// exactly as written rather than quietly trimmed or padded — the words are the PM's to change, and a
// balanced variant is offered separately.
//
// The only edits made to the given strings: a full stop on step 1 (the other three have one), and the
// last two words of each body joined by a literal non-breaking space so no body ends on a stranded
// word. Both are this file's existing typographic conventions, not copy decisions. Grep the NBSPs
// with: grep -P '\xc2\xa0' HowItWorks.tsx
const STEPS: Step[] = [
  {
    n: '01',
    title: 'Apply',
    body: 'Sign in with your now.gg account and answer a few quick questions.',
    img: '/creator-brand/steps/creator-01-apply.webp',
    alt: 'A woman at a laptop beside a floating panel of ticked product tiles above a gradient action bar.',
  },
  {
    n: '02',
    title: 'Get selected',
    body: 'We review every application and email you when you’re in.',
    img: '/creator-brand/steps/creator-02-selected.webp',
    alt: 'A stack of application cards with the front one picked out and ticked, and an envelope opening beside it.',
  },
  {
    n: '03',
    title: 'Set up BlueAI',
    body: 'Install BlueAI and sign in with the same account you applied with. Setup takes about 20 minutes.',
    img: '/creator-brand/steps/creator-03-setup-blueai.webp',
    alt: 'A laptop showing BlueAI part-way through setting itself up, its progress ring partly filled.',
  },
  {
    n: '04',
    title: 'Earn',
    body: 'BlueAI runs brand campaigns on your account automatically. You’re paid via PayPal at the end of each month.',
    img: '/creator-brand/steps/creator-04-earn-monthly.webp',
    alt: 'Product tiles with partly filled progress rings, beside a month calendar and a wallet.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works">
      <StepCards
        // KEPT AS-IS at the designer's call (2026-08-13), having been flagged: with per-job consent
        // gone from the model, "you say yes once" now refers to the application itself rather than to
        // accepting a job. It reads correctly under that meaning, and the four steps below spell out
        // what the "rest" is.
        heading={
          <>
            You say yes once.
            <span className="mt-2 block text-gradient italic pr-[0.2em]">BlueAI does the rest.</span>
          </>
        }
        steps={STEPS}
      />
    </section>
  )
}
