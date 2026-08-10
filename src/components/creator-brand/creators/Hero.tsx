'use client'

import { useState } from 'react'
import Image from 'next/image'
import Reveal from '../Reveal'
import HandleLookupCard from './HandleLookupCard'
import PixelRain from './PixelRain'
import TiltImage from './TiltImage'

// Slim proof-point cards, scattered near the hero's edges (same device as the social-rewards
// hero's Reddit-post collage). Quiet by default (low opacity, hairline border) — on hover each
// one comes forward: full opacity, a touch bigger, and a little extra tilt.
const EDGE_CARDS = [
  { text: 'Works from a few hundred subscribers up', side: 'left' as const, top: 60, offset: -10, rot: -7, scale: 0.94 },
  { text: 'No experience or portfolio needed', side: 'left' as const, top: 150, offset: 6, rot: -2, scale: 1 },
  { text: 'Matched to jobs that actually fit you', side: 'left' as const, top: 240, offset: -14, rot: -5, scale: 0.9 },
  { text: 'See what a job pays before you accept', side: 'left' as const, top: 330, offset: 2, rot: -3, scale: 0.96 },
  { text: 'Skip or decline any job, anytime', side: 'left' as const, top: 420, offset: -18, rot: -6, scale: 0.9 },
  { text: 'You approve every comment before it posts', side: 'right' as const, top: 60, offset: -14, rot: 7, scale: 0.94 },
  { text: 'No pitching, no negotiating', side: 'right' as const, top: 150, offset: 4, rot: 2, scale: 1 },
  { text: 'Real brands, real payouts', side: 'right' as const, top: 240, offset: -16, rot: 5, scale: 0.9 },
  { text: 'Get paid within days of it clearing', side: 'right' as const, top: 330, offset: 0, rot: 3, scale: 0.96 },
  { text: 'Take on as many jobs as you want', side: 'right' as const, top: 420, offset: -20, rot: 6, scale: 0.9 },
]

function EdgeCard({ c }: { c: (typeof EDGE_CARDS)[number] }) {
  const [hovered, setHovered] = useState(false)
  const scale = hovered ? c.scale + 0.08 : c.scale
  const rot = hovered ? c.rot + (c.rot >= 0 ? 4 : -4) : c.rot
  const fadeFrom = c.side === 'left' ? 'to right' : 'to left'
  // The card's outer edge (the side facing the page margin) fades to transparent — real
  // dissolve, no blur this time, just the mask.
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
            An AI that turns your channel <span className="text-gradient italic inline-block pr-[0.2em]">into income.</span>
          </h1>
          <p className="bai-body-lg mx-auto mt-5 max-w-[640px]">
            BlueAI matches you to a real brand job that fits your interests, handles it on your
            account end to end, and pays you once it&apos;s verified.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="w-full max-w-md mt-14">
          <HandleLookupCard />
        </Reveal>

        <Reveal delay={0.25} className="mt-10 w-full max-w-[1240px] overflow-hidden">
          <TiltImage className="-mt-[1%]">
            <Image
              id="hero-image"
              src="/creator-brand/creator-workflow-engagement-v1.png"
              alt="A creator accepting a job, engagement being verified, and payment landing in their account."
              width={1672}
              height={941}
              priority
              className="h-auto w-full"
              style={{
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
