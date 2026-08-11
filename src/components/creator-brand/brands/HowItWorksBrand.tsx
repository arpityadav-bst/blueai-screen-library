import StepCards, { type Step } from '../StepCards'

// Converted from a static 4-up card grid, to a pinned scroll sequencer, and now back to a
// 4-up card grid — this time on the shared StepCards component the creators page also uses,
// so both journeys are told the same way and neither page owns a private layout.
//
// Step art: designer-supplied set, used exactly as delivered. See creators/HowItWorks.tsx
// for why there is no background cut, mask or rescaling any more, and for the standing
// caveat about this art depicting engagement mechanics the copy deliberately stopped
// enumerating. The alt text below avoids re-stating them.
const STEPS: Step[] = [
  {
    n: '01',
    title: 'Create the campaign',
    // "campaign window" rather than bare "window", which was ambiguous on its own and also
    // brings this body to the same line count as the other three.
    body: 'Tell us your goal, your budget, and a campaign window. It takes a couple of minutes.',
    img: '/creator-brand/steps/brand-01-post-job.png',
    alt: 'A large frosted glass panel holding a video frame, two settings sliders and a row of small portraits, with a glowing sparkle badge clipped to its edge.',
  },
  {
    n: '02',
    title: 'BlueAI matches creators',
    body: 'Thousands of waitlisted accounts pick up your campaign themselves. No outreach from you.',
    img: '/creator-brand/steps/brand-02-match-creators.png',
    alt: 'Eight glass portrait cards arranged around a central panel, each card marked with a checkmark.',
  },
  {
    n: '03',
    title: 'Real engagement, verified',
    // "verifies every one" for "confirms every single one" — same claim, and the shorter
    // form brings this, the longest of the four, down to their line count.
    body: 'Each creator genuinely engages with your video, and BlueAI verifies every one before it counts.',
    img: '/creator-brand/steps/brand-03-engagement-verified.png',
    alt: 'A parcel on a lit platform ringed by glass tiles, every tile marked with a checkmark.',
  },
  {
    n: '04',
    title: 'You watch it run, live',
    body: 'Watch the engagement roll in, in real time, from your budget until the window closes.',
    img: '/creator-brand/steps/brand-04-watch-live.png',
    alt: 'A frosted glass dashboard panel showing a video frame, columns of small portrait chips, a rising bar chart and a circular gauge.',
  },
]

export default function HowItWorksBrand() {
  return (
    <section id="how-it-works">
      <StepCards
        // Kept the existing "No PR team" line as the heading rather than writing a new one
        // to mirror the creators page. It's the strongest sentence on this page, and the
        // original conversion dropped the section's intro paragraph, so losing this line as
        // well would have cost the section its whole voice.
        heading={
          <>
            No PR team. No negotiating.
            <span className="mt-2 block text-gradient italic pr-[0.2em]">No chasing invoices.</span>
          </>
        }
        steps={STEPS}
      />
    </section>
  )
}
