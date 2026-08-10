import PlatformsGrid from '../platforms/PlatformsGrid'

// Creator-side copy only. Logos, colors, card styling and the live/soon hierarchy all live
// in ../platforms/ — shared with the brands page so a logo or a visual tweak is a one-place
// change instead of two.
const BODIES = {
  YouTube: 'Engagement jobs, live right now.',
  Instagram: 'Reels and posts.',
  TikTok: 'Any clip that hits the brief.',
  X: 'Threads and posts.',
  Reddit: 'Engagement jobs, coming soon.',
}

export default function Platforms() {
  return (
    <PlatformsGrid
      heading={
        <>
          YouTube is live.
          <span className="block text-gradient italic pr-[0.2em]">Everything else is coming.</span>
        </>
      }
      intro="BlueAI runs real jobs on YouTube today. Instagram, TikTok, X and Reddit are next. Join now to be first in line."
      bodies={BODIES}
    />
  )
}
