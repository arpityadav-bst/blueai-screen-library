'use client'

import { useState } from 'react'
import Image from 'next/image'
import Reveal from '../Reveal'
import ApplyButton from './ApplyButton'
import PixelRain from './PixelRain'
import TiltImage from './TiltImage'
import { HERO_IMAGE_MASK } from '../heroImageMask'

// Slim proof-point cards, scattered near the hero's edges (same device as the social-rewards
// hero's Reddit-post collage). Quiet by default (low opacity, hairline border) — on hover each
// one comes forward: full opacity, a touch bigger, and a little extra tilt.
//
// REWRITTEN 2026-08-13 against the PM's model, and this was not a copy-polish pass — five of the ten
// had become false statements. The old set promised per-job consent ("Skip or decline any job,
// anytime", "Take on as many jobs as you want", "See what a job pays before you accept"), narrated
// the engagement mechanic the brief removes ("You approve every comment before it posts"), and got
// the payment terms wrong ("Get paid within days of it clearing" — it is PayPal, monthly). The PM's
// list never mentioned these cards, because they are low-opacity decoration at the hero's edges; a
// decorative card still makes a claim, so leaving them would have left five of them lying. Every
// line below traces to something in the brief: the four How It Works steps, or an FAQ answer.
const EDGE_CARDS = [
  { text: 'Works from a few hundred subscribers up', side: 'left' as const, top: 60, offset: -10, rot: -7, scale: 0.94 },
  { text: 'No experience or portfolio needed', side: 'left' as const, top: 150, offset: 6, rot: -2, scale: 1 },
  { text: 'Runs on your own computer, not the cloud', side: 'left' as const, top: 240, offset: -14, rot: -5, scale: 0.9 },
  { text: 'You can see every campaign it runs', side: 'left' as const, top: 330, offset: 2, rot: -3, scale: 0.96 },
  { text: 'Stop it whenever you want', side: 'left' as const, top: 420, offset: -18, rot: -6, scale: 0.9 },
  { text: 'No pitching, no negotiating', side: 'right' as const, top: 60, offset: -14, rot: 7, scale: 0.94 },
  { text: 'A fixed amount per job, known up front', side: 'right' as const, top: 150, offset: 4, rot: 2, scale: 1 },
  { text: 'Paid by PayPal at the end of each month', side: 'right' as const, top: 240, offset: -16, rot: 5, scale: 0.9 },
  { text: 'Setup takes about twenty minutes', side: 'right' as const, top: 330, offset: 0, rot: 3, scale: 0.96 },
  { text: 'Campaigns matched to your channel', side: 'right' as const, top: 420, offset: -20, rot: 6, scale: 0.9 },
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

// Rendered only while signed OUT — CreatorsTop.tsx swaps this whole section for the application once
// you're in. Nothing here needs to know that; it just no longer owns the page top unconditionally.
export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden px-6 pb-24 pt-10 sm:pt-14">
      <PixelRain className="z-0" />

      <div className="absolute inset-0 z-0" aria-hidden="true">
        {EDGE_CARDS.map((c) => <EdgeCard key={c.text} c={c} />)}
      </div>

      <div className="relative z-[1] mx-auto flex max-w-[1380px] flex-col items-center text-center">
        <Reveal className="flex flex-col items-center">
          {/* The PM's headline and sub-headline, verbatim. "social accounts" is plural and
              forward-looking while the product is YouTube-only today — that is the PM's call, and the
              Platforms section a screen below states the actual scope, so the page does not leave the
              claim unqualified. */}
          <h1 className="max-w-[820px] font-head text-5xl font-bold tracking-tight-2 text-ink-display sm:text-6xl">
            An AI that turns your social accounts{' '}
            <span className="text-gradient italic inline-block pr-[0.2em]">into income.</span>
          </h1>
          <p className="bai-body-lg mx-auto mt-5 max-w-[660px]">
            BlueAI matches you with real brand campaigns, completes them on your account from your own
            PC, and pays you.
          </p>
        </Reveal>

        {/* Was the handle-lookup pill and its "See your earnings" submit — removed per the PM (item
            1), along with the whole earnings-estimate flow behind it (the scan dialog, the reveal,
            the manual-details fallback and estimate.ts). The application IS the entry point now, so
            a second, competing entry point that answered a different question had to go rather than
            sit beside it. */}
        <Reveal delay={0.15} className="mt-12">
          <ApplyButton />
        </Reveal>

        <Reveal delay={0.25} className="mt-12 w-full max-w-[1240px] overflow-hidden">
          <TiltImage className="-mt-[1%]">
            <Image
              id="hero-image"
              // v5, 2026-08-13. Draws none of the engagement mechanics the brief rules out — no eye,
              // heart, speech bubble or repost arrow — and carries no baked text, numbers or logos.
              // WebP q90 rather than the supplied PNG: 1.59 MB -> 0.118 MB, on a `priority` image that
              // gates this page's LCP. Original preserved outside the repo as
              // step-images-v3/creator-00-hero-v5.png.
              //
              // TWO SEPARATE EDGE PROBLEMS WERE FIXED HERE, and keeping them apart is the useful part
              // of this note, because the wrong fix was available and tempting for both.
              //
              // 1. THE SUBJECT AGAINST THE FRAME (v3). v3 ran the subject and a shelving unit hard
              //    into the left edge: -43 units raw, compositing to -18.7 against the page — a
              //    visible vertical step where her arm simply stopped. heroImageMask.ts leaves the
              //    side edges at ~0.69 alpha deliberately and says why: the side delta measured only
              //    1-3 units on the assets it was tuned against. So v3 broke the mask's premise; it
              //    did not reveal a mask bug. Tightening rx would have moved the brands hero too (the
              //    mask is shared) and faded the subject further in. Fixed by the ASSET insetting its
              //    subject, from v4 on.
              //
              // 2. THE BACKGROUND AGAINST THE PAGE (v4 and v5 both). Both arrived with a ~253
              //    background against this route's 249/249/250 page, and the designer reported white
              //    bands down the left and right edges. The mask cannot help: horizontally its alpha
              //    bottoms out at 0.686 and NEVER reaches 0, so a background brighter than the page
              //    stays at least 69% present all the way out. Vertically ry=52% DOES reach 0, which
              //    is exactly why only the sides showed it. layout.tsx's page colour was SAMPLED from
              //    the original artwork, so any new asset with a different background breaks the
              //    premise the whole no-seam system rests on.
              //    Fixed in the ASSET: a linear per-channel scale (measured bg -> page colour, 0 -> 0)
              //    baked into the WebP, landing the background on the page exactly and darkening
              //    everything else by a uniform 1.47%. v5's edge delta went +3.0 -> -0.23 / -1.46.
              //    NOT a blend mode — a multiply on an asset BRIGHTER than the page manufactures the
              //    very seam it gets reached for, the mistake already on record in blueai/CLAUDE.md.
              //    NOT the mask — shared with the brands hero, whose own background measures -0.86 at
              //    the edge and is correctly inside tolerance.
              //
              // IF THIS ASSET IS EVER REPLACED, RE-MEASURE BOTH. Sample the corner background against
              // the page colour, and check the mid-height composite at x=0 and x=20. A new hero has
              // now broken one or other of these three times running.
              src="/creator-brand/creator-00-hero.webp"
              alt="A woman at a laptop with brand campaign cards, a month calendar and a wallet floating beside her."
              width={1672}
              height={941}
              priority
              className="h-auto w-full"
              // Same mask as the brands hero — see heroImageMask.ts. This asset's own background
              // delta measured WORSE than the brands one (up to 8.7 luma units near the bottom
              // edge), so it carried the identical hard-seam bug even though nobody had flagged
              // it here yet.
              style={{ maskImage: HERO_IMAGE_MASK, WebkitMaskImage: HERO_IMAGE_MASK }}
            />
          </TiltImage>
        </Reveal>
      </div>
    </section>
  )
}
