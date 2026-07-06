// /moneymaker/capital-shift — "The Capital Shift". Copy + scripted demo data (design-only).
// Direction: manifesto-led, editorial/keynote big-type. NOTE: the "sell time → sell skill
// → sell capital" framing is internal strategy rationale, not user-facing copy (removed
// 2026-07-06) — the hero instead states the product benefit directly.

export const MM3_HERO = {
  eyebrow: 'BlueAI · your own AI worker',
  h1a: 'Put your capital',
  h1grad: 'to work.',
  sub: 'Deploy an autonomous AI worker that creates, predicts, trades and flips — earning for you, day and night.',
  primaryCta: 'Join the waitlist',
  secondaryCta: 'See what it earns',
}

export const MM3_COMPARE = {
  eyebrow: 'The trade',
  head: 'Two ways to earn.',
  left: { label: 'Selling your time', desc: 'Linear. Capped by the hours in your day. Stops the moment you do.' },
  right: { label: 'Owning your capital', desc: 'Parallel. Runs while you sleep. Compounds the longer it works.' },
}

export type Mm3Worker = {
  key: string; name: string; tag: string; desc: string
  steps: { label: string; done: string }[]
  payoff: string
}
export const MM3_WORKERS: Mm3Worker[] = [
  {
    key: 'create', name: 'Creator', tag: 'Capital → content', desc: 'Deploys into short-form video that publishes and compounds ad revenue.',
    steps: [{ label: 'Drafting…', done: 'Drafted' }, { label: 'Rendering…', done: 'Rendered' }, { label: 'Publishing…', done: 'Published' }], payoff: '+$3.22',
  },
  {
    key: 'predict', name: 'Predictor', tag: 'Capital → odds', desc: 'Deploys into prediction markets, only when the edge clears your bar.',
    steps: [{ label: 'Reading odds…', done: 'Edge found' }, { label: 'Positioning…', done: 'Positioned' }, { label: 'Resolving…', done: 'Resolved YES' }], payoff: '+$18.75',
  },
  {
    key: 'trade', name: 'Trader', tag: 'Capital → markets', desc: 'Deploys into your strategy, sized to the risk caps you set.',
    steps: [{ label: 'Rule armed…', done: 'Triggered' }, { label: 'Sizing…', done: 'Sized' }, { label: 'Executing…', done: 'Executed' }], payoff: '+$41.20',
  },
  {
    key: 'flip', name: 'Flipper', tag: 'Capital → goods', desc: 'Deploys into underpriced listings, resold at margin.',
    steps: [{ label: 'Scanning…', done: 'Found' }, { label: 'Buying…', done: 'Bought $89' }, { label: 'Relisting…', done: 'Sold $117' }], payoff: '+$27.40',
  },
]

export const MM3_NETWORK = {
  eyebrow: 'The shift, at scale',
  head: 'One worker today. A network tomorrow.',
  sub: 'Every person who joins adds a worker to the network — each one owned, each one earning for someone. Access to AI labor, not just AI answers.',
}

export const MM3_CLOSE = {
  line: 'Everyone will own an AI worker. It’s the best way to earn money.',
  fine: 'Demo experience with scripted data. Workers act only within limits you set; returns are never guaranteed and trading involves risk.',
}
