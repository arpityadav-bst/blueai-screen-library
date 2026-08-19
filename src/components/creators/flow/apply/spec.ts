// Ported verbatim from creator-brand/creators/apply/spec.ts — PURE DATA, no styling, so the port is
// byte-faithful apart from the forms import path. Every question, option gate and message is the
// PM's; see the source file for the full grouping history.
//
// THE QUESTIONS ARE THE PM'S, VERBATIM IN INTENT. What is NOT the PM's is the GROUPING — the brief
// said "minimal and with proper segregation so it doesn't overwhelm the creator", which is a
// constraint, not a layout. Eleven fields in one column is the thing that brief exists to prevent, so
// they're split into four steps of two to four, each answering one question a reader can hold in
// their head: are you eligible, what's your channel, can you deliver, how do we pay and reach you.
//
// CUT TO FOUR STEPS, NOT FIVE (PM, 2026-08-13). The PC-specs step (OS + RAM) is gone entirely —
// dropped as a question, not just reshuffled, so os/ram no longer exist on Draft at all. The two
// separate consent checkboxes ("okay to be contacted for feedback", "okay to be emailed about the
// program") are also gone, replaced by ONE checkbox at the very end that covers both plus the
// Program Terms — see `agree` below.
//
// "WHY DO YOU WANT TO JOIN?" CUT (PM, 2026-08-14), replaced by two capacity chip questions (pcHours,
// runDays) — see StepThree for the reasoning and options.tsx for why the answers are fixed ranges.
import { isEmail, type Errors } from './forms'

export type Draft = {
  adult: boolean
  describes: string
  hasYouTube: string
  channel: string
  pcHours: string
  runDays: string
  earnedBefore: string
  hasPaypal: string
  fullRun: string
  email: string
  agree: boolean
}

// Nothing is pre-answered. Every one of these is a real question about the reader, and a
// pre-selected radio is a question the form answered on their behalf — which is how a "what
// describes you" field ends up 80% "Student" in the data. The checkboxes start false for the same
// reason, and because a pre-ticked consent box is not consent.
export const INITIAL: Draft = {
  adult: false,
  describes: '',
  hasYouTube: '',
  channel: '',
  pcHours: '',
  runDays: '',
  earnedBefore: '',
  hasPaypal: '',
  fullRun: '',
  email: '',
  agree: false,
}

// FIVE steps again, not four — "About the program" is its own screen ahead of step 1 (designer,
// 2026-08-13), not folded into it. STEP_FIELDS[0] is empty on purpose: nothing on that screen is a
// field, so there's nothing to validate before its Continue can advance.
export const STEPS = [
  { title: 'About the program' },
  { title: 'Before we start' },
  { title: 'Your channel' },
  { title: 'About you' },
  { title: 'Payment and contact' },
] as const

export const STEP_FIELDS: readonly string[][] = [
  [],
  ['adult', 'describes'],
  ['hasYouTube', 'channel'],
  ['pcHours', 'runDays', 'earnedBefore'],
  ['hasPaypal', 'fullRun', 'email', 'agree'],
]

// Messages say what to do, not what is wrong — the same rule the campaign form's validate() note
// sets out. Two of these are gates rather than corrections ("18 or older", the closing agreement):
// they can't be fixed by typing something different, so they say what the requirement IS.
export function validate(d: Draft): Errors {
  const e: Errors = {}

  if (!d.adult) e.adult = 'You need to be 18 or older to apply.'
  if (!d.describes) e.describes = 'Pick the one that fits best.'

  if (!d.hasYouTube) e.hasYouTube = 'Let us know if you have a YouTube account.'
  // The channel link itself is OPTIONAL (PM, 2026-08-14) — a "Yes" without a pasted link is a valid
  // application, so there is deliberately no validation on d.channel. The field still only RENDERS
  // after a "Yes" (see StepTwo): a visible field nobody has to fill still reads as work, and the
  // honest state after a "No" is that the question no longer applies.

  if (!d.pcHours) e.pcHours = 'Pick the closest option.'
  if (!d.runDays) e.runDays = 'Pick the closest option.'
  if (!d.earnedBefore.trim()) e.earnedBefore = 'Tell us what you have tried. “Nothing yet” is an answer.'

  if (!d.hasPaypal) e.hasPaypal = 'Let us know if you have a PayPal account.'
  if (!d.fullRun) e.fullRun = 'Let us know if you are in for the full run.'

  if (!d.email.trim()) e.email = 'Add the email you want to be contacted on.'
  else if (!isEmail(d.email)) e.email = 'That doesn’t look like an email. Check for a typo.'

  if (!d.agree) e.agree = 'You need to agree to the Program Terms to apply.'

  return e
}
