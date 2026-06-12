// The recipe table that pairs with a live PREVIEW. Each row maps ONE build concern —
// left: the literal class/style recipe (token names linked to Foundations); right: its
// plain-English role. Reserved for the complex, brand-defining, reused components where a
// dev needs the build order. Simple atoms keep the lighter show + terse-note treatment —
// the role belongs in prose, the recipe belongs HERE, never crammed back into the note.

// A token name that links to its Foundations definition (the cross-link, like WSUP's).
export function Tok({ children, to }: { children: React.ReactNode; to?: string }) {
  const base = 'font-mono text-2xs text-iris'
  return to ? (
    <a href={`#${to}`} className={`${base} underline decoration-iris/30 underline-offset-2 transition-colors hover:decoration-iris`}>{children}</a>
  ) : (
    <span className={base}>{children}</span>
  )
}

type Row = { code: React.ReactNode; role: string }

export function Anatomy({ rows }: { rows: Row[] }) {
  return (
    <div className="divide-y divide-divider overflow-hidden rounded-card border border-divider bg-canvas">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto] items-start gap-5 px-3.5 py-2.5">
          <code className="font-mono text-2xs leading-relaxed text-ink-body [overflow-wrap:anywhere]">{r.code}</code>
          <span className="text-right text-2xs leading-relaxed text-ink-muted">{r.role}</span>
        </div>
      ))}
    </div>
  )
}

// PREVIEW | ANATOMY — the full treatment for a complex component.
// layout 'split' (default): preview boxed beside the anatomy (narrow components).
// layout 'stack': preview rendered as-is on top, anatomy below (full-width components
// like the header, where a half-width preview column would distort the layout).
export function PreviewAnatomy({
  id, title, note, scope, preview, rows, full = true, layout = 'split',
}: {
  id?: string
  title: string
  note?: React.ReactNode
  scope?: string
  preview: React.ReactNode
  rows: Row[]
  full?: boolean
  layout?: 'split' | 'stack'
}) {
  const previewBox = (
    <div>
      <p className="bai-section-label mb-2 text-ink-muted">Preview</p>
      {layout === 'stack'
        ? preview
        : <div className={`grid min-h-[120px] place-items-center rounded-card border border-divider bg-surface p-5${scope ? ` ${scope} sg-demo` : ''}`}>{preview}</div>}
    </div>
  )
  const anatomyBox = (
    <div>
      <p className="bai-section-label mb-2 text-ink-muted">Anatomy</p>
      <Anatomy rows={rows} />
    </div>
  )
  return (
    <section id={id} className={`scroll-mt-8 rounded-field border border-divider bg-surface p-5${full ? ' lg:col-span-2' : ''}`}>
      <p className="bai-section-label mb-1">{title}</p>
      {note && <p className="mb-4 text-2xs leading-relaxed text-ink-muted">{note}</p>}
      {layout === 'stack'
        ? <div className="space-y-5">{previewBox}{anatomyBox}</div>
        : <div className="grid gap-5 lg:grid-cols-2">{previewBox}{anatomyBox}</div>}
    </section>
  )
}
