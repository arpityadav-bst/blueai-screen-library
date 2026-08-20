// The fleet roster — DATA ONLY, in its own module rather than inside FleetSection.tsx. The reason
// is a real defect, not tidiness: Fast Refresh preserves module state for non-component exports
// that live in a component file, so editing the data left the browser running the OLD array
// against the NEW markup. That cost a debugging round on 2026-08-19 on the machine roster this
// pattern was learned from (machines.ts, deleted 2026-08-20 with the rotating stage).

export type FleetCard = {
  id: string
  name: string
  /** Two lines under the name. What this machine does for you, not what it is.
      KEEP THESE WITHIN A FEW CHARACTERS OF EACH OTHER — 58 to 72 is the band that lands every one
      of them on exactly two lines at the card's measure. They ranged 61 to 78 until 2026-08-20,
      which put two cards on two lines and two on three; `text-wrap: balance` evens the lines
      WITHIN a blurb but cannot make four different-length blurbs agree on a line count, and the
      row reads as ragged when they disagree. The tag is pinned to the card floor either way
      (.fcard-tag margin-top:auto), so this is about the text block, not the card height. */
  blurb: string
  /** The status pill. `live` also decides the card's whole treatment. */
  tag: string
  live: boolean
  src: string
  alt: string
  /** No per-card geometry any more. The four images are interchangeable 16:9 tiles, reframed at
      build time (scratchpad reframe.py) so each subject fills ~88% of its tile's height — the
      normalisation moved out of CSS and into the asset, which is why nothing here parameterises
      it. See FleetSection.tsx for why they carry their backgrounds. */
}

// PIPELINE, so this is reproducible: nano_banana_pro (2k) -> reframe to a 4:3 window centred on
// the subject at 88% fill -> WebP 900x675. Prompted for a cinematic low three-quarter angle with
// real motion in it (banking, mid-stride, mid-air), never a catalogue front view — Appy's
// explicit brief for these.
//
// pc and robot were RESHOT 2026-08-20 (Appy: the laptop's screen was distorted where it met the
// keyboard base, and the robot had a face, which the hero robot deliberately does not). Their
// prompts now name the physical constraint rather than describing the object and hoping — a
// straight hinge and flat rigid panels for the laptop, a seamless blank dome with no eyes or
// mouth for the robot. Both were generated at 4:3 natively, so unlike taxi and next they lose
// nothing to the reframe; the crop windows are per-source-aspect for exactly that reason.
//
// THE BACKGROUND STAYS. These went through image_background_remover first, like the hero
// cutouts, and that was wrong here (Appy, 2026-08-20: "we can include these images along with
// their bgs" / "the robot legs are getting chopped harshly"). A cutout carries a hard flat edge
// wherever the render's own frame cut the subject, and floating in empty space that edge reads as
// damage. Inside a photo tile the identical cut is a crop, which is what every photograph is.
// The removal step still earns its keep: its alpha bbox is how the reframe measures where each
// subject sits, so the four windows are measured rather than eyeballed.
export const FLEET: FleetCard[] = [
  {
    id: 'pc',
    name: 'Your PC',
    blurb: 'Live today. Install BlueAI, sign in, and it starts taking jobs.',
    tag: 'Earning now',
    live: true,
    src: '/creators/fleet/pc.webp',
    alt: 'A laptop running BlueAI, screen lit violet, shot low on a dark studio backdrop',
  },
  {
    id: 'robot',
    name: 'Home robots',
    blurb: 'The same worker, with hands, for jobs that need something moved.',
    tag: 'Soon',
    live: false,
    src: '/creators/fleet/robot.webp',
    alt: 'A faceless humanoid robot mid-stride, chest panel lit cyan',
  },
  {
    id: 'taxi',
    name: 'Robotaxis',
    blurb: 'Your car earning between your own trips, on rides you approve.',
    tag: 'Soon',
    live: false,
    src: '/creators/fleet/taxi.webp',
    alt: 'A driverless robotaxi banking through a turn, sensor pod lit cyan',
  },
  {
    id: 'next',
    name: "Whatever's next",
    blurb: 'Every machine you add joins the same worker, and the same payout.',
    tag: 'Open slot',
    live: false,
    src: '/creators/fleet/next.webp',
    alt: 'A robot vacuum banking mid-turn, indicator ring lit cyan',
  },
]
