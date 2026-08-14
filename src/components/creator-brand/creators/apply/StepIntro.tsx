// Split out of Steps.tsx on 2026-08-13 to keep that file under this project's 300-line rule — pure
// extraction, no behaviour change. Same reason Long.tsx and options.tsx were split out earlier.

import { CadenceIcon, ClockIcon, DocumentIcon, WalletIcon } from './introIcons'

// StepIntro's four points, each an icon + a sentence with the one number/name in it bolded. Data only,
// kept beside the component that reads it rather than in options.tsx — those are ChoiceGroup answer
// sets, these are static copy, a different shape entirely.
const INTRO_POINTS = [
  {
    icon: <CadenceIcon />,
    body: <>You&apos;ll need to complete at least <b className="font-semibold text-ink-heading">[X] jobs</b> every{' '}
      <b className="font-semibold text-ink-heading">[Y] days</b> using BlueAI.</>,
  },
  {
    icon: <ClockIcon />,
    body: 'Each job takes a few minutes; BlueAI does the work on your YouTube account inside BlueStacks.',
  },
  {
    icon: <WalletIcon />,
    body: <>You earn <b className="font-semibold text-ink-heading">$30 per month</b>, paid via PayPal.</>,
  },
  {
    icon: <DocumentIcon />,
    body: <>Applying means you accept the <u>Program Terms</u>.</>,
  },
]

// STEP 0. No fields, so it takes no Props — a static screen, not a question. Moved off StepOne
// (designer, 2026-08-13) where it briefly lived stacked above the age checkbox and the describes
// grid: that made step 1 by far the tallest of the four, which is the exact failure every other step
// in this file has spent several rounds getting away from — a big informational block has no business
// competing with real questions for the same fixed height budget. Its own screen can be as short as it
// naturally is; the shared floor pads it up like any other short step, which is what that floor is
// FOR, not a problem for it to cause.
export default function StepIntro() {
  return (
    // ABOUT THE PROGRAM (PM, 2026-08-13) — before the first question, literally: its own step, ahead
    // of step 1, so an applicant knows the shape of the commitment before answering anything rather
    // than discovering it after.
    // [X] and [Y] are left as the PM wrote them: real numbers for the job cadence weren't given, and a
    // guessed figure here would be a fabricated program term, not an illustrative one — this site's
    // dollar figures are illustrative by design, but a job-frequency requirement is a real obligation
    // an applicant is agreeing to. Fill in once the PM has the real numbers.
    //
    // NO SECOND "ABOUT THE PROGRAM" HEADING (fixed 2026-08-13) — this box used to repeat the step's
    // own title verbatim as its first line, so the screen said the same three words twice in the
    // first 80px. The step title above (Rail's row) already IS the heading; the box only needed to
    // hold the four points.
    //
    // ICON ROWS, NOT A BULLET LIST (2026-08-13, same fix) — a plain `<ul>` at 13px was the smallest
    // body text on the entire form for what is, structurally, the most important screen in it (it's
    // the one thing every applicant reads in full before anything else). Bigger text (15px) plus a
    // one-glyph-per-point layout gives each fact its own visual beat instead of four dense lines
    // stacked on top of each other, and spends the room this step has to spare — StepIntro carries no
    // fields, so unlike every other step here, making this box bigger is pure upside, not a height
    // fight with a question.
    <div className="rounded-field border border-divider bg-surface px-5 py-5 sm:px-7 sm:py-6">
      <ul className="space-y-5">
        {INTRO_POINTS.map((point, i) => (
          <li key={i} className="flex items-start gap-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-circle bg-[rgba(var(--cb-accent-rgb),0.1)] text-[var(--cb-accent)]">
              {point.icon}
            </span>
            <span className="mt-1.5 text-[15px] leading-relaxed text-ink-body-2">{point.body}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
