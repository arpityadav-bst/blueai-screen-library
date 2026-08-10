import Image from 'next/image'
import type { SequencerStep } from './StepSequencer'

/**
 * Pure content for one step — no outer positioning, no entrance animation of its own.
 * StepSequencer decides how it's staged: absolutely stacked and crossfaded by GSAP on
 * desktop, or normal-flow inside a `<Reveal stagger>` on the reduced-motion/mobile
 * fallback. `data-reveal-item` markers are harmless without a Reveal ancestor, so this
 * same markup works unmodified in both modes.
 */
export default function StepBeat({ step, index }: { step: SequencerStep; index: number }) {
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center text-center">
      <div data-reveal-item className="relative flex h-[42vh] min-h-[280px] w-full items-center justify-center">
        <div className="cb-beat-glow" style={{ '--glow': step.glow } as React.CSSProperties} aria-hidden="true" />
        <Image
          src={step.img}
          alt={step.alt}
          fill
          sizes="(min-width: 1024px) 560px, 90vw"
          priority={index === 0}
          className="relative object-contain"
          style={{
            maskImage: 'radial-gradient(ellipse 62% 62% at center, black 45%, transparent 88%)',
            WebkitMaskImage: 'radial-gradient(ellipse 62% 62% at center, black 45%, transparent 88%)',
          }}
        />
      </div>

      <span data-reveal-item className="cb-tabular mt-6 font-head text-[13px] font-semibold uppercase tracking-label text-iris">
        Step {step.n}
      </span>
      <h3 data-reveal-item className="mt-2 font-head text-3xl font-bold text-ink-display sm:text-4xl">
        {step.title}
      </h3>
      <p data-reveal-item className="bai-body mt-4 max-w-[42ch] text-ink-body-2">
        {step.body}
      </p>
    </div>
  )
}
