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
      <Card id="agent-form" title="Demo form kit (.jmf-*) — input · multi-select pills · select · upload · checkbox · submit"
        note={<>The shared form primitives behind all 4 agent demos. Accent = <span className="font-mono">--bai-mkt-blue</span> (solid, not the brand gradient); focus ring <span className="font-mono">rgba(--bai-mkt-blue-rgb / .15)</span>; radii <span className="font-mono">--radius-md/-pill</span>. Source: <span className="font-mono">components/agent/CareerForm.tsx</span>.</>}>
        <div className="max-w-[420px]"><CareerForm /></div>
      </Card>

      {/* Tabbed variant + textarea + hint */}
      <Card id="agent-form-tabs" title="Tabbed form variant — segmented toggle · textarea · hint"
        note={<>Finance/Markets demos add an <span className="font-mono">aria-pressed</span> segmented toggle (NOT a full ARIA tablist), a <span className="font-mono">.jmf-textarea</span>, and a <span className="font-mono">.jmf-hint</span>. Source: <span className="font-mono">FinanceForm.tsx</span> / <span className="font-mono">MarketsForm.tsx</span>.</>}>
        <div className="max-w-[420px]"><FinanceForm /></div>
      </Card>

      {/* FileUpload — all states (taste rule 24) */}
      <Card id="agent-upload" title="File upload — empty → filled → remove"
        note="Every state, per taste rule 24. Empty: Choose file + No file chosen. Click it: filename + remove (✕), box flips dashed→solid. ✕ resets to empty. One component, reused by the Resume + holdings fields.">
        <div className="max-w-[420px]"><FileUpload accept=".pdf,.doc,.docx,image/*" /></div>
      </Card>

      {/* Trade-log rows + BUY/SELL badges */}
      <Card id="agent-trades" title="Trade-log row + BUY / SELL badges"
        note={<>BUY = <span className="font-mono">--bai-success-*</span>, SELL = <span className="font-mono">--bai-danger-*</span> (the semantic status tokens). Row grid: date · style · action · ticker · value (reflows to 2 lines under 560px).</>}>
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
      <Card id="agent-video" title="Video card — poster + click-to-play"
        note="Real <video> (poster + loop/playsInline/preload=metadata, no native controls); a custom play overlay that hides while playing. Click toggles play/pause. Used in the creator 'Made by the agent' showcase.">
        <div className="ag-vids" style={{ gridTemplateColumns: '1fr', maxWidth: 220 }}>
          <VideoCard v={{ badge: 'Micro Drama', t: 'He Thought He Bought His Bride', meta: 'Kai · Ep. 1 · 1:02', file: 'kai-bride' }} />
        </div>
      </Card>

      {/* Openings grid card (apply-to-jobs) + the source/Remote tags */}
      <Card id="agent-openings" title="Openings card + source tags (.ag-job)"
        note="The job-listing card in the apply-to-jobs 'All openings' grid: source tag (.ag-tag.src) + Remote tag (.ag-tag.rem) + title + company·loc + 'View role →'.">
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
      <Card id="agent-portfolio" title="Portfolio card + benchmark (.ag-port / .ag-bench)"
        note="Paper-portfolio card: style label + mono return (success color) + description + holdings rows + rotations note; plus the SPY benchmark pill.">
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
      <Card id="agent-odds" title="Odds table (.ag-odds) — the only table in the DS"
        note="Polymarket-vs-Kalshi data table: mono numeric columns (right-aligned), the gap column accented, zebra-free hairline rows.">
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
      <Card id="agent-caps" title="Capability card (.ag-cap)"
        note="Emoji + title + description card — the 'What it makes' 3-up on the creator page.">
        <div className="ag-caps" style={{ gridTemplateColumns: '1fr' }}>
          <div className="ag-cap"><span className="ag-cap-emoji">🎭</span><h4>Micro dramas</h4><p>Character-driven episodic stories — the hook most AI video tools cannot do.</p></div>
        </div>
      </Card>

      {/* More-agents cross-link card (AgentShell) */}
      <Card id="agent-more" title="More-agents cross-link card (.ag-more-card)"
        note="Tinted-icon nav card (icon tile + label + title + → arrow); the 'Explore the other agents' row on every agent page.">
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
