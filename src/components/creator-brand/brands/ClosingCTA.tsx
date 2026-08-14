import Reveal from '../Reveal'
import CTABand from '../CTABand'
import { ModalCTA } from '../OpenModal'

export default function ClosingCTA() {
  return (
    <section className="px-6 pb-24 pt-24">
      <Reveal className="mx-auto max-w-content" as="div">
        <CTABand>
          <h2 className="mx-auto max-w-[28ch] font-head text-3xl font-bold text-white sm:text-4xl">
            Your first campaign could be
            <span className="cb-text-gradient-dark block italic pr-[0.2em]">live the day we launch.</span>
          </h2>
          {/* Was an off-token text-[15px]. Now bai-body-lg like every other lead;
              text-white/80 still wins over the class's own color because utilities outrank
              @layer components. */}
          <p className="bai-body-lg mx-auto mt-4 max-w-[46ch] text-white/80">
            Set the terms now. BlueAI starts matching creators to it the moment we go live.
          </p>
          <div className="mt-8 flex justify-center">
            {/* min-w matches the hero's own "Create a campaign" button (Hero.tsx), the pill was
                hugging its short label and reading small against this section's own
                16-radius band and 60px vertical padding, the same fix already applied there. */}
            <ModalCTA
              kind="campaign"
              size="lg"
              variant="secondary"
              // The band pays px-6 (section) + px-8 (CTABand) = 112px, so at 320 there are 208px for a 240px
          // min-width — and CTABand is overflow-hidden, so it was clipped rather than scrolled.
          className="w-full max-w-[280px] sm:w-auto sm:min-w-[240px] !border-transparent !bg-white !text-ink-display"
            >
              Create a campaign
            </ModalCTA>
          </div>
        </CTABand>
      </Reveal>
    </section>
  )
}
