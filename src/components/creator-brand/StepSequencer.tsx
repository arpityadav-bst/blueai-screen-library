'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from './Reveal'
import StepBeat from './StepBeat'
import StepSplit from './StepSplit'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export type SequencerStep = {
  n: string
  title: string
  body: string
  img: string
  alt: string
  /** rgba() string for the glow blob behind this step's image — pick from the on-brand
   *  set (iris / cyan / blue / cta-mid), never an arbitrary hue. */
  glow: string
}

type Props = {
  /** The big opening line — same treatment as the hero H1: huge, bold, with a
   *  text-gradient italic span on the key phrase. Pass it exactly like the hero does. */
  heading: React.ReactNode
  steps: SequencerStep[]
}

/**
 * v4 — a real GSAP timeline, not hand-rolled per-frame opacity math. One pinned area;
 * a single `gsap.timeline({ scrollTrigger: { pin, scrub } })` sequences every actor
 * (the title, then each step's text and image) with the position parameter, per the
 * gsap-scrolltrigger/gsap-timeline skills' own guidance: ScrollTrigger goes on the
 * TIMELINE, never on tweens inside it.
 *
 * The motion, exactly as described: the title holds, then fades out while drifting up.
 * Each step's TEXT (left) fades/slides in on the same up-motion, then its IMAGE (right)
 * follows ~0.2s behind ("<0.2" — starts 0.2s after the text tween starts, not after it
 * ends). Both hold, then exit together on the same up-motion before the next step's
 * text begins. Title and every step share one direction of travel throughout.
 *
 * Two hard opt-outs, resolved via `isPinned` BEFORE any ScrollTrigger/timeline is
 * created: below `lg` (no room for the split layout, and pinning fights touch scroll)
 * and `prefers-reduced-motion`. Both render every step stacked in normal flow instead,
 * arriving via the shared `Reveal stagger` — not a lesser fallback, and not four
 * permanently-invisible nodes (the timeline's resting state for steps 1+ is opacity 0,
 * so skipping this branch would hide them forever on mobile).
 */
export default function StepSequencer({ heading, steps }: Props) {
  const pinRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setIsPinned(wide && !reduce)
  }, [])

  useEffect(() => {
    const pin = pinRef.current
    const title = titleRef.current
    if (!pin || !title || !isPinned) return

    const n = steps.length
    const RISE = 44 // px each actor travels while fading — the "little upside" drift
    const DUR = 1

    const ctx = gsap.context(() => {
      gsap.set(title, { opacity: 1, y: 0 })
      textRefs.current.forEach((el) => el && gsap.set(el, { opacity: 0, y: RISE }))
      imageRefs.current.forEach((el) => el && gsap.set(el, { opacity: 0, y: RISE }))

      const tl = gsap.timeline({
        defaults: { duration: DUR, ease: 'power2.out' },
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          // 80%/label: a normal gesture didn't reach the midpoint, so it snapped
          // straight back ("title comes back"). 30%/label overcorrected: a gesture now
          // covered MORE than one label's distance, so it skipped past the next one
          // entirely ("scroll 2 points"). 45% is the middle — sized to roughly one wheel
          // tick / one trackpad swipe, not a fraction or a multiple of it.
          end: `+=${(n + 1) * 45}%`,
          pin: true,
          // Transform-pin: the route wrapper carries overflow-x-clip (layout.tsx), and
          // overflow:clip clips position:fixed descendants — transform pinning is immune.
          pinType: 'transform',
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Was 0.6 — that much smoothing lag means the frame you SEE lags behind where
          // your scroll actually is, which is exactly what "the animation doesn't match
          // the scroll amount" describes. 0.2 keeps a touch of smoothing (a hard 1:1 via
          // scrub:true reads as mechanical) without the visible lag.
          scrub: 0.2,
          // Scrub still drives the motion (so it FOLLOWS the scroll gesture while it's
          // happening), but releasing the scroll now settles to the nearest labeled
          // state instead of resting wherever the wheel stopped — no more landing
          // mid-fade between two steps. `snapTo: 'labels'` reads the labels added below.
          snap: { snapTo: 'labels', duration: { min: 0.15, max: 0.4 }, ease: 'power1.inOut', directional: true },
        },
      })

      // Title holds a beat, then fades out on the same upward drift every step will use.
      tl.addLabel('title', 0)
      tl.to(title, { opacity: 0, y: -RISE }, '+=0.6')

      steps.forEach((_, i) => {
        const text = textRefs.current[i]
        const img = imageRefs.current[i]
        if (!text || !img) return
        const isLast = i === steps.length - 1
        // Text arrives; image follows 0.2s later on its OWN start (not after text
        // finishes) — a stagger, not a relay. Both travel the same up-fade path.
        tl.to(text, { opacity: 1, y: 0 })
        tl.to(img, { opacity: 1, y: 0 }, '<0.2')
        // Labeled right as both actors finish entering — this, not an arbitrary
        // fraction of the timeline, is the point each snap settles to.
        tl.addLabel(`step${i}`)
        tl.to({}, { duration: 0.7 }) // held, fully visible — a beat to actually read it
        // Every step EXCEPT the last fades/drifts out to make room for the next one.
        // The last step doesn't — the pin simply releases once its hold ends, so the
        // page's own scroll carries it away upward, same as any normal section. That
        // reads as "the section scrolls up," not a fourth fade — and it's the correct
        // handoff back into normal flow (CommentApprovalDemo, right after this).
        if (!isLast) tl.to([text, img], { opacity: 0, y: -RISE })
      })
    }, pin)
    return () => ctx.revert()
  }, [isPinned, steps.length])

  return (
    <>
      {isPinned ? (
        <div ref={pinRef} className="cb-seq-pin">
          <div ref={titleRef} className="cb-seq-frame">
            <div className="mx-auto flex max-w-[820px] flex-col items-center px-6 text-center">
              <h2 className="font-head text-5xl font-bold text-ink-display sm:text-6xl">{heading}</h2>
            </div>
          </div>
          {steps.map((s, i) => (
            <div key={s.n} className="cb-seq-frame">
              <StepSplit
                step={s}
                index={i}
                textRef={(el) => {
                  textRefs.current[i] = el
                }}
                imageRef={(el) => {
                  imageRefs.current[i] = el
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="cb-beat">
            <Reveal className="mx-auto flex max-w-[820px] flex-col items-center text-center">
              <h2 className="font-head text-5xl font-bold text-ink-display sm:text-6xl">{heading}</h2>
            </Reveal>
          </div>
          <div className="flex flex-col gap-16 px-6 py-16">
            {steps.map((s, i) => (
              <Reveal key={s.n} stagger>
                <StepBeat step={s} index={i} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </>
  )
}
