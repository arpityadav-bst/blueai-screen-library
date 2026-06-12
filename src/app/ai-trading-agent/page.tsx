import type { Metadata } from 'next'
import { AgentShell } from '@/components/agent/AgentShell'
import { FinanceForm } from '@/components/agent/FinanceForm'
import { FINANCE } from '@/lib/agents-data'

export const metadata: Metadata = {
  title: 'AI Trading Agent: Live Market Analysis | BlueAI',
  description:
    'Upload your holdings or ask about any US stock. BlueAI pulls live market data, runs momentum, RSI, ADX and volatility, and emails you a clear breakdown. Data analysis, not advice.',
}

const PORTS = [
  { style: 'Momentum', ret: '+12.76%', d: 'Top names by 12-month trend strength, in an uptrend.', holds: [['MU', '+88%'], ['STX', '+44%'], ['WDC', '+28%']], rot: 'No rotations yet, held since inception' },
  { style: 'Mean Reversion', ret: '+3.23%', d: 'Most oversold large-caps still above their 200-day average.', holds: [['CBOE', '+5%'], ['BMY', '+3%'], ['VZ', '+2%']], rot: '86 rotations, last Jun 9, 2026' },
  { style: 'Breakout / Compression', ret: '+8.97%', d: 'Tightest volatility compression near 52-week highs.', holds: [['MS', '+9%'], ['PFG', '+7%'], ['C', '+4%']], rot: '50 rotations, last Jun 9, 2026' },
  { style: 'AI Theme', ret: '+4.40%', d: 'Leading AI and semiconductor names by trend and theme strength.', holds: [['NVDA', '+6%'], ['AVGO', '+5%'], ['HUT', '+4%']], rot: '6 rotations, last Jun 8, 2026' },
]

const TRADES = [
  { d: 'Jun 9, 2026', s: 'Mean Reversion', a: 'SELL', tk: 'APD', v: '$10,394' },
  { d: 'Jun 9, 2026', s: 'Mean Reversion', a: 'SELL', tk: 'VTR', v: '$10,530' },
  { d: 'Jun 9, 2026', s: 'Mean Reversion', a: 'BUY', tk: 'DOW', v: '$10,323' },
  { d: 'Jun 9, 2026', s: 'Mean Reversion', a: 'BUY', tk: 'CIEN', v: '$10,323' },
  { d: 'Jun 9, 2026', s: 'Breakout / Compression', a: 'SELL', tk: 'KIM', v: '$11,166' },
  { d: 'Jun 9, 2026', s: 'Breakout / Compression', a: 'BUY', tk: 'SNA', v: '$10,897' },
  { d: 'Jun 8, 2026', s: 'Mean Reversion', a: 'SELL', tk: 'ETR', v: '$10,240' },
  { d: 'Jun 8, 2026', s: 'Mean Reversion', a: 'BUY', tk: 'CTVA', v: '$10,166' },
  { d: 'Jun 8, 2026', s: 'AI Theme', a: 'SELL', tk: 'LASR', v: '$10,919' },
  { d: 'Jun 8, 2026', s: 'AI Theme', a: 'BUY', tk: 'HUT', v: '$11,214' },
  { d: 'Jun 5, 2026', s: 'Breakout / Compression', a: 'SELL', tk: 'SLB', v: '$10,254' },
  { d: 'Jun 5, 2026', s: 'Breakout / Compression', a: 'BUY', tk: 'REG', v: '$10,741' },
  { d: 'Jun 4, 2026', s: 'Mean Reversion', a: 'SELL', tk: 'TSN', v: '$10,318' },
  { d: 'Jun 4, 2026', s: 'Mean Reversion', a: 'BUY', tk: 'VZ', v: '$10,351' },
  { d: 'Jun 3, 2026', s: 'Mean Reversion', a: 'SELL', tk: 'DOW', v: '$10,509' },
]

function Trades() {
  return (
    <section className="ag-section">
      <div className="site-wrap" data-reveal>
        <span className="site-eyebrow">The agent’s moves</span>
        <h2 className="site-h2">Every trade the agents have made</h2>
        <p className="site-sub">Each row is a position change, newest first. When a holding falls out of its rule’s band, the agent sells it and buys the next-ranked name. Names that stay in the band are held.</p>
        <div className="ag-trades">
          {TRADES.map((t, i) => (
            <div className="ag-trade" key={i}>
              <span className="ag-trade-date">{t.d}</span>
              <span className="ag-trade-style">{t.s}</span>
              <span className={`ag-trade-act ${t.a === 'BUY' ? 'buy' : 'sell'}`}>{t.a}</span>
              <span className="ag-trade-tk">{t.tk}</span>
              <span className="ag-trade-v">{t.v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Portfolios() {
  return (
    <section className="ag-section is-anchor" id="portfolios">
      <div className="site-wrap" data-reveal>
        <span className="site-eyebrow">Run by the agent</span>
        <h2 className="site-h2">Live agent portfolios, by trading style</h2>
        <p className="site-sub">Four paper portfolios, one per trading style, each seeded with a hypothetical $100,000 at inception. The agent re-runs each rule daily and rotates a position only when a holding drops out of its band.</p>
        <div className="ag-ports">
          {PORTS.map((p) => (
            <div className="ag-port" key={p.style}>
              <div className="ag-port-style">{p.style}</div>
              <div className="ag-port-ret">{p.ret}</div>
              <p className="ag-port-d">{p.d}</p>
              <div className="ag-port-holds">
                {p.holds.map(([tk, pc]) => (<div className="ag-hold" key={tk}><span className="tk">{tk}</span><span className="pc">{pc}</span></div>))}
              </div>
              <p className="ag-port-rot">{p.rot}</p>
            </div>
          ))}
        </div>
        <div className="ag-bench">Benchmark · S&amp;P 500 (SPY) <b>+3.24%</b> over the same window</div>
      </div>
    </section>
  )
}

export default function TradingAgentPage() {
  return <AgentShell data={FINANCE} demo={<FinanceForm />} feature={<><Portfolios /><Trades /></>} />
}
