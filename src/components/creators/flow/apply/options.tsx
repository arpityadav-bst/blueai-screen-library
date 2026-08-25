import type { Choice } from './controls'
import { BriefcaseIcon, CapIcon, CreatorIcon, DotsIcon, LaptopIcon, NoIcon, YesIcon } from './choiceIcons'

// The application's option sets, ported verbatim from creator-brand/creators/apply/options.tsx —
// data plus the glyph each option carries, no behaviour, split from Steps.tsx for the 300-line rule.
//
// CARDS vs CHIPS is decided per QUESTION, and option COUNT is very much part of that call (revised
// 2026-08-13 in the source — the line it replaced said the opposite and cost a real bug: five
// describes options as one-per-row cards made step 1 the tallest step in the form). The rule that
// holds: cards for a SHORT list (two, maybe three) where full weight per option is affordable —
// hasYouTube is the one left — chips for anything longer, REGARDLESS of how much the question
// matters.
//
// The hints under the channel options are doing real work, not decoration: they answer the "wait,
// does this disqualify me?" beat at the exact moment it lands, which is otherwise a question
// somebody leaves the form to go and answer.
export const DESCRIBES_OPTS: Choice[] = [
  { value: 'Student', icon: <CapIcon /> },
  { value: 'Employed', icon: <BriefcaseIcon /> },
  { value: 'Full-time creator', icon: <CreatorIcon /> },
  { value: 'Freelancer', icon: <LaptopIcon /> },
  { value: 'Other', icon: <DotsIcon /> },
]
export const HAS_YT_OPTS: Choice[] = [
  { value: 'Yes', icon: <YesIcon />, hint: 'I have a channel', tone: 'ok' },
  { value: 'No', icon: <NoIcon />, hint: 'Not yet', tone: 'danger' },
]
export const YES_NO_CHIPS: Choice[] = [
  { value: 'Yes', icon: <YesIcon size={15} />, tone: 'ok' },
  { value: 'No', icon: <NoIcon size={15} />, tone: 'danger' },
]

// "Not sure" stays untoned on purpose. It is neither an affirm nor a deny, and giving it a colour to
// avoid looking odd next to two that have one would be inventing a third semantic.
export const FULL_RUN_OPTS: Choice[] = [
  { value: 'Yes', tone: 'ok' },
  { value: 'Not sure' },
  { value: 'No', tone: 'danger' },
]

// The two capacity questions that replaced "Why do you want to join?" (PM, 2026-08-14) — see
// StepThree for the reasoning. Fixed ranges rather than a free number field: typed numbers come back
// as "depends", "8-16?" and "all day lol", and ranges make applications sortable at review time.
// ALL UNTONED, deliberately: green on the high answers would tell the applicant which answer the
// reviewer wants, and a self-reported capacity question is leading enough already. (FULL_RUN's tones
// are different in kind — yes/no carries real affirm/deny semantics; "more" does not mean "correct".)
export const PC_HOURS_OPTS: Choice[] = [
  { value: 'Under 2 hours' },
  { value: '2-5 hours' },
  { value: '5-10 hours' },
  { value: 'Basically always on' },
]
export const RUN_DAYS_OPTS: Choice[] = [
  { value: '1-2 days' },
  { value: '3-4 days' },
  { value: '5-6 days' },
  { value: 'Every day' },
]
