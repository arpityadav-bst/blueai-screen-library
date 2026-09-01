// THE SHAPE OF A CAMPAIGN TYPE, and the vocabulary every stage of the flow reads from it.
//
// Ported from the dev prototype at /v2/creator-brand/create-campaign.html (Abhisht, 2026-09-01),
// which held the nine types as an untyped JS array inside the page. Here they are DATA with a type,
// in their own module, for the reason the designer named when asking for this: every campaign has
// its own data. A Reddit-comments campaign and a UGC campaign do not share a unit, a bid label, a
// field set or a review default, and the moment any of that is hard-coded into a screen the screen
// starts lying about one of the nine.
//
// WHAT IS DELIBERATELY NOT HERE: the source page POSTs every submission to a live Supabase table
// with the anon key inline in the markup. This repo is a design-only replica - no backend, no keys
// in the tree - so the submit path writes localStorage and nothing else. If a real endpoint is ever
// wanted here, it belongs in an env var, not in a component.

/** Every input kind the nine types between them ask for. */
export type FieldKind = 'text' | 'textarea' | 'number' | 'select' | 'chips' | 'filelink'

export type TypeField = {
  key: string
  label: string
  kind: FieldKind
  /** select + chips only. */
  options?: readonly string[]
  ph?: string
  /** One quiet line under the control. Present only where the question needs defending. */
  hint?: string
}

/** What one checked result IS, for this type. The whole pricing model hangs off this. */
export type Outcome = {
  /** The bid field's label - it names the unit, so the reader never has to infer it. */
  label: string
  /** Plural noun for the estimate line: "about 50,000 checked views". */
  unit: string
  /** Results per bid. Views are bid per 1,000; a comment or a report is bid per 1. */
  per: number
  ph: string
}

/** A second bid, for the types where something has to be MADE before it can earn views. */
export type GenBid = { label: string; ph: string }

/** The illustrative running state shown on the catalogue card - see CatalogueStage for why. */
export type Sample = { done: number; target: number; note: string }

export type ReviewMode = 'all' | 'first' | 'auto'

export type CampaignType = {
  id: string
  family: Family
  name: string
  /** One line on the catalogue card. What happens, in plain words. */
  one: string
  /** The paragraph on the brief stage. Same idea, room to breathe. */
  tag: string
  /** Exactly three, always: what you give, what members do, what you pay for. */
  steps: readonly [string, string, string]
  /** Worked example with real arithmetic. Rendered as text, no HTML - see BriefStage. */
  ex: string
  outcome: Outcome
  gen: GenBid | null
  /** The review policy this type ARRIVES on. Every type lets the brand change it. */
  review: ReviewMode
  sample: Sample
  fields: readonly TypeField[]
}

// The four outcomes a brand actually comes here for. Order is the order on the page: views first
// because it is the one most brands arrive asking for, presence last because it is a retainer.
export const FAMILIES = [
  'Get more views',
  'Get videos made',
  'Get talked about',
  'Learn from real people',
] as const
export type Family = (typeof FAMILIES)[number]

// Shared option lists - the same karma floors and pacing choices appear on both Reddit types, and a
// second copy of them is how the two start disagreeing about what "high karma" means.
export const KARMA = ['1,000+ karma', '5,000+ karma', '10,000+ karma', '25,000+ karma'] as const
export const PACING = ['Over a few hours', 'Over a day', 'Over a few days', 'Across the whole window'] as const
export const PLATFORMS = ['YouTube', 'Instagram', 'TikTok', 'X', 'Reddit'] as const

// THE REVIEW LADDER, and it is a trust control rather than a setting: it decides how much of the
// work goes out under the brand's name without a human seeing it first. Each type has a sensible
// default (a boost of a video you already posted needs no approval; a Reddit comment written in
// someone else's words needs one) and every type can be moved along the ladder.
export const REVIEW_MODES: readonly { v: ReviewMode; l: string; h: string }[] = [
  { v: 'all', l: 'Review everything', h: 'Every item waits for your yes before it posts.' },
  { v: 'first', l: 'Review the first few per creator', h: 'Approve a creator once, then their later work auto-clears.' },
  { v: 'auto', l: 'Auto-approve', h: 'BlueAI checks against your brief. Nothing waits on you.' },
]

export const reviewLabel = (v: ReviewMode) => REVIEW_MODES.find((m) => m.v === v)?.l ?? v

/**
 * What a budget buys at a bid, in the type's own unit. floor() not round(): the number is a
 * promise about how many results the money covers, and rounding up promises one it cannot pay for.
 * Returns null when either side is missing, so the caller can say "set a bid and a budget" instead
 * of rendering a confident 0.
 */
export function estimate(type: CampaignType, bid: number, budget: number): number | null {
  if (!(bid > 0) || !(budget > 0)) return null
  return Math.floor(budget / bid) * (type.outcome.per || 1)
}
