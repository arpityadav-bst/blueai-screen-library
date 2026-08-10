import Reveal from '../Reveal'

const POINTS = [
  { title: 'A real pool of creators', body: 'Thousands of creators are already waitlisted and ready to engage with jobs like yours the moment we launch.' },
  { title: 'Every engagement is checked, not assumed', body: 'BlueAI verifies every single interaction before a dollar of your budget moves.' },
  { title: 'Live status, the whole time', body: 'See how much engagement is rolling in, in real time, as your budget spends.' },
]

export default function TrustSectionBrand() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal className="flex flex-col items-center text-center">
          <h2 className="max-w-[30ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">
            3,100+ creators are already working jobs today.
          </h2>
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-3">
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
