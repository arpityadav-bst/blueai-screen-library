import Reveal from '../Reveal'

const STEPS = [
  { n: '01', title: 'Post the job', body: 'Tell us your goal, your budget, and a window — takes a couple of minutes.' },
  { n: '02', title: 'BlueAI matches creators', body: 'Thousands of waitlisted accounts pick up the job themselves — no outreach from you.' },
  { n: '03', title: 'Real engagement, verified', body: 'Each creator genuinely engages with your video, and BlueAI confirms every single one before it counts.' },
  { n: '04', title: 'You watch it run, live', body: 'See the engagement roll in — in real time, from your budget, until the window closes.' },
]

export default function HowItWorksBrand() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <h2 className="max-w-[36ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">
            No PR team. No negotiating. No chasing invoices.
          </h2>
          <p className="bai-body mt-4 max-w-[58ch] text-ink-body-2">
            Everything that normally takes a manager, a brief deck, and a dozen emails happens
            inside BlueAI instead — you set the terms once, and the AI runs the rest.
          </p>
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} data-reveal-item className="rounded-chat border border-stroke-warm bg-white p-6">
              <span className="font-head text-[13px] font-medium text-ink-muted">{s.n}</span>
              <h3 className="font-head text-[19px] font-semibold text-ink-display">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-body-2">{s.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
