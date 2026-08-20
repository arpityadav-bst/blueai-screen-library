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
      does; only the shape of the sequence is shared. */
  beats: { intake: string; approve: string; approved: string; work: string }
  src: string
  alt: string
  /** Live machines complete a paid task and credit the pill; the rest show "Soon". */
  live: boolean
  /** The cutout's own width/height, so the loop can compute where the object actually renders
      inside the frame (object-fit: contain, bottom-anchored) and hang badges off its real edges. */
  ratio: number
  /** 2-3 illustrative amounts. x/y are fractions of the OBJECT's own box, not the frame — each
      one was placed against that machine's measured silhouette (alpha sampled at six heights) so
      it sits just off a real edge rather than at a generic frame corner. Count varies by shape:
      a busy silhouette carries three, a simple one two. */
  badges: { v: string; x: number; y: number }[]
}

export const MACHINES: Machine[] = [
  {
    id: 'laptop',
    name: 'Your PC',
    beats: {
      intake: 'Getting a task from a brand',
      approve: 'Sent for your approval',
      approved: 'You approved',
      work: 'Like + comment — launch video',
    },
    src: '/creators/machines/laptop.webp',
    alt: 'A laptop running BlueAI, screen lit with the BlueAI mark',
    live: true,
    ratio: 1.79,
    // screen occupies the upper-left (right edge ~0.48 up top); the base runs out to ~0.97 lower
    badges: [
      { v: '+$1.50', x: 0.55, y: 0.12 },
      { v: '+$0.60', x: 0.03, y: 0.47 },
      { v: '+$1.00', x: 0.93, y: 0.74 },
    ],
  },
  {
    id: 'phone',
    name: 'Your phone',
    beats: {
      intake: 'Getting a task from a brand',
      approve: 'Sent for your approval',
      approved: 'You approved',
      work: 'Watch — 3-min product demo',
    },
    src: '/creators/machines/phone.webp',
    alt: 'A phone running BlueAI, screen lit with the BlueAI mark',
    live: false,
    ratio: 0.94,
    // the phone lies on a diagonal: top mass sits left, bottom mass swings right
    badges: [
      { v: '+$0.40', x: 0.62, y: 0.11 },
      { v: '+$1.50', x: 0.26, y: 0.82 },
    ],
  },
  {
    id: 'robot',
    name: 'Home robot',
    beats: {
      intake: 'A job came in nearby',
      approve: 'Sent for your approval',
      approved: 'You approved',
      work: 'Unpacking the weekly delivery',
    },
    src: '/creators/machines/robot.webp',
    alt: 'A humanoid home robot running BlueAI, the mark lit on its chest',
    live: false,
    ratio: 0.73,
    // arms are widest at y~0.30; torso narrows to ~0.56 right; legs narrow again below
    badges: [
      { v: '+$2.00', x: 0.14, y: 0.12 },
      { v: '+$0.60', x: 0.82, y: 0.50 },
      { v: '+$1.50', x: 0.76, y: 0.82 },
    ],
  },
  {
    id: 'robotaxi',
    name: 'Robotaxi',
    beats: {
      intake: 'A ride request came in',
      approve: 'Sent for your approval',
      approved: 'You approved',
      work: 'Driving an airport run',
    },
    src: '/creators/machines/robotaxi.webp',
    alt: 'A self-driving robotaxi running BlueAI on its dashboard',
    live: false,
    ratio: 2.02,
    // low wide body; the roof is the only place with clear air either side
    badges: [
      { v: '+$3.00', x: 0.88, y: 0.13 },
      { v: '+$1.00', x: 0.05, y: 0.15 },
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
      work: 'Cleaning — living room',
    },
    src: '/creators/machines/roomba.webp',
    alt: 'A robot vacuum running BlueAI, its indicator ring lit',
    live: false,
    ratio: 1.52,
    // disc banked to the right, so its clear air is upper-left and lower-right
    badges: [
      { v: '+$0.60', x: 0.20, y: 0.13 },
      { v: '+$1.00', x: 0.90, y: 0.74 },
    ],
  },
]
