import type { CampaignType } from './campaignSpec'
import type { SubmitPayload } from './SetupStage'

// THE HANDOFF TO THE DASHBOARD, and the one place that knows its shape.
//
// `cb-my-campaigns` in localStorage IS the account in this design-only build - the same key the
// campaign dashboard (public/creator-brand/campaign-report.html) reads, and the same key the older
// 3-step modal writes. That makes the entry shape a contract between a React route and a
// hand-written static page that cannot import from it, so it is documented here and mirrored there:
//
//   { id, name, budget, bid, ts, type?, typeName?, details? }
//
// EVERYTHING PAST `ts` IS OPTIONAL BY DESIGN. Entries written by the old modal have no type, and
// the dashboard has to keep rendering them - so the type-aware report reads these fields when they
// are present and falls back to its original single shape when they are not. Making them required
// would strand every campaign a reviewer created before today.

const MY_KEY = 'cb-my-campaigns'

/**
 * campaign_{epoch seconds}_{8 hex} - the real product's id format (ROB-20983). Minted HERE rather
 * than by the dashboard so the id exists at the moment of submission: the confirmation and the
 * report row then show the same identifier, which is the whole point of having one.
 */
function genId(ts: number): string {
  let hex = ''
  for (let i = 0; i < 8; i += 1) hex += '0123456789abcdef'[Math.floor(Math.random() * 16)]
  return `campaign_${Math.floor(ts / 1000)}_${hex}`
}

const iso = (d: Date) => d.toISOString().slice(0, 10)

export type SavedCampaign = {
  id: string
  name: string
  budget: number
  bid: number
  ts: number
  type: string
  typeName: string
  details: {
    family: string
    fields: Record<string, string | string[]>
    /** The same answers, display-ready - see the note in saveCampaign(). */
    fieldList: { label: string; value: string }[]
    review: string
    start: string
    end: string
    goal: string
    outcomeLabel: string
    outcomeUnit: string
    per: number
    gen: { label: string; amount: number } | null
  }
}

/**
 * Writes the campaign and returns it. Newest first, matching the dashboard's own ordering - it
 * renders the array as given, so the order lives with whoever writes it.
 * A storage failure is swallowed: the caller navigates to the dashboard either way, and in a
 * prototype an unwritable localStorage should cost you the row, not the flow.
 */
export function saveCampaign(type: CampaignType, p: SubmitPayload): SavedCampaign {
  const ts = Date.now()
  const entry: SavedCampaign = {
    id: genId(ts),
    name: p.name,
    budget: p.budget,
    bid: p.bid,
    ts,
    type: type.id,
    typeName: type.name,
    details: {
      family: type.family,
      fields: p.fields,
      // THE LABELS TRAVEL WITH THE CAMPAIGN, for the same reason the unit does: the report is a
      // hand-written static page that cannot import the catalogue, so an entry storing only
      // { postUrl: '...' } would render "postUrl" as a row heading. Built here from the type in the
      // same pass as `fields`, so the two cannot describe different answers.
      // `fields` stays as well - it is the shape a real API would take, keyed rather than ordered.
      fieldList: type.fields
        .map((f) => {
          const v = p.fields[f.key]
          const text = Array.isArray(v) ? v.join(', ') : (v ?? '').trim()
          return { label: f.label, value: text }
        })
        .filter((r) => r.value !== ''),
      review: p.review,
      start: iso(p.start),
      end: iso(p.end),
      goal: p.goal,
      // The unit travels WITH the campaign. The dashboard must be able to say "38 of 50 surviving
      // comments" without owning a copy of the catalogue, and a static HTML page cannot import one.
      outcomeLabel: type.outcome.label,
      outcomeUnit: type.outcome.unit,
      per: type.outcome.per,
      gen: type.gen && p.gen !== null ? { label: type.gen.label, amount: p.gen } : null,
    },
  }
  try {
    const raw = JSON.parse(localStorage.getItem(MY_KEY) || '[]')
    const list = Array.isArray(raw) ? raw : []
    list.unshift(entry)
    localStorage.setItem(MY_KEY, JSON.stringify(list))
  } catch {
    // Nothing to recover: the flow continues to the dashboard, which will simply not list it.
  }
  return entry
}

/** The dashboard, with this campaign's review view already open. */
export function dashboardUrl(entry: SavedCampaign): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  return `${base}/creator-brand/campaign-report.html?open=${encodeURIComponent(entry.name)}`
}
