import type { Metadata } from 'next'
import MmHero from '@/components/mm/MmHero'
import MmAgents from '@/components/mm/MmAgents'
import MmStory from '@/components/mm/MmStory'
import '@/styles/moneymaker.css'

// /moneymaker — "The Autonomy OS": a premium futuristic AI-agent site on the blueAI LIGHT
// theme (creator-v2's language — living gradient sky, glass, Space Grotesk, iris glow).
// Cinematic GSAP choreography: hero parallax + 3D panel, pinned night-shift scene.
// Island funnel — no shared marketing chrome. All figures are scripted demo data.
export const metadata: Metadata = {
  title: 'BlueAI Moneymaker — the AI that pays you',
  description: 'Hire autonomous agents that create, predict, trade and flip — quietly earning in the background while you live your life.',
}

export default function MoneymakerPage() {
  return (
    <div className="v-mm" id="top">
      {/* mono numerals only (display + body come from the root layout: Space Grotesk + Inter) */}
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      <MmHero />
      <MmAgents />
      <MmStory />
    </div>
  )
}
