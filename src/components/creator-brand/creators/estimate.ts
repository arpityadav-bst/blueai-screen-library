// Deterministic, illustrative earnings model for the demo lookup — same handle always
// produces the same numbers (feels alive, not randomized-fake). NOT a researched rate
// card; purely for screen design, same convention as the rest of this repo's prototypes.
//
// Only YouTube jobs are real right now — a flat per-job rate, plus a small reach-scaled
// bonus (bigger following = more reach delivered, so it pays a bit more). Other
// platforms are shown as "coming soon."

export type PlatformKey = 'youtube' | 'instagram' | 'tiktok' | 'x'

function hashString(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export type Estimate = {
  followers: number
  low: number
  high: number
  tier: string
}

const FLAT_RATE_PER_JOB = 6 // per verified job, regardless of audience size
const REACH_RATE_PER_1K = 0.35 // reach bonus scales with your following

export function estimateFromFollowers(followers: number, _platform: PlatformKey): Estimate {
  const jobsPerWeek = 5
  const reachBonus = (followers / 1000) * REACH_RATE_PER_1K
  const perJob = FLAT_RATE_PER_JOB + reachBonus
  const low = Math.round((perJob * jobsPerWeek * 0.8) / 5) * 5
  const high = Math.round((perJob * jobsPerWeek * 1.6) / 5) * 5
  const tier = followers < 5000 ? 'Just starting out' : followers < 50000 ? 'Growing fast' : 'Established'
  return { followers, low, high, tier }
}

export function estimateFromHandle(handle: string, platform: PlatformKey): Estimate {
  const h = hashString(handle.toLowerCase().trim() || 'creator')
  const followers = 800 + (h % 240000)
  return estimateFromFollowers(followers, platform)
}

// What a creator picks in the manual-details fallback, for when BlueAI can't read the channel
// itself. Illustrative and deliberately short — a 40-entry taxonomy would be a research artefact,
// not a design one.
export const CATEGORIES = [
  'Gaming',
  'Tech & reviews',
  'Beauty & fashion',
  'Fitness & health',
  'Food & cooking',
  'Travel',
  'Music',
  'Education',
  'Comedy',
  'Vlogs & lifestyle',
  'Finance',
  'Something else',
]

// The category does NOT move the money, and that's the model, not a shortcut: the rate is flat per
// verified job plus a reach bonus, so what a channel is ABOUT decides which jobs get matched to it,
// never what those jobs pay. Returning the same arithmetic from both paths is what keeps the manual
// fallback honest — a creator who types their own numbers gets the same answer the auto lookup
// would have given for the same following.
export function estimateFromManual(followers: number, _category: string): Estimate {
  return estimateFromFollowers(followers, 'youtube')
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}
