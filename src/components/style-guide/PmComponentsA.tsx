// PM app-component reference (1/2) — Cards · Overview cards · Inputs & Forms.
// Documents the shipping web-app DS (blueai-pm) in the style guide, on blueAI tokens.
const Brief = ({ c = 'currentColor' }: { c?: string }) => <svg className="size-[18px]" fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.9 23.9 0 0112 15c-3.18 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
const Check = () => <svg className="size-[18px]" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const Bulb = () => <svg className="size-[18px]" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.66 17h4.67M12 3v1m6.36 1.64l-.7.7M21 12h-1M4 12H3m3.34-5.66l-.7-.7m2.82 9.9a5 5 0 117.07 0l-.54.55A3.37 3.37 0 0014 18.47V19a2 2 0 11-4 0v-.53c0-.9-.36-1.75-.99-2.39l-.54-.54z" /></svg>
const Cal = () => <svg className="size-[18px]" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>

const OVERVIEW = [
  { v: '5/8', t: 'Skills Active', bg: 'bg-indigo', icon: <Bulb /> },
  { v: '142', t: 'Tasks Done', bg: 'bg-status-success', icon: <Check /> },
  { v: '3', t: 'Jobs Available', bg: 'bg-status-jobs', icon: <Brief c="#fff" /> },
  { v: '2', t: 'Tasks Scheduled', bg: 'bg-status-scheduled', icon: <Cal /> },
]

export function PmComponentsA() {
  return (
    <div className="space-y-10">
      {/* CARDS */}
      <div id="app-cards" className="scroll-mt-8">
        <p className="bai-section-label mb-3">Cards — skill · job · empty state</p>
        <div className="flex flex-wrap gap-4">
          <div className="w-[200px] rounded-field border border-divider bg-canvas p-4 shadow-float transition-all hover:border-indigo hover:shadow-md">
            <span className="mb-2.5 inline-flex items-center gap-1 rounded-pill bg-indigo-soft px-2 py-0.5 text-2xs font-medium text-indigo">✓ Active</span>
            <p className="text-h3 font-bold text-ink-display">coin-collector</p>
            <p className="mt-1 text-xs leading-snug text-ink-muted">Collects in-game coins automatically every cycle.</p>
            <div className="mt-3.5 rounded-card border border-indigo-soft bg-indigo-soft py-2 text-center text-2xs font-semibold text-indigo">View Details</div>
          </div>
          <div className="w-[210px] rounded-field border border-divider bg-canvas p-4 shadow-float">
            <span className="mb-2 inline-block rounded-badge bg-status-warning-soft px-1.5 py-0.5 text-2xs font-medium text-status-warning-ink">assigned</span>
            <p className="text-h3 font-bold text-ink-display">Like Instagram Post</p>
            <p className="mb-2 mt-1 flex items-baseline gap-1"><span className="text-xl font-bold text-indigo">150</span><span className="text-xs text-ink-muted">BCX</span></p>
            <p className="text-xs text-ink-muted">Open Instagram and like the specified post.</p>
            <div className="mt-3.5 rounded-card border border-indigo-soft bg-indigo-soft py-2 text-center text-2xs font-semibold text-indigo">More Info</div>
          </div>
          <div className="w-[210px] rounded-field border border-divider bg-canvas p-6 text-center shadow-float">
            <span className="mx-auto mb-2.5 flex size-10 items-center justify-center rounded-circle bg-status-jobs-soft text-status-jobs"><Brief /></span>
            <p className="text-h5 font-semibold text-ink-display">No Jobs Available</p>
            <p className="mt-1 text-xs text-ink-muted">Check back later for new opportunities</p>
          </div>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div id="app-overview" className="scroll-mt-8">
        <p className="bai-section-label mb-3">Overview cards — dashboard stats</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {OVERVIEW.map((o) => (
            <div key={o.t} className="rounded-field border border-divider bg-canvas p-3.5 shadow-float">
              <span className={`mb-2.5 flex size-9 items-center justify-center rounded-card ${o.bg} shadow-float`}>{o.icon}</span>
              <p className="text-xl font-bold text-ink-display">{o.v}</p>
              <p className="text-2xs font-medium text-ink-muted">{o.t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* INPUTS & FORMS */}
      <div id="app-inputs" className="scroll-mt-8">
        <p className="bai-section-label mb-3">Inputs &amp; forms — field states · search · chat input · toggle · checkbox</p>
        <div className="grid grid-cols-1 gap-5 rounded-field border border-divider bg-surface p-5 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="block"><span className="mb-1 block text-2xs font-semibold text-ink-heading">Skill name<span className="text-status-danger">*</span></span><input readOnly defaultValue="coin-collector" className="w-full rounded-card border border-stroke bg-canvas px-3 py-2 text-sm text-ink-body outline-none" /></label>
            <label className="block"><span className="mb-1 block text-2xs font-semibold text-ink-heading">Description<span className="text-status-danger">*</span></span><input readOnly placeholder="What the skill does…" className="w-full rounded-card border border-status-info bg-canvas px-3 py-2 text-sm text-ink-body shadow-[0_0_0_3px_rgba(96,165,250,.15)] outline-none" /></label>
            <label className="block"><span className="mb-1 block text-2xs font-semibold text-ink-heading">Job prompt<span className="text-status-danger">*</span></span><input readOnly placeholder="Step 1…" className="w-full rounded-card border border-status-danger bg-canvas px-3 py-2 text-sm text-ink-body outline-none" /><span className="mt-1 block text-2xs text-status-danger">Job prompt is required.</span></label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m21.5 21.5-5-5" /></svg>
              <input readOnly placeholder="Search skill" className="w-full rounded-pill border border-stroke bg-canvas py-2.5 pl-10 pr-4 text-sm text-ink-body outline-none" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <span className="mb-1 block text-2xs font-semibold text-ink-heading">Chat input</span>
              <div className="flex items-center gap-2 rounded-chat border border-status-info bg-canvas py-2 pl-3 pr-2">
                <span className="flex-1 text-sm text-ink-muted">Type your message…</span>
                <span className="flex size-8 items-center justify-center rounded-circle bg-accent"><svg className="size-4" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg></span>
              </div>
            </div>
            <div>
              <span className="mb-1.5 block text-2xs font-semibold text-ink-heading">Toggle — on / off</span>
              <div className="flex items-center gap-3">
                <span className="relative inline-block h-[22px] w-10 rounded-pill bg-indigo"><span className="absolute bottom-[3px] right-[3px] size-4 rounded-circle bg-canvas" /></span>
                <span className="relative inline-block h-[22px] w-10 rounded-pill bg-stroke"><span className="absolute bottom-[3px] left-[3px] size-4 rounded-circle bg-canvas" /></span>
              </div>
            </div>
            <label className="flex items-start gap-2"><input type="checkbox" defaultChecked className="mt-0.5 size-3.5 accent-indigo" /><span className="text-xs text-ink-body">I confirm all prerequisites are met.</span></label>
          </div>
        </div>
      </div>
    </div>
  )
}
