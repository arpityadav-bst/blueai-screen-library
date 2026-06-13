// Foundations sections for the style guide — Colors · Type · Spacing/Radius/Elevation.
// Each is an id'd <section> so the sidebar can scroll-to + scroll-spy highlight.
import { Wordmark } from '@/components/Wordmark'
import { Sparkle } from '@/components/Sparkle'
import { Arrow } from '@/components/Arrow'
import { MotionDemo } from '@/components/style-guide/MotionDemo'

function Swatch({ id, name, value, cls = '', style }: { id?: string; name: string; value: string; cls?: string; style?: React.CSSProperties }) {
  return (
    <div id={id} className="overflow-hidden rounded-card border border-divider">
      <div className={`h-14 ${cls}`} style={style} />
      <div className="px-2.5 py-2">
        <p className="text-xs font-semibold text-ink-heading">{name}</p>
        <p className="font-mono text-xs text-ink-muted">{value}</p>
      </div>
    </div>
  )
}

// Inline glyph helper for the Icons section — uniform 24-box, 2px stroke, currentColor.
const I = ({ d, children }: { d?: string; children?: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d ? <path d={d} /> : children}</svg>
)

// The shared site/UI glyphs — Sparkle + Arrow are exported primitives, the rest live inline
// across the chrome (header, composer, agent forms). Documented so anatomy tables can name them.
const ICONS: { name: string; use: string; glyph: React.ReactNode }[] = [
  { name: 'Sparkle', use: 'CTA spark · SSOT', glyph: <Sparkle size={22} /> },
  { name: 'Arrow', use: 'CTA / link', glyph: <Arrow size={22} /> },
  { name: 'External', use: 'opens new tab', glyph: <I><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></I> },
  { name: 'Chevron', use: 'expand / next', glyph: <I d="M9 6l6 6-6 6" /> },
  { name: 'Menu', use: 'mobile nav', glyph: <I d="M4 7h16M4 12h16M4 17h16" /> },
  { name: 'Close', use: 'dismiss', glyph: <I d="M6 6 18 18M18 6 6 18" /> },
  { name: 'Send', use: 'composer submit', glyph: <I d="M12 19V5M5 12l7-7 7 7" /> },
  { name: 'Check', use: 'verified / done', glyph: <I d="M20 6 9 17l-5-5" /> },
  { name: 'Upload', use: 'file field', glyph: <I><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></I> },
]

