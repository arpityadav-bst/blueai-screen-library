import Reveal from '../Reveal'
import PricingTable from './PricingTable'

// The section stays on the page; only the hero's "See how pricing works" link changed — it opens
// the same table in a dialog now instead of scrolling here. The table itself moved to
// PricingTable.tsx so both render one copy of it.
export default function OutcomePricing() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal className="text-center">
          {/* max-w widened from 20ch. At 20ch this 51-character sentence was forced into THREE
              lines at 42px, which is what made the section read as cramped before anything else
              about it did. 28ch lets `text-wrap: balance` settle it into two even lines. */}
          <h2 className="mx-auto max-w-[34ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">
            One flat rate.
            <span className="block text-gradient italic pr-[0.2em]">As many creators as your budget buys.</span>
          </h2>
          {/* Was 158 characters in a 48ch column — three lines, one of them a stub. Trimmed to
              ~120 and widened to 60ch so it lands in two. "divides it across" became "spreads it
              across" and the doubled "once each one is verified" collapsed; the claim is
              unchanged. */}
          <p className="bai-body-lg mx-auto mt-4 max-w-[60ch] text-ink-body-2">
            Set a budget and a campaign window. BlueAI spreads it across real people and pays out
            only as each engagement is verified.
          </p>
        </Reveal>

        {/* rounded-credits + shadow-float instead of rounded-chat + a bare border: this is the
            largest single object on the page and it was sitting flatter than the 3-up trust cards
            below it. */}
        <Reveal className="mt-14 overflow-hidden rounded-credits border border-stroke-warm bg-white shadow-float">
          <PricingTable />
        </Reveal>
      </div>
    </section>
  )
}
