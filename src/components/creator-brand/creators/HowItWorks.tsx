import Reveal from '../Reveal'
import StepSequencer, { type SequencerStep } from '../StepSequencer'
import CommentApprovalDemo from './CommentApprovalDemo'

// Step art: abstract glass objects, generated to match the hero PNGs' material language
// (translucent, iris/cyan/blue inner light, near-white ground). Deliberately carries no
// text, labels or UI of any kind — anything legible baked into a raster can't be edited
// later, which is exactly how the previous hero art ended up asserting things the copy
// had already been corrected to stop saying. `glow` is the color behind each image in
// its own beat — always one of the on-brand hues, never an arbitrary one.
const STEPS: SequencerStep[] = [
  {
    n: '01',
    title: 'Paste your handle',
    body: 'BlueAI reads your channel in seconds. No application, no waiting on a reply.',
    img: '/creator-brand/steps/step01-read.png',
    alt: 'A glass sphere with a ring of light passing through it, suggesting a channel being read.',
    glow: 'rgba(123, 76, 255, .38)', // iris
  },
  {
    n: '02',
    title: 'Accept a job that fits',
    body: 'BlueAI already knows what you’re into — from your watch history, or a few quick questions if you’re new — so every job it shows fits what you’d actually watch. You still decide.',
    img: '/creator-brand/steps/step02-match.png',
    alt: 'Many small glass spheres settling into one connected lattice.',
    glow: 'rgba(14, 164, 197, .38)', // cyan
  },
  {
    n: '03',
    title: 'BlueAI takes it from there',
    body: 'It handles the brand’s video on your account from start to finish, then verifies everything before it counts.',
    img: '/creator-brand/steps/step03-run.png',
    alt: 'A glass prism splitting a single beam of light into clean rays.',
    glow: 'rgba(47, 109, 255, .38)', // mkt-blue
  },
  {
    n: '04',
    title: 'Get paid, on repeat',
    body: 'You get paid once it clears, and BlueAI schedules the next cycle automatically — no re-accepting anything.',
    img: '/creator-brand/steps/step04-paid.png',
    alt: 'A stack of glass discs accumulating upward with a warm glow at the base.',
    glow: 'rgba(107, 83, 255, .38)', // cta-gradient midpoint
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works">
      <StepSequencer
        // Was "BlueAI takes it from there" — the exact same sentence as step 03, ~200px
        // below it. Reworded so the section heading and the step title stop colliding.
        // Accent phrase on its OWN line rather than trailing inline: at hero scale, an
        // italic gradient span crowding the end of a line is exactly what clipped
        // descenders on the hero H1 before pr-[0.2em] + a looser line-height fixed it.
        // Own line removes the crowding outright; pr-[0.2em] is kept as the same
        // established safety margin, not because this exact phrase has a descender.
        heading={
          <>
            You say yes once.
            <span className="mt-2 block text-gradient italic pr-[0.2em]">BlueAI does the rest.</span>
          </>
        }
        steps={STEPS}
      />

      {/* Kept as its own beat AFTER the sequence rather than folded into step 04. It's
          the strongest trust artifact on the page — a real, visible mechanic — and it
          gets more attention standing alone than as the tail of someone else's list.
          Deliberately NOT a .cb-beat: this is reference material you read, not a moment
          you arrive at, so it stays in normal flow. */}
      <div className="px-6 pb-24 pt-4">
        <div className="mx-auto grid max-w-content items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <h3 className="font-head text-[24px] font-semibold text-ink-display sm:text-[28px]">
              You&apos;re always in the loop.
            </h3>
            <p className="bai-body mt-3 max-w-[48ch] text-ink-body-2">
              Every comment BlueAI wants to post shows up on your screen first, before it goes out
              under your name. Approve it, edit it, or switch on auto-approve if you&apos;d rather not
              be asked every time.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <CommentApprovalDemo />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
