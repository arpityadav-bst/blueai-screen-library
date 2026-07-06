// /moneymaker — shared content across all THREE variants (Autonomy OS · Mission Control ·
// The Capital Shift). Re-exports the sitewide WAITLIST_URL SSOT (site-data.ts) so every
// variant's CTA points at the same place, plus the shared TRUST content each variant
// presents in its own voice (glass step-flow / mission checklist / editorial manifesto).
//
// NOTE: the "sell your time → sell your skill → sell your capital" framing from the
// strategy meeting is the INTERNAL rationale for this page's positioning — it must not
// be rendered as user-facing copy (removed from all three heroes 2026-07-06). Use it to
// inform tone/strategy only.

export { WAITLIST_URL } from './site-data'

// The custody flow — the #1 trust lever for a product asking access to your money.
// Same 4 steps everywhere; each variant stages them differently (glass cards / a
// pre-flight checklist / a numbered manifesto list).
export type MmCustodyStep = { n: string; title: string; desc: string }
export const MM_CUSTODY: MmCustodyStep[] = [
  { n: '01', title: 'You connect your own account', desc: 'Your brokerage, exchange or payment account — never one BlueAI holds.' },
  { n: '02', title: 'The agent acts inside it', desc: 'It trades, posts and applies using the permissions you grant. It can act — it can never withdraw.' },
  { n: '03', title: 'You watch every move', desc: 'A timestamped log of everything each agent did, and why — nothing happens off the record.' },
  { n: '04', title: 'You can pull the plug anytime', desc: 'Pause one agent or cut off access entirely, instantly. Nothing keeps running without your say-so.' },
]

// The objections addressed head-on, honestly — including that this is a pre-launch
// preview, not a live product yet (transparency about status is itself a trust move).
export type MmFaqItem = { q: string; a: string }
export const MM_FAQ: MmFaqItem[] = [
  { q: 'Can an agent lose all my money?', a: 'No agent trades or spends beyond the budget and risk caps you set — you can cap it at whatever you’re comfortable with, including a few dollars.' },
  { q: 'Can I stop it at any time?', a: 'Yes. Pause any single agent or shut off access entirely, instantly. No lock-in, no waiting period.' },
  { q: 'Does BlueAI ever hold my money?', a: 'Never. Your funds stay in your own accounts at all times. BlueAI can act inside them, not withdraw from them.' },
  { q: 'Is this live yet?', a: 'Not yet — this is a design preview of what’s coming. Join the waitlist and you’ll be first in line when access opens.' },
]

// Brand grounding — borrows credibility from the parent company rather than presenting
// as an anonymous AI startup asking for access to your money.
export const MM_BRAND_LINE = 'Built by the team behind BlueStacks — the Android gaming platform millions of PC gamers already trust.'
