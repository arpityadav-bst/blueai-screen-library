// The campaign draft's shape, its field data, and its validation. Split out of CampaignForm.tsx so
// the orchestrator holds flow (steps, submit) and nothing else. The field SHELL classes used to
// live here too; they moved to controls/fieldClasses.ts once the creators' manual-details form
// needed the same ones, a shell shared by both audiences shouldn't live under brands/.
import { isUrl, type Errors } from '../../forms'

export const ACTIONS = ['watch', 'like', 'comment'] as const

// US only for the pilot (product decision, 2026-08-12): the worker cohort is US-based, so that is
// the one country a campaign can honestly target. The list grows as new regions open; until then
// the form states the country rather than offering a one-item dropdown.
export const COUNTRIES = ['United States']

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
// Country is fixed to the one region the pilot serves.
export const INITIAL: Draft = {
  name: '',
  url: '',
  actions: [...ACTIONS],
  budget: '',
  bid: '',
  start: null,
  end: null,
  country: 'United States',
  goal: '',
}

// Grouped as the designer asked: what to promote / what it costs and when / who and why. The
// grouping is the point, nine fields in one column read as a chore, three groups of two-to-three
// read as a short conversation, and each group answers one question a brand actually has.
//
// Titles only. Each step used to carry a `sub` as well, which put TWO titles and TWO subtitles in
// the dialog's top ~140px with the progress rail wedged between them (designer, 2026-08-11: "not
// UX friendly"). The dialog's own title and its "nothing is charged now" reassurance are the pair
// worth keeping; the step subtitles restated what the field labels underneath already say.
export const STEPS = [
  { title: 'What to promote' },
  { title: 'Budget and schedule' },
  { title: 'Who and why' },
] as const

// Which fields each step owns. Advancing validates only its own step's fields, otherwise step 1's
// Continue would light up errors on dates nobody has been shown yet.
export const STEP_FIELDS: readonly string[][] = [
  ['name', 'url', 'actions'],
  ['budget', 'bid', 'start', 'end'],
  [],
]

// Messages, not codes: each one says what to do rather than what's wrong, which is the difference
// between "Invalid URL" and something a reader can act on without re-reading the label.
// Step 3 produces no errors at all, country is defaulted and the goal is the one optional field,
// so it's the finish step, not a quiz.
// Campaigns run on YouTube only; the URL check enforces what step 1's Platform row states.
function isYouTubeUrl(u: string): boolean {
  try {
    const h = new URL(u).hostname.replace(/^(www|m)\./, '')
    return h === 'youtube.com' || h === 'youtu.be'
  } catch {
    return false
  }
}

export function validate(d: Draft): Errors {
  const e: Errors = {}
  if (!d.name.trim()) e.name = 'Give the campaign a name.'
  if (!d.url.trim()) e.url = 'Add the link to the YouTube video you want promoted.'
  else if (!isUrl(d.url)) e.url = 'That doesn’t look like a link. It should start with https://'
  else if (!isYouTubeUrl(d.url)) e.url = 'Campaigns run on YouTube for now. Paste a youtube.com or youtu.be link.'
  if (d.actions.length === 0) e.actions = 'Pick at least one action.'
  if (!d.budget.trim()) e.budget = 'Set a budget.'
  else if (Number(d.budget) <= 0) e.budget = 'The budget has to be more than $0.'
  if (!d.bid.trim()) e.bid = 'Set a bid price.'
  else if (Number(d.bid) <= 0) e.bid = 'The bid has to be more than $0.'
  if (!d.start) e.start = 'Pick a start date.'
  if (!d.end) e.end = 'Pick an end date.'
  return e
}
