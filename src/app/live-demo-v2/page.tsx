import type { Metadata } from 'next'
import '@/styles/live-demo-v2.css'
import { Ldv2Nav } from '@/components/ldv2/Ldv2Nav'
import { Ldv2Backdrop, Ldv2Hero } from '@/components/ldv2/Ldv2Hero'
import { Ldv2Stats, Ldv2How } from '@/components/ldv2/Ldv2Proof'
import { Ldv2Workers } from '@/components/ldv2/Ldv2Workers'
import { Ldv2Why, Ldv2Quotes, Ldv2Cta, Ldv2Footer } from '@/components/ldv2/Ldv2Lower'

// Live Demo Homepage — DS redesign of the PM's blue-ai-demo funnel (pristine source kept in
// design-source/blue-ai-demo). Same IA + copy + the LIVE hire widget (reskinned at
// public/live-demo-v2/widget.html); skin + motion are ours. Scoped .ldv2.
export const metadata: Metadata = {
  title: 'BlueAI — Hire an AI worker to make you money | bluestacks.ai',
  description: 'An AI worker that uses your real apps to earn and save money for you, on your PC, in the background. Hire yours, right here.',
}

export default function LiveDemoV2() {
  return (
    <div className="ldv2">
      <Ldv2Backdrop />
      <Ldv2Nav />
      <main>
        <Ldv2Hero />
        <Ldv2Stats />
        <Ldv2Workers />
        <Ldv2How />
        <Ldv2Why />
        <Ldv2Quotes />
        <Ldv2Cta />
      </main>
      <Ldv2Footer />
    </div>
  )
}
