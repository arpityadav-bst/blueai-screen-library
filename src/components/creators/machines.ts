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
  /** Live machines complete a paid task and credit the pill; the rest show "Soon". */
  live: boolean
  /** The cutout's own width/height, so the loop can compute where the object actually renders
      inside the frame (object-fit: contain, sized by `fit`/`crop` below) and hang badges off its
      real edges. */
  ratio: number
  /** VISIBLE height as a fraction of the frame, 0-1 (Appy, 2026-08-20: "all the images are too
      large except mobile and robot"). Every cutout is height-bound in this frame, so contain
      rendered all five at the SAME 360px height — and at equal height a 2.02-ratio car is nearly
      three times the width of a 0.73-ratio robot, so the wide ones dominated the stage and the
      composition lurched every time one arrived. Capping them evens out VISUAL MASS rather than
      height, which is the thing that was actually unequal.
      The capped box is CENTRED in the frame, not bottom-anchored (Appy, same day: "sitting too
      low, doesn't feel like they are at the center"). Bottom-anchoring was there to give the five
      one shared ground line, which was right while they were all the same height; once three of
      them were shorter than the frame it just parked them in the lower third under a band of dead
      air. The task bar no longer overlaps the object's own base, which Appy accepted explicitly. */
  fit: number
  /** How much of the cutout is SHOWN, measured from its top, 0-1 (Appy, 2026-08-20: "crop and fade
      them out from 2/3rd of the image height and only show that much, a bit enlarge to match other
      images visually and also increasing their width"). This is the other half of the evening-out,
      and it only applies to the two TALL cutouts. Shrinking a tall object to match a wide one's
      height makes it narrow and weedy; instead the phone and the robot are enlarged until their
      top two-thirds fills the same height the others do, and the remaining third is dissolved by a
      mask rather than cut, so there is no hard edge where the object stops. The enlargement is
      what widens them — that is the whole point: proportions converge instead of heights.
      1 = the whole cutout, no mask. */
  crop: number
  /** 2-3 floating labels. x/y are fractions of the OBJECT's own box, not the frame — each one was
      placed against that machine's measured silhouette (alpha sampled at six heights) so it sits
      just off a real edge rather than at a generic frame corner. Count varies by shape: a busy
      silhouette carries three, a simple one two.

      ONE PAYOUT, THE REST ARE ACTIONS (Appy, 2026-08-20: "only one price badge and the other 1 or
      2 can be related to the task like cleaning, or bringing coffee"). Every machine used to float
      two or three dollar amounts, which said the same thing several times and made the stage read
      as a price list. A single amount is the claim; the action labels beside it are what that
      amount was earned doing, which is the part the machine's own picture cannot say.
      `pay` FIRST in every list — the reveal below is staggered in array order, so the money lands
      before the flavour rather than after it. Actions are one or two words: they are glanced at
      over a moving image, not read.

      NO "WATCHING" / "LIKING" / "COMMENTING", anywhere on this page (Appy, 2026-08-20). Those are
      the literal mechanics of the engagement work, and naming them turns an AI worker earning from
      brands into a bot farming a video. The same words were pulled from the task bar's `work`
      beats in the same pass — leaving them there would have put the exact wording back on screen
      three seconds later. Say the JOB ("Campaign", "Running the campaign task") or its OUTCOME
      ("Verified"), never the keystroke. */
  badges: { v: string; x: number; y: number; kind: 'pay' | 'act' }[]
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
    ratio: 1.79,
    fit: 0.8,
    crop: 1,
    // screen occupies the upper-left (right edge ~0.48 up top); the base runs out to ~0.97 lower
    badges: [
      { v: '+$1.50', x: 0.55, y: 0.12, kind: 'pay' },
      { v: 'Campaign', x: 0.03, y: 0.47, kind: 'act' },
      { v: 'Verified', x: 0.93, y: 0.74, kind: 'act' },
    ],
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
    ratio: 0.94,
    fit: 0.86,
    crop: 0.68,
    // the phone lies on a diagonal: top mass sits left, bottom mass swings right. Both badges sit
    // above the crop line (0.68) — a badge in the dissolved third would hang over nothing.
    badges: [
      { v: '+$0.40', x: 0.62, y: 0.11, kind: 'pay' },
      { v: 'On a job', x: 0.22, y: 0.54, kind: 'act' },
    ],
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
    ratio: 0.73,
    fit: 0.86,
    crop: 0.68,
    // arms are widest at y~0.30; torso narrows to ~0.56 right; the legs are in the dissolved third
    // now, so the third badge moved up to the torso's left instead of hanging off a shin
    badges: [
      { v: '+$2.00', x: 0.14, y: 0.12, kind: 'pay' },
      { v: 'Unpacking', x: 0.82, y: 0.50, kind: 'act' },
      { v: 'Tidying up', x: 0.24, y: 0.55, kind: 'act' },
    ],
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
    ratio: 2.02,
    fit: 0.78,
    crop: 1,
    // low wide body; the roof is the only place with clear air either side
    badges: [
      { v: '+$3.00', x: 0.88, y: 0.13, kind: 'pay' },
      { v: 'Airport run', x: 0.05, y: 0.15, kind: 'act' },
    ],
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
    ratio: 1.52,
    fit: 0.76,
    crop: 1,
    // disc banked to the right, so its clear air is upper-left and lower-right
    badges: [
      { v: '+$0.60', x: 0.20, y: 0.13, kind: 'pay' },
      { v: 'Cleaning', x: 0.90, y: 0.74, kind: 'act' },
    ],
  },
]
