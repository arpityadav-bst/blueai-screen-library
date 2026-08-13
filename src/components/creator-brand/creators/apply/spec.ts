// The creator application's shape, its option lists, and its validation. Same split as the brands
// campaign form (brands/campaign/spec.ts): the orchestrator holds flow, this holds data and rules.
//
// THE QUESTIONS ARE THE PM'S, VERBATIM IN INTENT (2026-08-13). Thirteen of them. What is NOT the
// PM's is the GROUPING — the brief said "minimal and with proper segregation so it doesn't
// overwhelm the creator", which is a constraint, not a layout. Thirteen fields in one column is the
// thing that brief exists to prevent, so they're split into five steps of two to four, each step
// answering one question a reader can hold in their head: are you eligible, what's your channel,
// what's your machine, who are you, how do we pay and reach you.
//
// The PM's list numbers to 14 with **no question 10** — the numbering skips it. Thirteen questions
// is therefore what this file carries, and if a fourteenth was meant to exist it is missing from the
// brief rather than from here. Flagged rather than invented.
import { isEmail, type Errors } from '../../forms'

export const DESCRIBES = ['Student', 'Employed', 'Full-time creator', 'Freelancer', 'Other']
export const OPERATING_SYSTEMS = ['Windows', 'macOS']
export const RAM = ['4 GB', '8 GB', '16 GB or more', 'Not sure']
export const FULL_RUN = ['Yes', 'Not sure', 'No']
export const YES_NO = ['Yes', 'No']

export type Draft = {
  adult: boolean
  describes: string
  hasYouTube: string
  channel: string
  os: string
  ram: string
  why: string
  earnedBefore: string
  feedbackOk: string
  hasPaypal: string
  fullRun: string
  email: string
  emailConsent: boolean
}

// Nothing is pre-answered. Every one of these is a real question about the reader, and a
// pre-selected radio is a question the form answered on their behalf — which is how a "what
// describes you" field ends up 80% "Student" in the data. The two checkboxes start false for the
// same reason, and because a pre-ticked consent box is not consent.
export const INITIAL: Draft = {
  adult: false,
  describes: '',
  hasYouTube: '',
  channel: '',
  os: '',
  ram: '',
  why: '',
  earnedBefore: '',
  feedbackOk: '',
  hasPaypal: '',
  fullRun: '',
  email: '',
  emailConsent: false,
}

// Five steps. `feedbackOk` sits with the two long-text questions rather than with the contact
// details, because "can we come back to you for feedback" is a question about the person, and it
// keeps the last step down to two taps plus an email instead of four taps plus an email.
export const STEPS = [
  { title: 'Before we start' },
  { title: 'Your channel' },
  { title: 'Your computer' },
  { title: 'About you' },
  { title: 'Payment and contact' },
] as const

export const STEP_FIELDS: readonly string[][] = [
  ['adult', 'describes'],
  ['hasYouTube', 'channel'],
  ['os', 'ram'],
  ['why', 'earnedBefore', 'feedbackOk'],
  ['hasPaypal', 'fullRun', 'email', 'emailConsent'],
]

// Messages say what to do, not what is wrong — the same rule the campaign form's validate() note
// sets out. Two of these are gates rather than corrections ("18 or older", the contact consent):
// they can't be fixed by typing something different, so they say what the requirement IS.
export function validate(d: Draft): Errors {
  const e: Errors = {}

  if (!d.adult) e.adult = 'You need to be 18 or older to apply.'
  if (!d.describes) e.describes = 'Pick the one that fits best.'

  if (!d.hasYouTube) e.hasYouTube = 'Let us know if you have a YouTube account.'
  // Only asked for when there is a channel to ask about. Answering "No" leaves this field
  // unrendered rather than rendered-and-optional: a visible field nobody has to fill still reads
  // as work, and the honest state is that the question no longer applies.
  if (d.hasYouTube === 'Yes' && !d.channel.trim()) e.channel = 'Paste your channel or handle link.'

  if (!d.os) e.os = 'Pick the system your computer runs.'
  if (!d.ram) e.ram = 'Pick how much RAM it has, or “Not sure”.'

  if (!d.why.trim()) e.why = 'Tell us why you want to join.'
  if (!d.earnedBefore.trim()) e.earnedBefore = 'Tell us what you have tried. “Nothing yet” is an answer.'
  if (!d.feedbackOk) e.feedbackOk = 'Let us know either way.'

  if (!d.hasPaypal) e.hasPaypal = 'Let us know if you have a PayPal account.'
  if (!d.fullRun) e.fullRun = 'Let us know if you are in for the full run.'

  if (!d.email.trim()) e.email = 'Add the email you want to be contacted on.'
  else if (!isEmail(d.email)) e.email = 'That doesn’t look like an email — check for a typo.'

  if (!d.emailConsent) e.emailConsent = 'We need your okay to email you about the program.'

  return e
}
