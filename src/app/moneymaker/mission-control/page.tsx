import type { Metadata } from 'next'
import Mm2Hero from '@/components/mm2/Mm2Hero'
import Mm2Fleet from '@/components/mm2/Mm2Fleet'
import Mm2Safety from '@/components/mm2/Mm2Safety'
import Mm2Swarm from '@/components/mm2/Mm2Swarm'
import '@/styles/moneymaker-mission.css'

// /moneymaker/mission-control — VARIANT 2 of the moneymaker page: "Mission Control".
// SpaceX-launch-broadcast aesthetic (per the strategy meeting's design brief): near-black,
// telemetry mono, an ascending worker unit, a flight-manifest waitlist. All imagery is
// original/procedural (starfield, capsule, swarm canvas) — no scraped SpaceX assets.
// Island funnel — no shared marketing chrome. All figures are scripted demo data.
export const metadata: Metadata = {
  title: 'BlueAI Moneymaker — Mission Control',
  description: 'Deploy your own autonomous AI worker. One unit, four disciplines, earning on your behalf — reserve your place on the flight manifest.',
}

export default function MissionControlPage() {
  return (
    <div className="v-mm2">
      <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      <Mm2Hero />
      <Mm2Fleet />
      <Mm2Safety />
      <Mm2Swarm />
    </div>
  )
}
