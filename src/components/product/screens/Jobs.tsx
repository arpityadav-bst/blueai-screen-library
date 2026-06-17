// BlueAI — Jobs Screen
// Faithful port of JobsScreen's "Coming Soon" empty state onto the product DS.
// The JobCard / JobDetailsModal / loading-shimmer scaffolding in the source is
// UNRENDERED (JobsScreen returns only this empty state) and is omitted here.

export function Jobs() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center px-8 text-center">
      {/* Icon circle — brand-wash on the DS info tone */}
      <div className="mb-7 flex h-[120px] w-[120px] items-center justify-center rounded-circle bg-status-info-soft">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="7" width="20" height="14" rx="2.5" fill="#7C5C52" />
          <path d="M16 7V5.5A2.5 2.5 0 0 0 13.5 3h-3A2.5 2.5 0 0 0 8 5.5V7" fill="#7C5C52" />
          <rect x="2" y="7" width="20" height="14" rx="2.5" fill="none" stroke="#6B4A40" strokeWidth="0.5" />
          <rect x="9" y="10.5" width="6" height="2" rx="0.5" fill="#C89A85" opacity="0.7" />
        </svg>
      </div>
      <h2 className="mb-3 text-xl font-extrabold tracking-tight-1 text-ink-heading">Coming Soon</h2>
      <p className="max-w-[260px] text-base leading-relaxed text-ink-muted">
        We are working on this section to bring you new opportunities. Check back soon for updates!
      </p>
    </div>
  )
}
