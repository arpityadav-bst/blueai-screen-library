// /moneymaker/mission-control — "Mission Control". Copy + scripted demo data (design-only).
// Direction: SpaceX-launch-broadcast aesthetic — near-black, telemetry mono, a single
// worker unit ascending. Same underlying roster/manifesto as the other two variants
// (mm-shared-data.ts), voiced as a mission briefing.

export const MM2_HERO = {
  eyebrow: 'MISSION: AUTONOMY-01',
  h1: ['DEPLOY YOUR', 'OWN AI WORKER.'],
  sub: 'One unit. Four disciplines. Earning on your behalf from the moment it goes live.',
  primaryCta: 'RESERVE YOUR UNIT',
  secondaryCta: 'VIEW BRIEFING',
}

export type Mm2Unit = {
  key: string
  callsign: string
  name: string
  brief: string
  steps: { label: string; done: string }[]
  payoff: string
}

export const MM2_UNITS: Mm2Unit[] = [
  {
    key: 'create', callsign: 'UNIT-01', name: 'CREATOR', brief: 'Content production & publishing',
    steps: [
      { label: 'DRAFTING PAYLOAD…', done: 'PAYLOAD DRAFTED' },
      { label: 'RENDERING…', done: 'RENDER COMPLETE' },
      { label: 'PUBLISHING…', done: 'PUBLISHED [OK]' },
    ], payoff: '+$3.22 LOGGED',
  },
  {
    key: 'predict', callsign: 'UNIT-02', name: 'PREDICTOR', brief: 'Market-odds tracking',
    steps: [
      { label: 'SCANNING MARKETS…', done: 'EDGE DETECTED' },
      { label: 'POSITIONING…', done: 'POSITION SET' },
      { label: 'AWAITING RESOLUTION…', done: 'RESOLVED YES' },
    ], payoff: '+$18.75 LOGGED',
  },
  {
    key: 'trade', callsign: 'UNIT-03', name: 'TRADER', brief: 'Strategy execution',
    steps: [
      { label: 'RULE ARMED…', done: 'TRIGGER MET' },
      { label: 'SIZING TO CAPS…', done: 'CAPS APPLIED' },
      { label: 'EXECUTING…', done: 'EXECUTED [OK]' },
    ], payoff: '+$41.20 LOGGED',
  },
  {
    key: 'flip', callsign: 'UNIT-04', name: 'FLIPPER', brief: 'Arbitrage sourcing',
    steps: [
      { label: 'SCANNING LISTINGS…', done: 'TARGET FOUND' },
      { label: 'NEGOTIATING…', done: 'ACQUIRED $89' },
      { label: 'RELISTING…', done: 'SOLD $117 [OK]' },
    ], payoff: '+$27.40 LOGGED',
  },
]

export const MM2_SWARM = {
  eyebrow: 'SCALABILITY',
  head: 'Today: one unit. Tomorrow: a swarm.',
  sub: 'Every worker you deploy reports to the same mission control. Specialized units, working in formation, at whatever scale your capital can support.',
}

export const MM2_MANIFEST = {
  eyebrow: 'FLIGHT MANIFEST',
  head: 'RESERVE YOUR UNIT',
  sub: 'General access has not opened. Reservations are logged in launch order.',
  counterLabel: 'RESERVATIONS LOGGED',
  fine: 'Demo experience with scripted data. Workers act only within limits you set; returns are never guaranteed and trading involves risk.',
}
