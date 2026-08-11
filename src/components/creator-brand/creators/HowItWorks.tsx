import StepCards, { type Step } from '../StepCards'

// Step art: designer-supplied set, used EXACTLY as delivered — no background cut, no
// rescaling, no mask, no weight normalisation. All of that machinery existed to make an
// opaque near-white raster sit convincingly on open page background; inside a card the
// image is full-bleed against the card's own edge, so there is no floating box to
// disguise and nothing to correct. Filenames are the designer's own rather than the old
// step0N-* numbering, which had drifted out of step with the steps themselves.
//
// CAVEAT ON THE ART, not on the code: several of these illustrations draw the engagement
// mechanics as icons (an eye, a heart, a speech bubble, a repost arrow). The copy on both
// pages was deliberately reworked to stop enumerating those, and a raster asserts them just
// as much as a sentence while being much harder to change later. The alt text below
// describes what is drawn WITHOUT re-enumerating them, which is the only part of this that
// code can fix.
const STEPS: Step[] = [
  {
    n: '01',
    title: 'Accept a job that fits',
    // Was two parenthetical em dashes wrapping a middle clause. Split into two sentences
    // instead: the aside was doing real work and deserved to be a statement, not an
    // interruption.
    //
    // Then trimmed from 184 to ~137 characters to match the other two bodies' line count.
    // Two clauses went, and neither is load-bearing HERE: "if you're new" is already implied
    // by "a few quick questions", and "and you still decide" is said twice over by this
    // card's own title ("Accept a job that fits") and the section heading ("You say yes
    // once"). The mechanism — how BlueAI knows your taste — is the part worth the characters,
    // so it stayed.
    body: 'BlueAI already knows what you’re into, from your watch history or a few quick questions. So every job it shows is one you’d actually watch.',
    img: '/creator-brand/steps/creator-02-accept-job.png',
    alt: 'A person smiling behind three floating glass product cards, reaching toward the middle one, which carries a checkmark.',
  },
  {
    n: '02',
    title: 'BlueAI takes it from there',
    // "toward your payout" is added length that does real work: it's the hinge into step 03,
    // and it brings this body up to the same line count as its neighbours rather than
    // padding it with filler to get there.
    body: 'It handles the brand’s video on your account from start to finish, then verifies the work before it counts toward your payout.',
    img: '/creator-brand/steps/creator-03-blueai-takes-over.png',
    alt: 'A person sitting back with a mug while glass panels float in front of them around a video panel, each panel marked with a checkmark.',
  },
  {
    n: '03',
    title: 'Get paid, on repeat',
    body: 'You get paid once the work clears, and BlueAI schedules the next cycle automatically. There’s nothing for you to re-accept.',
    img: '/creator-brand/steps/creator-04-get-paid.png',
    alt: 'A person holding a phone behind floating glass cards of stacked parcels, with a glowing wallet resting below them.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works">
      <StepCards
        // Was "BlueAI takes it from there" — the exact same sentence as step 02, a few
        // hundred px below it. Reworded so the section heading and the step title stop
        // colliding. Accent phrase on its OWN line rather than trailing inline: at this
        // scale an italic gradient span crowding the end of a line is what clipped
        // descenders on the hero H1 before pr-[0.2em] + a looser line-height fixed it.
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
