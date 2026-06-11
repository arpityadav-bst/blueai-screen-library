// Foundations sections for the style guide — Colors · Type · Spacing/Radius/Elevation.
// Each is an id'd <section> so the sidebar can scroll-to + scroll-spy highlight.
import { Wordmark } from '@/components/Wordmark'

function Swatch({ name, value, cls }: { name: string; value: string; cls: string }) {
  return (
    <div className="overflow-hidden rounded-card border border-divider">
      <div className={`h-14 ${cls}`} />
      <div className="px-2.5 py-2">
        <p className="text-xs font-semibold text-ink-heading">{name}</p>
        <p className="font-mono text-[10px] text-ink-muted">{value}</p>
      </div>
    </div>
  )
}

export function Foundations() {
  return (
    <>
      {/* COLORS */}
      <section id="colors" className="scroll-mt-8">
        <h2 className="mb-5 text-xl font-semibold text-ink-display">Colors</h2>
        <p className="bai-section-label mb-3">Brand — only ever together, as a gradient</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Swatch name="Gradient" value="iris → cyan" cls="bg-bai-gradient" />
          <Swatch name="10% wash" value="pills" cls="bg-bai-wash" />
          <Swatch name="Iris" value="#7B4CFF" cls="bg-iris" />
          <Swatch name="Cyan" value="#0EA4C5" cls="bg-cyan" />
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
          <Swatch name="Success" value="#22C55E" cls="bg-status-success" />
          <Swatch name="Warning" value="#F59E0B" cls="bg-status-warning" />
          <Swatch name="Danger" value="#EF4444" cls="bg-status-danger" />
          <Swatch name="Info" value="#3B82F6" cls="bg-status-info" />
          <Swatch name="Scheduled" value="#9333EA" cls="bg-status-scheduled" />
          <Swatch name="Jobs" value="#F97316" cls="bg-status-jobs" />
        </div>
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
          <p className="bai-caption">Caption — 10 / 400</p>
          <p className="bai-eyebrow">Eyebrow — 10, +0.10em tracking</p>
          <p className="bai-section-label">Section label — 10 / 600 uppercase</p>
          <p className="bai-body text-ink-muted"><Wordmark size={20} /> — wordmark (Bricolage 700)</p>
          <p className="bai-count">4.9k — gradient count</p>
          <p className="font-head text-3xl font-semibold tracking-tight-3 text-ink-display">Space Grotesk — marketing display</p>
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
          </div>
          <div className="rounded-field border border-divider bg-surface p-5">
            <p className="bai-section-label mb-4">Radius</p>
            <div className="flex flex-wrap items-end gap-4">
              {[['badge', 'rounded-badge', '2'], ['card', 'rounded-card', '8'], ['field', 'rounded-field', '12'], ['chat', 'rounded-chat', '16'], ['credits', 'rounded-credits', '24']].map(([n, c, v]) => (
                <div key={n} className="text-center"><div className={`size-14 border border-stroke bg-canvas ${c}`} /><p className="mt-1.5 text-2xs text-ink-muted">{n} · {v}</p></div>
              ))}
              {/* pill = stadium: shown WIDE so it reads as a pill, not a circle (128px radius on a square = circle) */}
              <div className="text-center"><div className="h-14 w-24 rounded-pill border border-stroke bg-canvas" /><p className="mt-1.5 text-2xs text-ink-muted">pill · 128</p></div>
              <div className="text-center"><div className="size-14 rounded-circle border border-stroke bg-canvas" /><p className="mt-1.5 text-2xs text-ink-muted">circle</p></div>
            </div>
          </div>
          <div className="rounded-field border border-divider bg-surface p-5">
            <p className="bai-section-label mb-4">Elevation</p>
            <div className="flex flex-wrap gap-3">
              <div className="text-center"><div className="size-14 rounded-field border border-divider bg-canvas shadow-float" /><p className="mt-1.5 text-2xs text-ink-muted">float</p></div>
              <div className="text-center"><div className="size-14 rounded-field border border-divider bg-canvas shadow-overlay" /><p className="mt-1.5 text-2xs text-ink-muted">overlay</p></div>
              <div className="text-center"><div className="size-14 rounded-field bg-cta-gradient shadow-cta" /><p className="mt-1.5 text-2xs text-ink-muted">cta</p></div>
              <div className="text-center"><div className="size-14 rounded-field border border-divider bg-canvas shadow-brand-sm" /><p className="mt-1.5 text-2xs text-ink-muted">brand-sm</p></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
