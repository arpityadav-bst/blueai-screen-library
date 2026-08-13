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
  // 'waitlisted' -> 'approved' (2026-08-13): creators apply and are selected now, so nobody is on
  // a list. 69 characters against siblings at 70 and 69, so the three still wrap alike.
  { title: 'A real pool of creators', body: 'A growing pool of approved creators is ready for campaigns like yours.' },
  { title: 'Checked, never assumed', body: 'BlueAI verifies every interaction before a dollar of your budget moves.' },
  { title: 'Live status, the whole time', body: 'See exactly where your budget is going, and on what, while it happens.' },
]

export default function TrustSectionBrand() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal className="flex flex-col items-center text-center">
          <h2 className="max-w-[30ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">
            {/* THE INVENTED NUMBER IS GONE (2026-08-13). "3,100+ creators are already working jobs
                today" was the surviving half of a pair — its twin, the 12,400+/3,100+ stat panel on
                the creators page, went with the trust section the PM cut. Neither figure was ever
                backed by anything, and a social-proof count is the one number on a pre-launch page a
                reader takes literally. Replaced with a claim the product can actually stand behind:
                every applicant is reviewed before they can touch a campaign, which is a stronger
                thing to tell a brand than a headcount anyway.

                Two complete clauses, one per line — the section-title rule from 2026-08-11 — so the
                accent line can't orphan and the heading is pinned to two lines. Both sit under this
                h2's 30ch box. */}
            Every creator is approved first.
            <span className="block text-gradient italic pr-[0.2em]">Then matched to your campaign.</span>
          </h2>
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-3">
          {POINTS.map((p) => (
            <div key={p.title} data-reveal-item className="rounded-chat border border-divider bg-white p-6 transition-all duration-base ease-out-bai hover:-translate-y-1 hover:shadow-float">
              <h3 className="font-head text-[18px] font-semibold text-ink-display">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-body-2">{p.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
