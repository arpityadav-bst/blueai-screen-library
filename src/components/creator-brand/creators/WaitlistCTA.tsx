import Reveal from '../Reveal'
import CTABand from '../CTABand'
import WaitlistForm from './WaitlistForm'

// THE final call. This is the one waitlist CTA that is NOT a popup (designer, 2026-08-11): every
// other "Join the waitlist" on the page opens the dialog, and this section is what the dialog is a
// copy of. The form itself moved to WaitlistForm.tsx so the two share it — same title, same field,
// same CTA, same grid, one implementation.
export default function WaitlistCTA() {
  return (
    <section id="waitlist" className="px-6 pb-24 pt-24">
      <Reveal className="mx-auto max-w-content" as="div">
        <CTABand>
          <h2 className="mx-auto max-w-[24ch] font-head text-3xl font-bold text-white sm:text-4xl">
            The jobs open soon.
            <span className="cb-text-gradient-dark block italic pr-[0.2em]">Be first in line.</span>
          </h2>
          {/* Was an off-token text-[15px] — a third lead size that existed nowhere else. Now
              bai-body-lg like every other lead; text-white/70 still wins over the class's own
              color because utilities outrank @layer components. */}
          <p className="bai-body-lg mx-auto mt-4 max-w-[46ch] text-white/70">
            Join 12,400+ creators waiting to start earning through BlueAI.
          </p>
          <WaitlistForm />
        </CTABand>
      </Reveal>
    </section>
  )
}
