import { CadenceIcon, ClockIcon, DocumentIcon, MonitorIcon, WalletIcon } from './introIcons'

// STEP 0 — the untitled intro screen ahead of step 1 (title cut per the PM: the list is
// self-explanatory). Ported from creator-brand/creators/apply/StepIntro.tsx; the original five
// points are the PM's copy VERBATIM with one row added ahead of them (the access seam, also his),
// only the skin moved onto the kit's .crx-intro-row rows (icon in an iris-soft circle + a sentence
// with the one number/name in it bolded — the kit styles the <b>).
//
// CHRONOLOGICAL ORDER, AND DAYS NOT JOBS (PM, 2026-08-14). The old first point led with "[X] jobs
// every [Y] days", which failed two ways: an applicant this early doesn't know what a "job" is, and
// job availability isn't in their control, so a job-count obligation was a promise the program
// couldn't grade fairly. The requirement is phrased as days-run — the same measure the creator
// dashboard reports — and what BlueAI does is "campaigns and tasks from brands" ("jobs" was tried
// and cut, PM 2026-08-14: an internal noun an applicant hasn't met yet). Order tells the program as
// a story: invite email → what BlueAI does → your one obligation → the payoff → the terms. The email
// is mentioned because the pilot build is only delivered through it, so line 1 also answers "set it
// up from where?".
const INTRO_POINTS = [
  // The "Access starts on your PC. Phones and robots come next." seam row was CUT (Abhisht,
  // 2026-08-24): this flow now hangs off the programs home, which never sells other machines, so
  // the disclaimer defended against a bait this reader never saw — and the download row below
  // already names the PC. If the multi-machine pitch returns to this funnel, the row returns too.
  {
    icon: <MonitorIcon />,
    body: <>Once accepted, we&apos;ll email you a download link. Set up BlueAI on your PC.</>,
  },
  {
    icon: <ClockIcon />,
    body: <>BlueAI completes campaigns and tasks from brands on your YouTube account. Each takes a few minutes.</>,
  },
  {
    icon: <CadenceIcon />,
    body: <>All you do: run BlueAI on at least <b>20 days</b> each month.</>,
  },
  {
    icon: <WalletIcon />,
    body: <>You earn <b>$30 every month</b>, paid via PayPal.</>,
  },
  {
    icon: <DocumentIcon />,
    body: <>Applying means you accept the <u>Program Terms</u>.</>,
  },
]

// No fields, so it takes no Props — a static screen, not a question. Its own step (designer,
// 2026-08-13) so the biggest informational block never competes with real questions for the same
// height budget.
export default function StepIntro() {
  return (
    // "20 days" is the PM's OWN placeholder (2026-08-14), not a signed-off program term — it replaced
    // a literal "[X] days" on the PM's explicit "I can say that it's a placeholder". The run
    // requirement is a real obligation an applicant agrees to, so if the final number differs, this
    // file (and introIcons.tsx's CadenceIcon doc comment) is where it changes.
    //
    // NO SECOND "ABOUT THE PROGRAM" HEADING (fixed 2026-08-13 in the source) — the step title in the
    // form's own header row already IS the heading; this block only holds the five points.
    //
    // ICON ROWS, NOT A BULLET LIST (source, 2026-08-13) — one glyph per point gives each fact its own
    // visual beat instead of four dense lines. This step carries no fields, so spending its spare
    // room on bigger, airier copy is pure upside. Divs, not ul/li: the kit's sibling rule
    // (.crx-intro-row + .crx-intro-row) owns the rhythm.
    <div>
      {INTRO_POINTS.map((point, i) => (
        <div key={i} className="crx-intro-row">
          <span className="crx-intro-ic">{point.icon}</span>
          <span className="crx-intro-body">{point.body}</span>
        </div>
      ))}
    </div>
  )
}
