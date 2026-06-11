// PM app-component reference (2/2) — Navigation · Credits (button/alerts/modal) · Icons.
const I = (d: string) => <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>
const ICONS: [string, string][] = [
  ['Chat', 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.42-4.03 8-9 8a9.9 9.9 0 01-4-.8L3 21l1.9-3.8A8 8 0 013 12c0-4.42 4.03-8 9-8s9 3.58 9 8z'],
  ['Search', 'M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z'],
  ['Settings', 'M10.32 4.5a1.7 1.7 0 013.36 0l.1.6a1.7 1.7 0 002.5 1.04l.53-.3a1.7 1.7 0 012.37 2.37l-.3.53a1.7 1.7 0 001.04 2.5l.6.1a1.7 1.7 0 010 3.36l-.6.1a1.7 1.7 0 00-1.04 2.5l.3.53a1.7 1.7 0 01-2.37 2.37l-.53-.3a1.7 1.7 0 00-2.5 1.04l-.1.6a1.7 1.7 0 01-3.36 0l-.1-.6a1.7 1.7 0 00-2.5-1.04l-.53.3a1.7 1.7 0 01-2.37-2.37l.3-.53a1.7 1.7 0 00-1.04-2.5l-.6-.1a1.7 1.7 0 010-3.36l.6-.1a1.7 1.7 0 001.04-2.5l-.3-.53A1.7 1.7 0 016.69 5.84l.53.3a1.7 1.7 0 002.5-1.04zM12 15a3 3 0 100-6 3 3 0 000 6z'],
  ['Calendar', 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'],
  ['Briefcase', 'M21 13.3A23.9 23.9 0 0112 15c-3.18 0-6.22-.62-9-1.75M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m-2 14h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'],
  ['Wallet', 'M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 12a2 2 0 000 4h4v-4h-4z'],
  ['Lightbulb', 'M9.66 17h4.67M12 3v1m6.36 1.64l-.7.7M21 12h-1M4 12H3m3.34-5.66l-.7-.7m2.82 9.9a5 5 0 117.07 0l-.54.55A3.37 3.37 0 0014 18.47V19a2 2 0 11-4 0v-.53c0-.9-.36-1.75-.99-2.39l-.54-.54z'],
  ['CheckCircle', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'],
  ['Edit', 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.42-9.42a2 2 0 112.83 2.83L11.83 15H9v-2.83l8.59-8.59z'],
  ['Trash', 'M19 7l-.87 12.14A2 2 0 0116.14 21H7.86a2 2 0 01-1.99-1.86L5 7m5 4v6m4-6v6M4 7h16M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3'],
  ['Download', 'M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3'],
  ['Refresh', 'M4 4v5h5M20 20v-5h-5M5 9a7 7 0 0111-3.5L20 9M4 15a7 7 0 0011 3.5L20 15'],
]

export function PmComponentsB() {
  return (
    <div className="space-y-10">
      {/* NAVIGATION */}
      <div id="app-nav" className="scroll-mt-8">
        <p className="bai-section-label mb-3">Navigation — app bar + overflow menu</p>
        <div className="overflow-hidden rounded-field border border-divider bg-canvas">
          <div className="flex items-center justify-between border-b-2 border-divider px-5 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-card bg-bai-gradient text-white"><svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></span>
              <span className="text-gradient text-[20px] font-bold leading-none">BlueAI</span>
              <span className="rounded-card border border-status-scheduled px-2 py-0.5 text-2xs font-semibold text-status-scheduled">Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-pill bg-bai-gradient p-px"><span className="block rounded-pill bg-canvas px-3 py-1 text-2xs font-bold"><span className="text-gradient">✦ 2,450</span></span></span>
              <span className="flex size-8 items-center justify-center rounded-circle bg-indigo-soft text-indigo"><svg className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></span>
              <span className="flex size-9 items-center justify-center text-ink-body"><svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg></span>
            </div>
          </div>
          <div className="flex p-3">
            <div className="ml-auto w-[180px] overflow-hidden rounded-field border border-divider shadow-overlay">
              {[['Chat History', true], ['Profile', false], ['Report Issue', false], ['Logout', false]].map(([label, active]) => (
                <div key={label as string} className={`px-4 py-2.5 text-sm ${active ? 'bg-indigo-soft font-medium text-indigo' : 'text-ink-body'}`}>{label}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CREDITS */}
      <div id="app-credits" className="scroll-mt-8">
        <p className="bai-section-label mb-3">Credits — button · alerts · confirm modal</p>
        <div className="flex flex-wrap items-start gap-5 rounded-field border border-divider bg-surface p-5">
          <div className="space-y-2">
            <span className="inline-block rounded-credits bg-bai-gradient p-px"><span className="block rounded-credits bg-canvas px-3.5 py-1.5 text-sm font-bold"><span className="text-gradient">✦ 2,450</span></span></span>
            <div className="relative inline-block"><span className="inline-block rounded-credits bg-bai-gradient p-px"><span className="block rounded-credits bg-canvas px-3.5 py-1.5 text-sm font-bold"><span className="text-gradient">✦ 45</span></span></span><span className="absolute -right-0.5 -top-0.5 size-2 rounded-circle border border-canvas bg-status-danger" /></div>
          </div>
          <div className="max-w-[300px] space-y-2">
            <div className="flex items-start gap-2.5 rounded-card border border-status-jobs bg-status-jobs-soft p-3"><span className="text-status-jobs">{I('M12 9v2m0 4h.01M5 19h14a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.27 16A2 2 0 005 19z')}</span><div><p className="text-2xs font-semibold text-status-jobs-ink">Low balance alert</p><p className="mt-0.5 text-2xs text-status-jobs-ink">Top up now to keep using BlueAI.</p></div></div>
            <div className="flex items-start gap-2.5 rounded-card border border-status-warning bg-status-warning-soft p-3"><span className="text-status-warning-ink">{I('M12 9v2m0 4h.01M5 19h14a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.27 16A2 2 0 005 19z')}</span><div><p className="text-2xs font-semibold text-status-warning-ink">Usage alert</p><p className="mt-0.5 text-2xs text-status-warning-ink">You've used 90% of today's credit limit.</p></div></div>
          </div>
          <div className="w-[280px] overflow-hidden rounded-field bg-canvas shadow-overlay">
            <div className="flex items-center justify-between border-b border-divider px-4 py-3"><span className="text-h4 font-semibold text-ink-display">Sign out</span><span className="text-ink-muted">{I('M6 18L18 6M6 6l12 12')}</span></div>
            <div className="p-4"><p className="mb-3.5 text-sm text-ink-body">Are you sure you want to sign out?</p><div className="flex justify-end gap-2"><button className="rounded-card border border-stroke px-4 py-1.5 text-2xs font-medium text-ink-body">Cancel</button><button className="rounded-card bg-accent px-4 py-1.5 text-2xs font-medium text-white">Sign out</button></div></div>
          </div>
        </div>
      </div>

      {/* ICONS */}
      <div id="app-icons" className="scroll-mt-8">
        <p className="bai-section-label mb-3">Icons — Heroicons outline (1.8px stroke, 24 viewBox)</p>
        <div className="grid grid-cols-4 gap-3 rounded-field border border-divider bg-surface p-5 sm:grid-cols-6 lg:grid-cols-12">
          {ICONS.map(([name, d]) => (
            <div key={name} className="flex flex-col items-center gap-1.5">
              <span className="text-ink-heading">{I(d)}</span>
              <span className="text-[9px] text-ink-muted">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
