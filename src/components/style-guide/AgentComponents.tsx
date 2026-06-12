'use client'
// The agent-page demo components (replicated from the live bluestacks.ai forms, built on blueAI
// tokens). Renders the REAL components wrapped in .v-agent so the doc can't drift from the source.
import '@/styles/agent.css'
import { CareerForm } from '@/components/agent/CareerForm'
import { FinanceForm } from '@/components/agent/FinanceForm'
import { FileUpload } from '@/components/agent/FileUpload'
import { VideoCard } from '@/components/agent/VideoCard'
import { Arrow } from '@/components/Arrow'

function Card({ id, title, note, children }: { id: string; title: string; note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8 rounded-field border border-divider bg-surface p-5">
      <p className="bai-section-label mb-1">{title}</p>
      {note && <p className="mb-4 text-2xs leading-relaxed text-ink-muted">{note}</p>}
      <div className="v-agent">{children}</div>
    </section>
  )
}

const TRADES: [string, string, 'buy' | 'sell', string, string][] = [
  ['Jun 9, 2026', 'Mean Reversion', 'buy', 'DOW', '$10,323'],
  ['Jun 9, 2026', 'Breakout / Compression', 'sell', 'KIM', '$11,166'],
]

export function AgentComponents() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* The .jmf form kit — rendered live via the real CareerForm */}
      <Card id="agent-form" title="Demo form kit"
        note="The shared form kit — input · multi-select pills · select · upload · checkbox · submit. Accent is solid blue, not the brand gradient.">

        <div className="max-w-[420px]"><CareerForm /></div>
      </Card>

      {/* Tabbed variant + textarea + hint */}
      <Card id="agent-form-tabs" title="Tabbed form variant"
        note="Tabbed variant (Finance / Markets) — a segmented toggle, a textarea, and a helper hint.">

        <div className="max-w-[420px]"><FinanceForm /></div>
      </Card>

      {/* FileUpload — all states (taste rule 24) */}
      <Card id="agent-upload" title="File upload"
        note="All states — empty (Choose file) → filled (filename + ✕ remove, box flips dashed to solid) → cleared.">

        <div className="max-w-[420px]"><FileUpload accept=".pdf,.doc,.docx,image/*" /></div>
      </Card>

      {/* Trade-log rows + BUY/SELL badges */}
      <Card id="agent-trades" title="Trade log + badges"
        note="Trade-log row — date · style · BUY / SELL badge · ticker · value (BUY green, SELL red; reflows on mobile).">

        <div className="ag-trades w-full">
          {TRADES.map(([d, s, a, tk, v]) => (
            <div className="ag-trade" key={tk}>
              <span className="ag-trade-date">{d}</span>
              <span className="ag-trade-style">{s}</span>
              <span className={`ag-trade-act ${a}`}>{a.toUpperCase()}</span>
              <span className="ag-trade-tk">{tk}</span>
              <span className="ag-trade-v">{v}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* VideoCard — click-to-play */}
      <Card id="agent-video" title="Video card"
        note="Poster + click-to-play (loops, no native controls); the play overlay hides while playing.">

        <div className="ag-vids" style={{ gridTemplateColumns: '1fr', maxWidth: 220 }}>
          <VideoCard v={{ badge: 'Micro Drama', t: 'He Thought He Bought His Bride', meta: 'Kai · Ep. 1 · 1:02', file: 'kai-bride' }} />
        </div>
      </Card>

      {/* Openings grid card (apply-to-jobs) + the source/Remote tags */}
      <Card id="agent-openings" title="Openings card"
        note="Job-listing card — source tag · Remote tag · title · company·location · View role.">
        <div className="ag-openings">
          {[['AI/ML Data Contributor', 'TSMG Holding · United States (Remote)', true], ['Senior Product Designer, Agentic AI', 'Atlassian · San Francisco (Hybrid)', false]].map(([t, co, rem]) => (
            <div className="ag-job" key={t as string}>
              <div className="ag-job-badges"><span className="ag-tag src">LinkedIn</span>{rem && <span className="ag-tag rem">Remote</span>}</div>
              <h4>{t}</h4><p className="co">{co}</p><span className="ag-job-link">View role →</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Portfolio card + benchmark pill (ai-trading-agent) */}
      <Card id="agent-portfolio" title="Portfolio card + benchmark"
        note="Paper-portfolio card — style · return · holdings · rotations; plus the SPY benchmark pill.">

        <div className="ag-ports" style={{ gridTemplateColumns: '1fr' }}>
          <div className="ag-port">
            <div className="ag-port-style">Momentum</div>
            <div className="ag-port-ret">+12.76%</div>
            <p className="ag-port-d">Top names by 12-month trend strength, in an uptrend.</p>
            <div className="ag-port-holds">
              {[['MU', '+88%'], ['STX', '+44%']].map(([tk, pc]) => <div className="ag-hold" key={tk}><span className="tk">{tk}</span><span className="pc">{pc}</span></div>)}
            </div>
            <p className="ag-port-rot">No rotations yet, held since inception</p>
          </div>
        </div>
        <div className="v-agent" style={{ marginTop: 12 }}><span className="ag-bench">Benchmark · S&amp;P 500 (SPY) <b>+3.24%</b> over the same window</span></div>
      </Card>

      {/* Odds table (prediction-market-agent) */}
      <Card id="agent-odds" title="Odds table"
        note="The odds data table — right-aligned numeric columns, accented gap column.">

        <div className="ag-odds">
          <table>
            <thead><tr><th>Team</th><th className="num">Polymarket</th><th className="num">Kalshi</th><th className="num">Gap</th></tr></thead>
            <tbody>
              {[['Spain', '16.5%', '16.5%', '0.0 pt'], ['Portugal', '10.9%', '10.6%', '0.3 pt']].map(([team, pm, ka, gap]) => (
                <tr key={team}><td>{team}</td><td className="num">{pm}</td><td className="num">{ka}</td><td className="num gap">{gap}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Capability card (ai-video-creator) */}
      <Card id="agent-caps" title="Capability card"
        note="Emoji + title + description card.">

        <div className="ag-caps" style={{ gridTemplateColumns: '1fr' }}>
          <div className="ag-cap"><span className="ag-cap-emoji">🎭</span><h4>Micro dramas</h4><p>Character-driven episodic stories — the hook most AI video tools cannot do.</p></div>
        </div>
      </Card>

      {/* More-agents cross-link card (AgentShell) */}
      <Card id="agent-more" title="More-agents card"
        note="Cross-link nav card — tinted icon · label · title · → arrow.">

        <div className="ag-more" style={{ gridTemplateColumns: '1fr' }}>
          <a className="ag-more-card" href="#0">
            <span className="ag-more-ic ic-career">💼</span>
            <span className="ag-more-tx"><b>Career</b><span>Auto apply to jobs</span></span>
            <Arrow size={16} />
          </a>
        </div>
      </Card>
    </div>
  )
}
