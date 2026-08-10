import Reveal from '../Reveal'
import { CBLinkButton } from '../Button'

export default function ClosingCTA() {
  return (
    <section className="px-6 pb-24 pt-24">
      <Reveal className="mx-auto max-w-content" as="div">
        <div className="overflow-hidden rounded-credits bg-cta-band px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-[24ch] font-head text-3xl font-bold text-white sm:text-4xl">
            Your first job could be live the day we launch.
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[15px] text-white/70">
            Set the terms now — BlueAI starts matching creators to it the moment jobs open up.
          </p>
          <div className="mt-8 flex justify-center">
            <CBLinkButton href="#post-a-job" size="lg" variant="secondary" className="!border-transparent !bg-white !text-ink-display">
              Post a job
            </CBLinkButton>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
