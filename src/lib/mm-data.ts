// /moneymaker — "The Autonomy OS". Copy + scripted demo data (design-only).
// Direction: premium futuristic AI-agent product on the blueAI light theme
// (creator-v2 language: living gradient, glass, iris/cyan). Money is the OUTCOME
// of agents working — never trading-dashboard chrome.

export const MM_HERO = {
  h1a: 'The AI that',
  h1grad: 'pays you.',
  sub: 'A team of autonomous agents that create, predict, trade and flip — quietly earning in the background while you live your life.',
  primaryCta: 'Join the waitlist',
  secondaryCta: 'See how it works',
  trust: ['Funds stay in your accounts', 'Every action logged', 'You set the limits'],
};

// The glass OS panel — what the agents are doing "right now".
export type MmAgentChip = { key: string; name: string; state: string; on: boolean };
export const MM_OS_AGENTS: MmAgentChip[] = [
  { key: 'create',  name: 'Creator',   state: 'publishing a short',       on: true },
  { key: 'predict', name: 'Predictor', state: 'watching 3 markets',       on: true },
  { key: 'trade',   name: 'Trader',    state: 'inside your risk caps',    on: true },
  { key: 'flip',    name: 'Flipper',   state: 'negotiating a listing',    on: false },
];
export const MM_OS_FEED = [
  { who: 'Creator',   what: 'Ad revenue landed · “Black hole facts”', amt: '+$3.22' },
  { who: 'Flipper',   what: 'Sold a vintage lens at 31% margin',      amt: '+$27.40' },
  { who: 'Predictor', what: 'Rate market resolved in your favor',     amt: '+$18.75' },
  { who: 'Trader',    what: 'Covered call closed',                    amt: '+$41.20' },
  { who: 'Creator',   what: 'Sponsor slot booked for Friday',         amt: '+$12.00' },
  { who: 'Trader',    what: 'Position stopped out — capped early',    amt: '−$3.10' },
];

// Agents section — who's on your payroll.
export type MmEarner = { key: string; name: string; role: string; desc: string; monthly: string };
export const MM_EARNERS: MmEarner[] = [
  { key: 'create',  name: 'The Creator',   role: 'Makes & publishes', desc: 'Produces short-form video, publishes it across your channels, and compounds the ad revenue.', monthly: '$120–$480' },
  { key: 'predict', name: 'The Predictor', role: 'Reads the odds',    desc: 'Watches prediction markets and takes a position only when the edge clears your bar.', monthly: '$90–$310' },
  { key: 'trade',   name: 'The Trader',    role: 'Works your plan',   desc: 'Executes your strategy with every position sized to the risk caps you set.', monthly: '$180–$640' },
  { key: 'flip',    name: 'The Flipper',   role: 'Buys low, sells',   desc: 'Finds underpriced listings, negotiates, relists at margin. Small spreads, all day.', monthly: '$150–$520' },
];

// The night-shift story (scroll scene) — what happened while you slept.
export const MM_NIGHT = {
  head: 'It works the night shift.',
  sub: 'While you slept, your agents kept the lights on.',
  beats: [
    { t: '02:14', who: 'Trader',    what: 'closed a covered call', amt: '+$41.20' },
    { t: '04:47', who: 'Predictor', what: 'a market resolved YES', amt: '+$18.75' },
    { t: '06:38', who: 'Creator',   what: 'overnight ad revenue',  amt: '+$8.66' },
  ],
  wake: 'You woke up $68.61 richer.',
};

export const MM_TRUST = [
  { title: 'Your money never moves in', desc: 'Agents act inside your own accounts. BlueAI never takes custody of a dollar.' },
  { title: 'Every action, logged', desc: 'A full journal of everything each agent did, when, and why — nothing happens off the record.' },
  { title: 'You set the limits', desc: 'Budgets, risk caps, quiet hours. Agents work inside your rules or not at all.' },
];

export const MM_CLOSE = {
  line: 'Every day without them is a day they didn’t earn for you.',
  cta: 'Join the waitlist',
  fine: 'Demo experience with scripted data. Agents act only within limits you set; returns are never guaranteed and trading involves risk.',
};