export function Foundations() {
  return (
    <>
      {/* COLORS */}
      <section id="colors" className="scroll-mt-8">
        <h2 className="mb-5 text-xl font-semibold text-ink-display">Colors</h2>
        <p className="bai-section-label mb-3">Brand — only ever together, as a gradient</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Swatch id="tok-gradient" name="Gradient" value="iris → cyan" cls="bg-bai-gradient" />
          <Swatch name="10% wash" value="pills" cls="bg-bai-wash" />
          <Swatch name="Iris" value="#7B4CFF" cls="bg-iris" />
          <Swatch name="Cyan" value="#0EA4C5" cls="bg-cyan" />
          <Swatch id="tok-cta-gradient" name="CTA gradient" value="blue→violet · Download pill" style={{ background: 'var(--bai-cta-gradient)' }} />
          <Swatch name="CTA band" value="dark close-CTA · ink→iris" style={{ background: 'var(--bai-cta-band)' }} />
        </div>
        <p className="bai-section-label mb-3 mt-6">Neutral ramp (cool, blue-cast)</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          <Swatch name="Ink display" value="#080A1F" cls="bg-ink-display" />
          <Swatch name="Ink heading" value="#1B1E38" cls="bg-ink-heading" />
          <Swatch name="Ink body" value="#2B2E4C" cls="bg-ink-body" />
          <Swatch name="Ink muted" value="#434664" cls="bg-ink-muted" />
          <Swatch name="Stroke" value="#B6B8CC" cls="bg-stroke" />
          <Swatch name="Divider" value="#DFE4EE" cls="bg-divider" />
          <Swatch name="Surface" value="#F7FAFF" cls="bg-surface" />
          <Swatch name="Canvas" value="#FFFFFF" cls="bg-canvas" />
        </div>
        <p className="bai-section-label mb-3 mt-6">Accent + semantic status (from the PM design system)</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          <Swatch name="Accent" value="#1990FF" cls="bg-accent" />
          <Swatch name="Indigo" value="#4F46E5 · PM 2nd accent" style={{ background: 'var(--bai-indigo)' }} />
          <Swatch name="Success" value="#22C55E" cls="bg-status-success" />
          <Swatch name="Warning" value="#F59E0B" cls="bg-status-warning" />
          <Swatch name="Danger" value="#EF4444" cls="bg-status-danger" />
          <Swatch name="Info" value="#3B82F6" cls="bg-status-info" />
          <Swatch name="Scheduled" value="#9333EA" cls="bg-status-scheduled" />
          <Swatch name="Jobs" value="#F97316" cls="bg-status-jobs" />
        </div>
        <p className="bai-section-label mb-3 mt-6">Marketing surface — homepage · SEO · hero chrome (not the in-app panel)</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Swatch name="Mkt slate" value="#0F172A · text" style={{ background: 'var(--bai-mkt-slate)' }} />
          <Swatch id="tok-mkt-blue" name="Mkt blue" value="#2F6DFF · links" style={{ background: 'var(--bai-mkt-blue)' }} />
          <Swatch name="Mkt blue-2" value="#3D7BFF · eyebrow" style={{ background: 'var(--bai-mkt-blue-2)' }} />
          <Swatch name="Mkt green" value="#16A34A · live" style={{ background: 'var(--bai-mkt-green)' }} />
          <Swatch name="Green wash" value="green · .10α" style={{ background: 'var(--bai-mkt-green-wash)' }} />
          <Swatch id="tok-page-grad" name="Page bg" value="page-grad · F5F6FD→EEF1FB" style={{ background: 'var(--bai-page-grad)' }} />
          <Swatch name="Green ink" value="#0F7A3B · LIVE / applied text" style={{ background: 'var(--bai-mkt-green-ink)' }} />
          <Swatch name="Star" value="#F5A623 · rating gold" style={{ background: 'var(--bai-star)' }} />
        </div>
        <p className="mt-2 text-2xs leading-relaxed text-ink-muted">A distinct marketing palette (slate · blue · green, + the darker green ink for LIVE/applied text) for the homepage / SEO / hero chrome — separate from the brand gradient and the in-app ink ramp. Star gold is the one semantic that sits off the brand system (review ratings).</p>
      </section>

      {/* TYPE */}
      <section id="type" className="scroll-mt-8">
        <h2 className="mb-5 text-xl font-semibold text-ink-display">Type scale</h2>
        <div className="space-y-3 rounded-field border border-divider bg-surface p-6">
          <p className="bai-hero">Hero — 28 / 800</p>
          <p className="bai-h1">Display / H1 — 24 / 700</p>
          <p className="bai-h2">Heading H2 — 20 / 700</p>
          <p className="bai-h3">Heading H3 — 17 / 700</p>
          <p className="bai-h4">Heading H4 — 15 / 600</p>
          <p className="bai-h5">Heading H5 — 13 / 600</p>
          <p className="bai-body-lg">Body large — 16 / 400, the calm reading size.</p>
          <p className="bai-body">Body — 14 / 400, the default UI/body text.</p>
          <p className="bai-body-sm">Body small — 12 / 400.</p>
          <p className="bai-label">Label — 12 / 500</p>
          <p className="text-2xs">Fine print — 11 / 400 (text-2xs) — doc captions, table footnotes, counts</p>
          <p className="bai-caption">Caption — 10 / 400</p>
          <p className="bai-eyebrow">Eyebrow — 10, +0.10em tracking</p>
          <p className="bai-section-label">Section label — 10 / 600 uppercase</p>
          <p className="bai-body text-ink-muted"><Wordmark size={20} /> — wordmark (Bricolage 700)</p>
          <p className="bai-count">4.9k — gradient count</p>
          <p className="font-head text-3xl font-semibold tracking-tight-3 text-ink-display">Space Grotesk — marketing display</p>
        </div>
      </section>

      {/* ICONS */}
      <section id="icons" className="scroll-mt-8">
        <h2 className="mb-1 text-xl font-semibold text-ink-display">Icons</h2>
        <p className="mb-5 text-2xs leading-relaxed text-ink-muted">Shared line glyphs — 24 box, ~2px stroke, currentColor (they take the color of context). Sparkle + Arrow are exported primitives; the rest are inline across the chrome, composer, and agent forms.</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {ICONS.map((ic) => (
            <div key={ic.name} className="flex flex-col items-center gap-1.5 rounded-card border border-divider bg-surface px-2 py-4 text-center">
              <span className="flex h-7 items-center text-ink-heading">{ic.glyph}</span>
              <span className="text-2xs font-semibold text-ink-heading">{ic.name}</span>
              <span className="text-xs leading-tight text-ink-muted">{ic.use}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SCALES */}
      <section id="scales" className="scroll-mt-8">
        <h2 className="mb-5 text-xl font-semibold text-ink-display">Spacing · Radius · Elevation</h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-field border border-divider bg-surface p-5">
            <p className="bai-section-label mb-4">Spacing — 4pt baseline</p>
            <div className="space-y-2">
              {[['1', 4], ['2', 8], ['3', 10], ['4', 12], ['5', 16], ['6', 20], ['7', 32], ['8', 36]].map(([k, v]) => (
                <div key={k} className="flex items-center gap-3"><span className="w-5 text-2xs text-ink-muted">{k}</span><span className="h-3 rounded-sm bg-bai-gradient" style={{ width: v as number }} /><span className="text-2xs text-ink-muted">{v}px</span></div>
              ))}
            </div>
            <p className="mt-3 text-2xs leading-relaxed text-ink-muted">Content width — <span className="font-mono">--bai-content</span> 1180px (the shared content column; a full-bleed nav runs over it).</p>
          </div>
          <div className="rounded-field border border-divider bg-surface p-5">
            <p className="bai-section-label mb-4">Radius</p>
            <div className="flex flex-wrap items-end gap-4">
              {[['badge', 'rounded-badge', '2', 'status chips'], ['card', 'rounded-card', '8', 'cards · buttons'], ['field', 'rounded-field', '12', 'inputs · panels'], ['chat', 'rounded-chat', '16', 'sheets · tiles'], ['credits', 'rounded-credits', '24', 'popups']].map(([n, c, v, u]) => (
                <div key={n} className="w-[60px] text-center"><div className={`size-14 border border-stroke bg-canvas ${c}`} /><p className="mt-1.5 text-2xs text-ink-muted">{n} · {v}</p><p className="text-xs leading-tight text-ink-muted/70">{u}</p></div>
              ))}
              {/* pill = stadium: shown WIDE so it reads as a pill, not a circle (128px radius on a square = circle) */}
              <div id="tok-radius-pill" className="w-24 text-center"><div className="h-14 w-24 rounded-pill border border-stroke bg-canvas" /><p className="mt-1.5 text-2xs text-ink-muted">pill · 128</p><p className="text-xs leading-tight text-ink-muted/70">CTAs · chips</p></div>
              <div className="w-[60px] text-center"><div className="size-14 rounded-circle border border-stroke bg-canvas" /><p className="mt-1.5 text-2xs text-ink-muted">circle</p><p className="text-xs leading-tight text-ink-muted/70">avatars · dots</p></div>
            </div>
          </div>
          <div className="rounded-field border border-divider bg-surface p-5">
            <p className="bai-section-label mb-4">Elevation</p>
            <div className="flex flex-wrap gap-3">
              <div className="w-[68px] text-center"><div className="size-14 rounded-field border border-divider bg-canvas shadow-hairline" /><p className="mt-1.5 text-2xs text-ink-muted">hairline</p><p className="text-xs leading-tight text-ink-muted/70">resting cards</p></div>
              <div className="w-[68px] text-center"><div className="size-14 rounded-field border border-divider bg-canvas shadow-float" /><p className="mt-1.5 text-2xs text-ink-muted">float</p><p className="text-xs leading-tight text-ink-muted/70">cards on hover</p></div>
              <div className="w-[68px] text-center"><div className="size-14 rounded-field border border-divider bg-canvas shadow-overlay" /><p className="mt-1.5 text-2xs text-ink-muted">overlay</p><p className="text-xs leading-tight text-ink-muted/70">popups · sheets</p></div>
              <div id="tok-shadow-cta" className="w-[68px] text-center"><div className="size-14 rounded-field bg-cta-gradient shadow-cta" /><p className="mt-1.5 text-2xs text-ink-muted">cta</p><p className="text-xs leading-tight text-ink-muted/70">brand buttons</p></div>
              <div className="w-[68px] text-center"><div className="size-14 rounded-field border border-divider bg-canvas shadow-brand-sm" /><p className="mt-1.5 text-2xs text-ink-muted">brand-sm</p><p className="text-xs leading-tight text-ink-muted/70">subtle lift</p></div>
            </div>
          </div>
          <div className="rounded-field border border-divider bg-surface p-5 lg:col-span-3">
            <p className="bai-section-label mb-4">Motion — hover / replay to see it</p>
            <MotionDemo />
          </div>
        </div>
      </section>
    </>
  )
}
