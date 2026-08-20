// The application's journey strip — Apply → We review → Deploy & earn — rendered above the form
// card, and above the confirmation panel once submitted, with "We review" lit. Ported from
// creator-brand/creators/apply/Milestones.tsx (stage prop API unchanged); skin = the kit's .crx-mile
// family. It exists because the form alone didn't tell a new applicant what the process is (PM
// feedback, 2026-08-14): the review stage and the invite email were only discoverable below the
// fold, and an applicant on step 1 had no picture of what happens after Submit.
//
// THREE steps, not four. An "Invite email" step between review and install was drafted and cut
// (PM, 2026-08-14): the email is how "We review" ends, not a stage the applicant does anything in.
// And NO accepted/final state here at all — an accepted creator signing in is routed to the
// dashboard, never back to this page, so a lit third dot is a state this strip can never truthfully
// show.
//
// Visual language is borrowed, not invented (kit rules): done dots fill with --grad-bright like the
// form's own Rail segments, the current ring is the iris selection treatment the choices already
// use, and pending sits on the page's inert hairline.
// "Deploy & earn", not "Install & earn" (PM, 2026-08-20): the landing's step 03 is "Deploy it", so
// the strip and the page use one verb for the same moment.
const STEPS = ['Apply', 'We review', 'Deploy & earn'] as const

export default function Milestones({ stage }: { stage: 'filling' | 'submitted' }) {
  const active = stage === 'filling' ? 0 : 1
  return (
    <ol aria-label="How the program starts" className="crx-mile">
      {STEPS.map((label, i) => {
        const state = i < active ? ' done' : i === active ? ' current' : ''
        return (
          <li key={label} aria-current={i === active ? 'step' : undefined} className={`crx-mile-step${state}`}>
            {/* Connector to the PREVIOUS dot — absent on the first. The kit's .crx-mile-line stops
                22px short of each centre (the source's stacking fix): a full-span line painted over
                the previous li's dot and showed through the current ring's translucent wash — the
                short stop fixes both with no z-index bookkeeping. */}
            {i > 0 && <span aria-hidden className="crx-mile-line" />}
            <span className="crx-mile-dot">
              {i < active ? (
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4.5 12.5l5 5L19.5 6.5" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className="crx-mile-label">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
