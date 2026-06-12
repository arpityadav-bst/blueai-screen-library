import type { Metadata } from 'next'
import { AgentShell } from '@/components/agent/AgentShell'
import { MarketsForm } from '@/components/agent/MarketsForm'
import { MARKETS } from '@/lib/agents-data'

export const metadata: Metadata = {
  title: 'Prediction Market Agent: Track Polymarket & Kalshi Odds | BlueAI',
  description:
    'Point BlueAI at Polymarket and Kalshi markets, including the 2026 World Cup. It reads the live odds, tracks every move, and emails you when an outcome swings past your threshold. Odds info, not betting advice.',
}

const ODDS: [string, string, string, string][] = [
  ['Spain', '16.5%', '16.5%', '0.0 pt'],
  ['France', '16.1%', '16.2%', '0.1 pt'],
  ['England', '10.9%', '10.8%', '0.1 pt'],
  ['Portugal', '10.9%', '10.6%', '0.3 pt'],
  ['Argentina', '8.6%', '8.7%', '0.1 pt'],
  ['Brazil', '8.5%', '8.4%', '0.1 pt'],
  ['Germany', '5.3%', '5.5%', '0.2 pt'],
  ['Netherlands', '4.1%', '4.7%', '0.6 pt'],
]

function OddsTable() {
  return (
    <section className="ag-section is-anchor" id="odds">
      <div className="site-wrap" data-reveal>
        <span className="site-eyebrow">Read by the agent</span>
        <h2 className="site-h2">World Cup 2026 winner, Polymarket vs Kalshi</h2>
        <p className="site-sub">The same outcome priced on two venues. The agent reads both and flags the gap, where the markets disagree. Implied probability as of Jun 10, 2026; market resolves Jul 20, 2026.</p>
        <div className="ag-odds">
          <table>
            <thead><tr><th>Team</th><th className="num">Polymarket</th><th className="num">Kalshi</th><th className="num">Gap</th></tr></thead>
            <tbody>
              {ODDS.map(([team, pm, ka, gap]) => (
                <tr key={team}><td>{team}</td><td className="num">{pm}</td><td className="num">{ka}</td><td className="num gap">{gap}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ag-odds-note">A dated snapshot of public market odds for illustration, not a recommendation or a prediction. The gap between venues is descriptive data, not a bet to place. Access to some prediction markets is restricted by location; use only markets that are legal and available to you.</p>
      </div>
    </section>
  )
}

export default function PredictionMarketPage() {
  return <AgentShell data={MARKETS} demo={<MarketsForm />} feature={<OddsTable />} />
}
