'use client'
// The agent-page demo components (replicated from the live bluestacks.ai forms, built on blueAI
// tokens). Renders the REAL components wrapped in .v-agent so the doc can't drift from the source.
import '@/styles/agent.css'
import { CareerForm } from '@/components/agent/CareerForm'
import { FinanceForm } from '@/components/agent/FinanceForm'
import { FileUpload } from '@/components/agent/FileUpload'
import { VideoCard } from '@/components/agent/VideoCard'

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
        <div className="ag-vids max-w-[200px]">
          <VideoCard v={{ badge: 'Micro Drama', t: 'He Thought He Bought His Bride', meta: 'Kai · Ep. 1 · 1:02', file: 'kai-bride' }} />
        </div>
      </Card>
    </div>
  )
}
