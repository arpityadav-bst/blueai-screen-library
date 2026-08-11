// The campaign draft's shape, its field data, and its validation. Split out of CampaignForm.tsx so
// the orchestrator holds flow (steps, submit) and nothing else. The field SHELL classes used to
// live here too; they moved to controls/fieldClasses.ts once the creators' manual-details form
// needed the same ones — a shell shared by both audiences shouldn't live under brands/.
import { isUrl, type Errors } from '../../forms'

export const ACTIONS = ['watch', 'like', 'comment'] as const

// Illustrative, like every dollar figure on this site — a design-handoff stub, not a researched
// market list. Worldwide first because it's the sane default for a pre-launch campaign.
export const COUNTRIES = [
  'Worldwide',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Brazil',
  'India',
  'Indonesia',
  'Japan',
  'Mexico',
  'Philippines',
]

export type Draft = {
  name: string
  url: string
  actions: string[]
  budget: string
  bid: string
  start: Date | null
  end: Date | null
  country: string
  goal: string
}

// All three actions on by default because that combination is the unit the rate was built around.
// Country defaults to Worldwide for the same reason it's first in the list.
export const INITIAL: Draft = {
  name: '',
  url: '',
  actions: [...ACTIONS],
  budget: '',
  bid: '',
  start: null,
  end: null,
  country: 'Worldwide',
  goal: '',
}

// Grouped as the designer asked: what to promote / what it costs and when / who and why. The
// grouping is the point — nine fields in one column read as a chore, three groups of two-to-three
// read as a short conversation, and each group answers one question a brand actually has.
//
// Titles only. Each step used to carry a `sub` as well, which put TWO titles and TWO subtitles in
// the dialog's top ~140px with the progress rail wedged between them (designer, 2026-08-11: "not
// UX friendly"). The dialog's own title and its "nothing is charged now" reassurance are the pair
// worth keeping; the step subtitles restated what the field labels underneath already say.
export const STEPS = [
  { title: 'What to promote' },
  { title: 'Spend and window' },
  { title: 'Who and why' },
] as const

// Which fields each step owns. Advancing validates only its own step's fields — otherwise step 1's
// Continue would light up errors on dates nobody has been shown yet.
export const STEP_FIELDS: readonly string[][] = [
  ['name', 'url', 'actions'],
  ['budget', 'bid', 'start', 'end'],
  [],
]

// Messages, not codes: each one says what to do rather than what's wrong, which is the difference
// between "Invalid URL" and something a reader can act on without re-reading the label.
// Step 3 produces no errors at all — country is defaulted and the goal is the one optional field,
// so it's the finish step, not a quiz.
export function validate(d: Draft): Errors {
  const e: Errors = {}
  if (!d.name.trim()) e.name = 'Give the campaign a name.'
  if (!d.url.trim()) e.url = 'Add the link to the video you want promoted.'
  else if (!isUrl(d.url)) e.url = 'That doesn’t look like a link — it should start with https://'
  if (d.actions.length === 0) e.actions = 'Pick at least one action.'
  if (!d.budget.trim()) e.budget = 'Set a budget.'
  else if (Number(d.budget) <= 0) e.budget = 'The budget has to be more than $0.'
  if (!d.bid.trim()) e.bid = 'Set a bid price.'
  else if (Number(d.bid) <= 0) e.bid = 'The bid has to be more than $0.'
  if (!d.start) e.start = 'Pick a start date.'
  if (!d.end) e.end = 'Pick an end date.'
  return e
}
