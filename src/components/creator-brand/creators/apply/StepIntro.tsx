// Split out of Steps.tsx on 2026-08-13 to keep that file under this project's 300-line rule — pure
// extraction, no behaviour change. Same reason Long.tsx and options.tsx were split out earlier.

import { CadenceIcon, ClockIcon, DocumentIcon, MonitorIcon, WalletIcon } from './introIcons'

// StepIntro's five points, each an icon + a sentence with the one number/name in it bolded. Data only,
// kept beside the component that reads it rather than in options.tsx — those are ChoiceGroup answer
// sets, these are static copy, a different shape entirely.
//
// CHRONOLOGICAL ORDER, AND DAYS NOT JOBS (PM, 2026-08-14). The old first point led with "[X] jobs
// every [Y] days", which failed two ways at once: an applicant this early doesn't know what a "job"
// is, and job availability isn't in the applicant's control, so a job-count obligation was a promise
// the program couldn't grade fairly. The requirement is now phrased as days-run — the same measure the
// creator dashboard will report — and what BlueAI does is described as "campaigns and tasks from
// brands", the same words the rest of this site uses ("jobs" was tried and cut, PM 2026-08-14: an
// internal noun an applicant hasn't met yet). Order tells the program as a story: invite email →
// what BlueAI does → your one obligation → the payoff → the terms. The email is mentioned because the
// pilot build is only delivered through it, so line 1 also answers "set it up from where?".
const INTRO_POINTS = [
  {
    icon: <MonitorIcon />,
    body: <>Once accepted, we&apos;ll email you a download link. Set up BlueAI on your PC.</>,
  },
  {
    icon: <ClockIcon />,
    body: <>BlueAI completes campaigns and tasks from agencies on your YouTube account. Each takes a few minutes.</>,
  },
  {
    icon: <CadenceIcon />,
    body: <>All you do: run BlueAI on at least <b className="font-semibold text-ink-heading">20 days</b> each month.</>,
  },
  {
    icon: <WalletIcon />,
    body: <>You earn <b className="font-semibold text-ink-heading">$30 every month</b>, paid via PayPal.</>,
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
    // "20 days" is the PM's OWN placeholder (2026-08-14), not a signed-off program term — it replaced
    // a literal "[X] days" at the PM's request, on the PM's explicit "I can say that it's a
    // placeholder". The distinction from this site's illustrative dollar figures still matters: the
    // run requirement is a real obligation an applicant agrees to, so if the final number differs,
    // this line (and the CadenceIcon doc comment in introIcons.tsx) is where it changes.
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
      {/* THE TINTED CIRCLE IS DESKTOP-ONLY (Appy, 2026-08-14) — mobile keeps the glyph and drops the
          container around it. The circle is h-9/w-9 (36px) holding an 18px icon, i.e. exactly double
          the thing it decorates, and it was charging that full 36px plus a 14px gap against a column
          only ~270px wide inside this box. Below sm the icon now sits bare at its own 18px against a
          12px gap, which hands ~20px straight back to the sentence — the widest single gain available
          on this step without touching type size or copy.
          It STAYS at sm and up, where the column is roughly twice as wide and the tint is doing real
          work: five stacked rows need something to anchor the eye down the left edge, and there the
          36px is affordable. This is a width concession, not a change of mind about the treatment.
          THE mt VALUES SWAP WITH IT, and they are not interchangeable. The text carried mt-1.5 to
          optically centre its first line against the 36px circle (circle centre 18px; text centre
          6 + 12.2). With no circle that same 6px would leave the glyph riding ~9px high, so below sm
          the nudge moves to the ICON instead (mt-[3px] puts the 18px glyph's centre at 12px against
          the text's own 12.2px). Each breakpoint centres against whatever it actually renders. */}
      <ul className="space-y-5">
        {INTRO_POINTS.map((point, i) => (
          <li key={i} className="flex items-start gap-3 sm:gap-3.5">
            <span className="mt-[3px] flex shrink-0 items-center justify-center text-[var(--cb-accent)] sm:mt-0 sm:h-9 sm:w-9 sm:rounded-circle sm:bg-[rgba(var(--cb-accent-rgb),0.1)]">
              {point.icon}
            </span>
            <span className="text-[15px] leading-relaxed text-ink-body-2 sm:mt-1.5">{point.body}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
