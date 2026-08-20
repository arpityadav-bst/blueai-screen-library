// The machine roster — DATA ONLY, deliberately its own module.
//
// It used to live in MachineStage.tsx alongside the component. That cost a confusing debugging
// round on 2026-08-19: Next's Fast Refresh preserves module state for non-component exports living
// in a component file, so after editing the per-machine copy the browser kept running the OLD loop
// closure against the OLD array while rendering the NEW markup — the task bar showed "Home robot"
// with the PC's "Getting a task from a brand" line, a combination the source could not produce.
// A pure-data module swaps cleanly, so the stale-closure trap cannot recur here.

export type Machine = {
  id: string
  /** Shown at the head of the task bar. */
  name: string
  /** The lifecycle copy for THIS machine. A roomba cannot "get a task from a brand" (Appy,
      2026-08-19) — the generic brand-campaign wording was written for the PC and read as nonsense
      the moment it was applied to a vacuum or a car. Each machine narrates the work it plausibly
      does; only the shape of the sequence is shared.

      EVERY BEAT IS A WHOLE CLAUSE, and none of them contains an em dash (Appy, 2026-08-20). The
      work beats used to be label-style fragments ("Like + comment — launch video") because the
      loop prefixed them with "Working:"; that prefix is gone, so each line now has to stand on its
      own, and a dash standing in for a verb does not. Present participle throughout, so the strip
      reads as something happening rather than as a field and its value.

      KEEP THESE UNDER ~36 CHARACTERS. The bar is a fixed 468px and the text column is what is left
      after the machine name, the step and the tag; past that the line ellipses, which is the one
      outcome worse than a short sentence — the whole point of the per-line timing below is that a
      long line can be read in full. */
  beats: { intake: string; approve: string; approved: string; work: string }
  src: string
  alt: string
  /** A live machine ends its task with a payout; the rest just finish. */
  live: boolean
  /** VISIBLE height as a fraction of the stage, 0-1. Every cutout is height-bound in this frame,
      so contain would render all five at the same height — and at equal height a 2.02-ratio car is
      nearly three times the width of a 0.73-ratio robot, so the wide ones dominate and the
      composition lurches every time one arrives. Capping evens VISUAL MASS rather than height. */
  fit: number
  /** How much of the cutout is SHOWN, measured from its top, 0-1; 1 = the whole thing, no mask.
      Shrinking a tall object to match a wide one's height makes it narrow and weedy, so the phone
      and the robot are instead enlarged until their top two-thirds fills the same height the
      others do, and the remaining third is dissolved by a mask rather than cut. */
  crop: number

  // NO `ratio` AND NO `badges` any more (Appy, 2026-08-20). The stage moved out of the hero into
  // the "It earns while you sleep" section and lost its floating money/action pills on the way;
  // `ratio` existed only to compute where those pills hung off each silhouette. Removed rather
  // than left in place — unused data is a promise the next reader has to disprove.
}

export const MACHINES: Machine[] = [
  {
    id: 'laptop',
    name: 'Your PC',
    beats: {
      intake: 'Getting a task from a brand',
      approve: 'Sent for your approval',
      approved: 'You approved it',
      work: 'Running the campaign task',
    },
    src: '/creators/machines/laptop.webp',
    alt: 'A laptop running BlueAI, screen lit with the BlueAI mark',
    live: true,
    fit: 0.8,
    crop: 1,
  },
  {
    id: 'phone',
    name: 'Your phone',
    beats: {
      intake: 'Getting a task from a brand',
      approve: 'Sent for your approval',
      approved: 'You approved it',
      work: 'Finishing a three-minute job',
    },
    src: '/creators/machines/phone.webp',
    alt: 'A phone running BlueAI, screen lit with the BlueAI mark',
    live: false,
    fit: 0.86,
    crop: 0.68,
  },
  {
    id: 'robot',
    name: 'Home robot',
    beats: {
      intake: 'A job came in nearby',
      approve: 'Sent for your approval',
      approved: 'You approved it',
      work: 'Unpacking the weekly delivery',
    },
    src: '/creators/machines/robot.webp',
    alt: 'A humanoid home robot running BlueAI, the mark lit on its chest',
    live: false,
    fit: 0.86,
    crop: 0.68,
  },
  {
    id: 'robotaxi',
    name: 'Robotaxi',
    beats: {
      intake: 'A ride request came in',
      approve: 'Sent for your approval',
      approved: 'You approved it',
      work: 'Driving an airport run',
    },
    src: '/creators/machines/robotaxi.webp',
    alt: 'A self-driving robotaxi running BlueAI on its dashboard',
    live: false,
    fit: 0.78,
    crop: 1,
  },
  {
    id: 'roomba',
    name: "Whatever's next",
    // the open slot: not a brand job at all, just the next machine you own coming online
    beats: {
      intake: 'A new machine came online',
      approve: 'Sent for your approval',
      approved: 'You connected it',
      work: 'Cleaning the living room',
    },
    src: '/creators/machines/roomba.webp',
    alt: 'A robot vacuum running BlueAI, its indicator ring lit',
    live: false,
    fit: 0.76,
    crop: 1,
  },
]
