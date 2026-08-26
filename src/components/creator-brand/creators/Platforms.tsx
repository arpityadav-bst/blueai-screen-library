import PlatformsGrid from '../platforms/PlatformsGrid'

// Creator-side copy only. Logos, colors, card styling and the live/soon hierarchy all live
// in ../platforms/ — shared with the brands page so a logo or a visual tweak is a one-place
// change instead of two.
//
// "ENGAGEMENT JOBS" IS GONE (PM, 2026-08-13, screenshot item 6). It appeared twice — on YouTube and on
// Reddit — and it is the one phrase on this site that names the thing outright. The unit is still a
// "job" (the PM's own FAQ calls it that); what cannot be said is what kind. "Brand campaigns" is the
// replacement, matching the hero's sub-headline and step 4.
//
// Reddit lost its whole sentence rather than having "engagement" swapped out of it, because the other
// three "soon" cards say what the format IS ("Reels and posts", "Any clip that hits the brief",
// "Threads and posts") and Reddit was the odd one out saying what the work is. It now describes a
// format like its neighbours. "Comments" is deliberately not that format, for the same reason the
// phrase above went.
const BODIES = {
  YouTube: 'Agency campaigns, live right now.',
  Instagram: 'Reels and posts.',
  TikTok: 'Any clip that hits the brief.',
  X: 'Threads and posts.',
  Reddit: 'Subreddit posts.',
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
      // Rewritten 2026-08-13 (PM). "Supports", not "runs" — softer verb for the same fact. The platform
      // list collapses to "Everything else is coming soon" rather than naming Instagram/TikTok/X/Reddit
      // a second time; they're already named as cards in the grid this line introduces. "Apply", not
      // "Apply now" — this is the intro line, not a button, so the urgency belongs to the actual CTA.
      // NBSP joins the last two words per this file's own convention (see FAQ.tsx's note, which cites
      // this very attribute as the reason it has to be the literal character, not a &nbsp; escape) —
      // the string itself hadn't actually been carrying one until this edit.
      intro="BlueAI supports campaigns on YouTube today. Everything else is coming soon. Apply to be the first in line."
      bodies={BODIES}
    />
  )
}
