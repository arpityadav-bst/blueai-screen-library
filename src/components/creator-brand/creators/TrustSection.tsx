import Reveal from '../Reveal'

const STATS = [
  { value: '12,400+', label: 'creators on the waitlist' },
  { value: '3,100+', label: 'already working jobs today' },
]

const POINTS = [
  { title: 'Matched to what you already watch', body: 'Not random job spam — BlueAI learns your interests, from a couple of quick questions or straight from your watch history, so every job actually fits what you’d watch anyway.' },
  { title: 'No admin, ever', body: 'There’s no person deciding whether your work "counts." BlueAI checks it against the job’s requirements, on screen, every time.' },
  { title: 'You always say yes first', body: 'Nothing is ever assigned to you. You see the job and the pay — and you choose.' },
  { title: 'You approve what gets posted', body: 'Every comment shows up on your screen before it goes out under your name, unless you switch on auto-approve.' },
]

export default function TrustSection() {
  return (
    <section id="trust" className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal className="flex flex-col items-center text-center">
          {/* This section had no h2 at all — eyebrow straight into raw numbers, which is
              why it read as starting mid-thought. */}
          <h2 className="max-w-[26ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">
            Nothing happens on your channel without you.
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-head text-3xl font-bold text-ink-display">{s.value}</div>
                <div className="text-[13px] text-ink-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => (
            <div key={p.title} data-reveal-item className="rounded-chat border border-stroke-warm bg-white p-6">
              <h3 className="font-head text-[18px] font-semibold text-ink-display">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-body-2">{p.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
