// The three glyphs the campaign form's custom controls need. Local rather than added to the
// site-wide icon set: Arrow.tsx is a CTA arrow with its own hover-slide CSS, and rotating it
// 90deg to fake a chevron would drag that animation into a static field affix.
//
// Same 24-box, currentColor, round-cap conventions as Arrow.tsx / Sparkle.tsx so they sit in the
// same family, and every one is aria-hidden — each is decorative next to a real text label.

export function ChevronDown({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  )
}

export function CalendarGlyph({ size = 15, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="3" y="5.5" width="18" height="15.5" rx="2.5" />
      <path d="M8 3v4.5M16 3v4.5M3 11h18" />
    </svg>
  )
}

export function Check({ size = 13, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M4.5 12.5l5 5L19.5 6.5" />
    </svg>
  )
}
