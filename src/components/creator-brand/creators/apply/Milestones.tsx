// The application's journey strip — Apply → We review → Install & earn — rendered above the form
// card, and above the confirmation band once submitted, with "We review" lit. It exists because the
// form alone didn't tell a new applicant what the process is (PM feedback, 2026-08-14): the review
// stage and the invite email were only discoverable in the How It Works section below the fold, and
// an applicant on step 1 had no picture of what happens after Submit. This is that picture, in the
// same three beats HowItWorks.tsx spells out at length.
//
// THREE steps, not four. An "Invite email" step between review and install was drafted and cut
// (PM, 2026-08-14): the email is how "We review" ends, not a stage the applicant does anything in,
// and a four-dot strip where one dot is somebody else's action reads as longer than the process is.
// And NO accepted/final state here at all — an accepted creator signing in is routed to the
// dashboard, never back to this page, so a lit third dot is a state this strip can never truthfully
// show.
//
// Visual language is borrowed, not invented: filled dots use the same bg-bai-gradient as the form's
// own Rail segments, the active ring is the --cb-accent selection treatment ChoiceGroup/CheckField
// already use, and pending sits on --cb-track/divider like every other inert track on this page.
const STEPS = ['Apply', 'We review', 'Install & earn'] as const

export default function Milestones({ stage }: { stage: 'filling' | 'submitted' }) {
  const active = stage === 'filling' ? 0 : 1
  return (
    <ol aria-label="How the program starts" className="mx-auto mb-6 flex max-w-[400px]">
      {STEPS.map((label, i) => (
        <li key={label} aria-current={i === active ? 'step' : undefined} className="relative flex-1 text-center">
          {/* Connector to the PREVIOUS dot — absent on the first. The line STOPS 22px short of each
              dot's center (14px dot radius + the active ring's 4px + 4px of air) instead of running
              full-bleed underneath: a full-span line painted over the previous li's dot (positioned
              elements stack in DOM order, and this li comes later), which put a line through its
              number — and showed through the active ring's translucent wash besides (PM caught both,
              2026-08-14). Stopping short fixes the stacking AND the wash in one move, with no
              z-index bookkeeping. */}
          {i > 0 && (
            <span
              aria-hidden
              className={`absolute left-[calc(-50%+22px)] right-[calc(50%+22px)] top-[13px] h-0.5 ${
                i <= active ? 'bg-bai-gradient' : 'bg-[var(--cb-track)]'
              }`}
            />
          )}
          <span
            className={`relative inline-flex h-7 w-7 items-center justify-center rounded-circle text-[11px] font-semibold ${
              i < active
                ? 'bg-bai-gradient text-white'
                : i === active
                  ? 'border border-[rgba(var(--cb-accent-rgb),0.38)] bg-white text-[var(--cb-accent)] ring-4 ring-[rgba(var(--cb-accent-rgb),0.08)]'
                  : 'border border-divider bg-white text-ink-muted'
            }`}
          >
            {i < active ? (
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4.5 12.5l5 5L19.5 6.5" />
              </svg>
            ) : (
              i + 1
            )}
          </span>
          <span className={`mt-1.5 block text-[11px] font-medium ${i === active ? 'text-ink-heading' : 'text-ink-muted'}`}>
            {label}
          </span>
        </li>
      ))}
    </ol>
  )
}
