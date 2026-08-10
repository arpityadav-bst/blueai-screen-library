import Reveal from '../Reveal'

const ROWS = [
  { label: 'What you pay for', old: 'Follower count', bai: 'A flat rate per verified engagement' },
  { label: 'Who you reach', old: 'One large influencer', bai: 'Thousands of real accounts, spread out' },
  { label: 'How it feels to viewers', old: 'Reads as an ad', bai: 'Reads as real engagement' },
  { label: 'Negotiating rates', old: 'Back-and-forth over email/DM', bai: 'You set the budget and window, that’s it' },
  { label: 'Checking the work happened', old: 'Manual, on trust', bai: 'BlueAI verifies every single interaction' },
  { label: 'Paying out', old: 'Invoices, manual transfers', bai: 'Automatic, only when the engagement clears' },
]

export default function OutcomePricing() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <p className="bai-eyebrow uppercase text-iris">Pricing model</p>
          <h2 className="mt-3 max-w-[20ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">
            One flat rate, split across as many creators as your budget allows.
          </h2>
          <p className="bai-body mt-4 max-w-[48ch] text-ink-body-2">
            Set a total budget and a campaign window. BlueAI divides it across real people who
            genuinely engage with your video — and only pays out once each one is verified.
          </p>
        </Reveal>

        <Reveal className="mt-12 overflow-hidden rounded-chat border border-stroke-warm bg-white">
          <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-divider bg-canvas px-6 py-4 text-[12px] font-semibold uppercase tracking-label text-ink-muted">
            <span />
            <span>The old way</span>
            <span className="text-iris">With BlueAI</span>
          </div>
          {ROWS.map((r) => (
            <div key={r.label} className="grid grid-cols-[1.1fr_1fr_1fr] items-center border-b border-divider px-6 py-4 last:border-b-0">
              <span className="text-[14px] font-medium text-ink-heading">{r.label}</span>
              <span className="pr-4 text-[13px] text-ink-muted line-through decoration-stroke-warm">{r.old}</span>
              <span className="text-[13px] font-medium text-ink-heading">{r.bai}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
