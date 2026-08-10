import Image from 'next/image'
import type { SequencerStep } from './StepSequencer'

type Props = {
  step: SequencerStep
  index: number
  textRef: (el: HTMLDivElement | null) => void
  imageRef: (el: HTMLDivElement | null) => void
}

/**
 * One step's split layout for the pinned crossfade: text left, image right. Each side
 * gets its own ref so StepSequencer's GSAP timeline can animate them as two distinct
 * actors (text enters, then image enters slightly after — the "text then image, same
 * up-motion" the designer described) rather than one block fading as a unit.
 */
export default function StepSplit({ step, index, textRef, imageRef }: Props) {
  return (
    <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
      {/* opacity:0 is the SSR-safe default for BOTH refs GSAP actually animates — every
          step (including the first) starts hidden behind the title, per the new
          sequence. This must live on the elements the timeline targets, not on an
          ancestor: an ancestor stuck at opacity:0 hides the subtree regardless of what
          GSAP later does to its children, which is exactly what made every step
          disappear once (see git history on this file). */}
      <div ref={textRef} className="text-center lg:text-left" style={{ opacity: 0 }}>
        <span className="cb-tabular font-head text-[14px] font-semibold uppercase tracking-label text-iris">
          Step {step.n}
        </span>
        <h3 className="mt-3 font-head text-4xl font-bold text-ink-display sm:text-5xl">{step.title}</h3>
        <p className="bai-body-lg mx-auto mt-5 max-w-[44ch] text-ink-body-2 lg:mx-0">{step.body}</p>
      </div>

      <div
        ref={imageRef}
        className="relative mx-auto flex h-[50vh] min-h-[340px] w-full max-w-[520px] items-center justify-center"
        style={{ opacity: 0 }}
      >
        <div className="cb-beat-glow" style={{ '--glow': step.glow } as React.CSSProperties} aria-hidden="true" />
        <Image
          src={step.img}
          alt={step.alt}
          fill
          sizes="(min-width: 1024px) 520px, 80vw"
          priority={index === 0}
          className="relative object-contain"
          style={{
            maskImage: 'radial-gradient(ellipse 62% 62% at center, black 45%, transparent 88%)',
            WebkitMaskImage: 'radial-gradient(ellipse 62% 62% at center, black 45%, transparent 88%)',
          }}
        />
      </div>
    </div>
  )
}
