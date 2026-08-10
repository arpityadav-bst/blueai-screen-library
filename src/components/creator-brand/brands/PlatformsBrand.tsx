import PlatformsGrid from '../platforms/PlatformsGrid'

// Brand-side copy only. Logos, colors, card styling and the live/soon hierarchy all live in
// ../platforms/ — shared with the creators page so a logo or a visual tweak is a one-place
// change instead of two.
const BODIES = {
  YouTube: 'Post jobs here, live right now.',
  Instagram: 'Reels and feed posts.',
  TikTok: 'Any clip that hits the brief.',
  X: 'Threads and posts.',
  Reddit: 'Comments and community posts.',
}

export default function PlatformsBrand() {
  return (
    <PlatformsGrid
      heading={
        <>
          Post on YouTube today.
          <span className="block text-gradient italic pr-[0.2em]">Everything else is coming.</span>
        </>
      }
      intro="BlueAI runs real jobs on YouTube now. Instagram, TikTok, X and Reddit are next. Post now, be ready when they open."
      bodies={BODIES}
    />
  )
}
