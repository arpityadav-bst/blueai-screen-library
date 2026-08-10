'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '../Reveal'
import { CBLinkButton } from '../Button'
import PixelRain from '../creators/PixelRain'
import TiltImage from '../creators/TiltImage'

// Same edge-card device as the creators hero — brand-side proof points.
const EDGE_CARDS = [
  { text: 'Pay only for verified engagement', side: 'left' as const, top: 60, offset: -10, rot: -7, scale: 0.94 },
  { text: 'No PR team, no outreach, no briefs', side: 'left' as const, top: 150, offset: 6, rot: -2, scale: 1 },
  { text: 'Thousands of real accounts, not one big ad', side: 'left' as const, top: 240, offset: -14, rot: -5, scale: 0.9 },
  { text: 'Posting a job costs nothing upfront', side: 'left' as const, top: 330, offset: 2, rot: -3, scale: 0.96 },
  { text: 'Set a budget and a window — that’s it', side: 'left' as const, top: 420, offset: -18, rot: -6, scale: 0.9 },
  { text: 'Every engagement verified before it counts', side: 'right' as const, top: 60, offset: -14, rot: 7, scale: 0.94 },
  { text: 'Watch results roll in live', side: 'right' as const, top: 150, offset: 4, rot: 2, scale: 1 },
  { text: 'Creators matched to your niche', side: 'right' as const, top: 240, offset: -16, rot: 5, scale: 0.9 },
  { text: 'Payouts handled for you, automatically', side: 'right' as const, top: 330, offset: 0, rot: 3, scale: 0.96 },
  { text: 'Run several jobs in parallel', side: 'right' as const, top: 420, offset: -20, rot: 6, scale: 0.9 },
]

function EdgeCard({ c }: { c: (typeof EDGE_CARDS)[number] }) {
  const [hovered, setHovered] = useState(false)
  const scale = hovered ? c.scale + 0.08 : c.scale
  const rot = hovered ? c.rot + (c.rot >= 0 ? 4 : -4) : c.rot
  const fadeFrom = c.side === 'left' ? 'to right' : 'to left'
  const fadeMask = `linear-gradient(${fadeFrom}, transparent, black 45%)`

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="pointer-events-auto absolute hidden w-[220px] cursor-default transition-all duration-300 ease-out-bai lg:block"
      style={{
        top: c.top,
        [c.side]: c.offset,
        transform: `rotate(${rot}deg) scale(${scale})`,
        opacity: hovered ? 1 : 0.45,
      }}
    >
      <div
        className="absolute inset-0 rounded-chat border border-divider bg-white shadow-hairline transition-shadow duration-300 hover:shadow-float"
        style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }}
      />
      <p className="relative px-6 py-5 text-[12.5px] font-normal leading-snug text-ink-muted">{c.text}</p>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden px-6 pb-24 pt-10 sm:pt-14">
      <PixelRain className="z-0" />

      <div className="absolute inset-0 z-0" aria-hidden="true">
        {EDGE_CARDS.map((c) => <EdgeCard key={c.text} c={c} />)}
      </div>

      <div className="relative z-[1] mx-auto flex max-w-[1380px] flex-col items-center text-center">
        <Reveal className="flex flex-col items-center">
          <h1 className="max-w-[780px] font-head text-5xl font-bold tracking-tight-2 text-ink-display sm:text-6xl">
            An AI that turns your budget <span className="text-gradient italic inline-block pr-[0.2em]">into real reach.</span>
          </h1>
          <p className="bai-body-lg mx-auto mt-5 max-w-[640px]">
            Set your goal and your budget — BlueAI matches thousands of real people who
            genuinely engage with your video, verifies every interaction, and pays them for you, automatically.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14 flex flex-col items-center gap-3">
          <CBLinkButton href="#post-a-job" size="lg" className="min-w-[240px]">Post a job</CBLinkButton>
          <Link
            href="#pricing"
            className="text-[13px] font-normal text-ink-muted underline decoration-1 underline-offset-4 opacity-70 transition-opacity hover:text-ink-heading hover:opacity-100"
          >
            See how pricing works
          </Link>
        </Reveal>

        <Reveal delay={0.25} className="mt-10 w-full max-w-[1240px] overflow-hidden">
          <TiltImage className="-mt-[1%]">
            <Image
              id="hero-image"
              src="/creator-brand/brand-workflow-engagement-v1.png"
              alt="A brand's job going live, engagement being verified, and payment settling automatically."
              width={1672}
              height={941}
              className="h-auto w-full"
              style={{
                // No blend mode: this asset's background measures ~#F7F7F7–#F9F9FA against the
                // page's #F9F9FA — a 0–3 unit delta, already invisible. Measure before adding a
                // blend mode here again — see the git history on this line for why.
                maskImage: 'radial-gradient(ellipse 75% 80% at center, black 55%, transparent 92%)',
                WebkitMaskImage: 'radial-gradient(ellipse 75% 80% at center, black 55%, transparent 92%)',
              }}
            />
          </TiltImage>
        </Reveal>
      </div>
    </section>
  )
}
