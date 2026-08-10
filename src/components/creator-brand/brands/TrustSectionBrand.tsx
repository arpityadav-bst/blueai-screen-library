import Reveal from '../Reveal'

// Rebalanced like the creators trust cards and the step cards. These sit three-up in
// max-w-content, so each card has ~329px of text: ~37 characters per title line and ~47 per
// body line. Before this the titles ran 23/40/27 — the middle one wrapped to two lines while
// its neighbours held one — and the bodies 107/78/75 (3/2/2 lines). One card was carrying half
// again as much copy as the others, which is what made the row read as uneven rather than as
// three peers. Now titles are 23/22/27 (all one line) and bodies 77/71/70 (a 7-character
// spread, all two lines).
//
// Three copy changes, none of them purely mechanical:
//   - 'Every engagement is checked, not assumed' became 'Checked, never assumed'. The punch was
//     always in the second half, and 'every engagement' is what the body says next anyway.
//   - 'every single interaction' became 'every interaction', matching how the same claim is
//     worded in the pricing table and in the steps, so the three stop each phrasing it
//     differently.
//   - 'how much engagement is rolling in, in real time' had a real stumble in it ('in, in') and
//     duplicated step 04's line almost exactly. Recast onto what a brand actually wants from a
//     live view: where the money is going.
const POINTS = [
  { title: 'A real pool of creators', body: 'Thousands of creators are waitlisted and ready for jobs like yours at launch.' },
  { title: 'Checked, never assumed', body: 'BlueAI verifies every interaction before a dollar of your budget moves.' },
  { title: 'Live status, the whole time', body: 'See exactly where your budget is going, and on what, while it happens.' },
]

export default function TrustSectionBrand() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal className="flex flex-col items-center text-center">
          <h2 className="max-w-[30ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">
            3,100+ creators are already
            <span className="block text-gradient italic pr-[0.2em]">working jobs today.</span>
          </h2>
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-3">
          {POINTS.map((p) => (
            <div key={p.title} data-reveal-item className="rounded-chat border border-stroke-warm bg-white p-6 transition-all duration-base ease-out-bai hover:-translate-y-1 hover:shadow-float">
              <h3 className="font-head text-[18px] font-semibold text-ink-display">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-body-2">{p.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
