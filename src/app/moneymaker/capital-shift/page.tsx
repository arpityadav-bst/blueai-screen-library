import type { Metadata } from 'next'
import Mm3Hero from '@/components/mm3/Mm3Hero'
import Mm3Compare from '@/components/mm3/Mm3Compare'
import Mm3Agents from '@/components/mm3/Mm3Agents'
import Mm3Trust from '@/components/mm3/Mm3Trust'
import Mm3Close from '@/components/mm3/Mm3Close'
import '@/styles/moneymaker-capital.css'

// /moneymaker/capital-shift — VARIANT 3 of the moneymaker page: "The Capital Shift".
// Manifesto-led, editorial/keynote big-type direction (the "sell time -> sell capital"
// positioning that inspired the name is internal strategy — on-page copy + metadata
// state the product benefit directly, not that framing). The network visualization is
// procedural (canvas), no stock/scraped imagery. Island funnel — no shared marketing
// chrome. All figures are scripted demo data.
export const metadata: Metadata = {
  title: 'BlueAI Moneymaker — The Capital Shift',
  description: 'Deploy an autonomous AI worker that creates, predicts, trades and flips — earning for you, day and night. Join the waitlist.',
}

export default function CapitalShiftPage() {
  return (
    <div className="v-mm3">
      <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&display=swap" rel="stylesheet" />
      <Mm3Hero />
      <Mm3Compare />
      <Mm3Agents />
      <Mm3Trust />
      <Mm3Close />
    </div>
  )
}
