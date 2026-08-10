import Reveal from '../Reveal'
import { CBLinkButton } from '../Button'

// Colors were #2F6DFF / #16A34A (green) / #7B4CFF / #F97316 (orange) — two of those are
// off the brand's iris/cyan/blue system. These are our own mock avatars, not real brand
// marks to respect, so all four move onto the same on-brand set as everything else.
const JOBS = [
  { brand: 'Fernweh Coffee', color: '#2F6DFF', task: 'Watch our cold-brew launch video and leave a genuine reaction', pay: 7, claimed: 62, target: 100 },
  { brand: 'Loop Running Co.', color: '#0EA4C5', task: 'Watch our new trail-shoe review and share your take', pay: 6, claimed: 118, target: 150 },
  { brand: 'Nettle & Sage', color: '#7B4CFF', task: 'Watch our SPF stick demo end to end and share your thoughts', pay: 8, claimed: 30, target: 80 },
  { brand: 'Pixel Pantry', color: '#6b53ff', task: 'Watch our meal-kit unboxing and ask a question in the comments', pay: 5, claimed: 44, target: 60 },
]

export default function JobsPreview() {
  return (
    <section id="jobs" className="relative px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <h2 className="font-head text-3xl font-bold text-ink-display sm:text-4xl">
            Real brands. Real budgets. Open right now.
          </h2>
          <p className="bai-body mt-4 max-w-[56ch] text-ink-body-2">
            Every job pays a flat rate, and only reaches you if it fits what you already watch.
          </p>
        </Reveal>

        {/* The fade was a flat --bai-canvas (white) gradient painted OVER the cards —
            fine while the page background was flat white, but the ambient Backdrop
            (orbs + grain, visible once scrolled past the hero) means the true
            background here is no longer flat, so a flat-color scrim reads as a
            mismatched hard-edged rectangle rather than a fade. Masking the cards
            themselves to transparency instead lets whatever's ACTUALLY behind them —
            correct, live backdrop and all — show through, since it's genuine
            transparency rather than a painted approximation of one color. */}
        <div
          className="relative mt-12"
          style={{
            maskImage: 'linear-gradient(to top, transparent, black 45%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent, black 45%)',
          }}
        >
          <Reveal stagger className="grid gap-4 sm:grid-cols-2">
            {JOBS.map((j) => {
              const pct = Math.round((j.claimed / j.target) * 100)
              return (
                <div key={j.brand} data-reveal-item className="rounded-chat border border-stroke-warm bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-circle text-[12px] font-bold text-white"
                        style={{ background: j.color }}
                      >
                        {j.brand[0]}
                      </span>
                      <span className="text-[14px] font-semibold text-ink-heading">{j.brand}</span>
                    </div>
                    <span className="rounded-pill bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink-muted">YouTube</span>
                  </div>
                  <p className="mt-3 text-[14px] leading-snug text-ink-body-2">{j.task}</p>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[12px] text-ink-muted">
                      <span>{j.claimed}/{j.target} claimed</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-pill bg-canvas">
                      <div className="h-full rounded-pill bg-bai-gradient" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-divider pt-4">
                    <div className="font-head text-[20px] font-semibold text-ink-display">${j.pay}</div>
                    <span
                      title="Join the waitlist to unlock"
                      className="flex cursor-not-allowed items-center gap-1.5 text-[12px] font-medium text-ink-muted"
                    >
                      🔒 Accept
                    </span>
                  </div>
                </div>
              )
            })}
          </Reveal>
        </div>

        <Reveal className="mt-6 flex flex-col items-center gap-3 text-center">
          <p className="text-[14px] text-ink-body-2">
            This is a live preview of the board — you&apos;ll be able to accept jobs once BlueAI opens.
          </p>
          <CBLinkButton href="#waitlist" size="lg">Join the waitlist to unlock jobs</CBLinkButton>
        </Reveal>
      </div>
    </section>
  )
}
