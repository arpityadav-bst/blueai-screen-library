import Reveal from '../Reveal'
import { CBLinkButton } from '../Button'

const JOBS = [
  { brand: 'Fernweh Coffee', color: '#2F6DFF', task: 'Watch our cold-brew launch video and leave a genuine reaction', pay: 7, claimed: 62, target: 100 },
  { brand: 'Loop Running Co.', color: '#16A34A', task: 'Watch our new trail-shoe review and share your take', pay: 6, claimed: 118, target: 150 },
  { brand: 'Nettle & Sage', color: '#7B4CFF', task: 'Watch our SPF stick demo end to end and share your thoughts', pay: 8, claimed: 30, target: 80 },
  { brand: 'Pixel Pantry', color: '#F97316', task: 'Watch our meal-kit unboxing and ask a question in the comments', pay: 5, claimed: 44, target: 60 },
]

export default function JobsPreview() {
  return (
    <section id="jobs" className="relative px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <p className="bai-eyebrow uppercase text-iris">Open right now</p>
          <h2 className="mt-3 font-head text-3xl font-bold text-ink-display sm:text-4xl">
            Brands are already paying for exactly this — real engagement.
          </h2>
          <p className="bai-body mt-4 max-w-[56ch] text-ink-body-2">
            Every open job pays a flat rate for genuinely engaging with a video — and only shows up
            if it fits what you&apos;re already into.
          </p>
        </Reveal>

        <div className="relative mt-12">
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

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent" />
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
