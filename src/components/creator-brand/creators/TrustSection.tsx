import Reveal from '../Reveal'

const STATS = [
  { value: '12,400+', label: 'creators on the waitlist' },
  { value: '3,100+', label: 'already working jobs today' },
]

// Copy rebalanced the same way the step cards were: every title short enough to hold ONE line
// in a ~224px card body (≈22 characters at 18px semibold), and every body within ~11 characters
// of its siblings so all four wrap to the same count. Before this they ran 33/14/24/28 characters
// of title (2/1/1/2 lines) and 170/126/78/108 of body (5/4/3/4 lines), which is what made the row
// look ragged rather than like four peers.
//
// Two copy fixes that are not about length:
//   1. Card 4 said "Every comment shows up on your screen before it goes out under your name."
//      That states outright that BlueAI comments as the creator — the exact claim the whole
//      engagement-language pass removed from this site, and it survived here because this
//      section was never part of that sweep. Reworded to say the same reassuring thing (nothing
//      happens without your sign-off) without narrating the mechanic.
//   2. Card 2 used straight double quotes around "counts", the only ones on the page. The
//      sentence reads better without the scare quotes at all, so they're gone rather than
//      curled.
const POINTS = [
  {
    title: 'Matched to your taste',
    body: 'Not random job spam. BlueAI learns your interests, so every job fits what you’d watch anyway.',
  },
  {
    title: 'No admin, ever',
    body: 'No one decides by hand whether your work counts. BlueAI checks it against the job’s requirements.',
  },
  {
    title: 'You say yes first',
    body: 'Nothing is ever assigned to you. You see the job and the pay up front, then you choose.',
  },
  {
    title: 'You approve everything',
    body: 'Nothing goes out until you’ve seen it, unless you turn on auto-approve for jobs you trust.',
  },
]

export default function TrustSection() {
  return (
    <section id="trust" className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal className="flex flex-col items-center text-center">
          {/* This section had no h2 at all — eyebrow straight into raw numbers, which is
              why it read as starting mid-thought. */}
          <h2 className="max-w-[30ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">
            Nothing happens on your channel
            <span className="block text-gradient italic pr-[0.2em]">without you.</span>
          </h2>

          {/* The two numbers used to float bare under the heading with nothing holding them, which
              was most of why the section read as flat — they are the strongest proof on the page
              and had the least presence. Now they sit in one elevated panel, split by a hairline,
              with the values in the brand gradient. That gradient IS this section's accent: it's
              the same treatment every heading's italic span uses, so the emphasis lands inside the
              brand language instead of next to it.
              No text-colour utility on the value — .text-gradient works by making the text
              transparent and clipping a background to it, and any `text-*` utility outranks it
              (it lives in @layer components) and would paint the glyphs solid. */}
          <div className="mt-8 flex flex-col overflow-hidden rounded-credits border border-divider bg-white shadow-float sm:flex-row sm:divide-x sm:divide-divider">
            {STATS.map((s) => (
              <div key={s.label} className="px-10 py-5">
                <div className="cb-tabular font-head text-4xl font-bold text-gradient">{s.value}</div>
                <div className="mt-1 text-[13px] text-ink-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => (
            <div
              key={p.title}
              data-reveal-item
              // Hover lift + shadow on settle, matching the step cards and the platform cards.
              // These were the only cards on either page that were completely inert.
              className="rounded-chat border border-divider bg-white p-6 transition-all duration-base ease-out-bai hover:-translate-y-1 hover:shadow-float"
            >
              <h3 className="font-head text-[18px] font-semibold text-ink-display">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-body-2">{p.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
