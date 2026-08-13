// Option glyphs for the application's card-style choices.
//
// Same conventions as controls/icons.tsx so they sit in one family: a 24 box, `currentColor`, round
// caps and joins, `aria-hidden` throughout. They are decorative — every one sits beside a real text
// label, and a card that needs its icon explained is a card with the wrong icon.
//
// WHY ICONS AT ALL, since the labels already say it: they give the option cards a fixed left mass, so
// selected and unselected states differ by COLOUR rather than by whether a glyph is present. The old
// chips reserved an empty slot for a checkmark that only appeared once chosen, which read as a
// mis-indent on every unselected option. An icon that is always there costs nothing and removes the
// hole. See ChoiceGroup.tsx.

type P = { size?: number; className?: string }
const box = (size: number, className: string) => ({
  viewBox: '0 0 24 24',
  width: size,
  height: size,
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  className,
})

/** Student */
export function CapIcon({ size = 20, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <path d="M12 4 22 9l-10 5L2 9l10-5Z" />
      <path d="M6 11.2V16c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4.8" />
    </svg>
  )
}

/** Employed */
export function BriefcaseIcon({ size = 20, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <rect x="2.5" y="7.5" width="19" height="12.5" rx="2.2" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M2.5 12.5h19" />
    </svg>
  )
}

/** Full-time creator */
export function CreatorIcon({ size = 20, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <rect x="2.5" y="5" width="14" height="14" rx="2.5" />
      <path d="m16.5 10.5 5-2.8v8.6l-5-2.8" />
      <path d="m8 9.6 3.4 2.4L8 14.4V9.6Z" />
    </svg>
  )
}

/** Freelancer */
export function LaptopIcon({ size = 20, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <rect x="4" y="5" width="16" height="10.5" rx="1.8" />
      <path d="M2 19h20" />
    </svg>
  )
}

/** Other */
export function DotsIcon({ size = 20, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <circle cx="5.5" cy="12" r="1.3" />
      <circle cx="12" cy="12" r="1.3" />
      <circle cx="18.5" cy="12" r="1.3" />
    </svg>
  )
}

/** Yes */
export function YesIcon({ size = 20, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.3 2.7 2.7L16 9.7" />
    </svg>
  )
}

/** No */
export function NoIcon({ size = 20, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6" />
    </svg>
  )
}

/** Windows. Four panes with the classic slight perspective, kept as strokes so it matches the set. */
export function WindowsIcon({ size = 20, className = '' }: P) {
  return (
    <svg {...box(size, className)}>
      <path d="M3.5 6.4 11 5.3v6.1H3.5V6.4ZM12.5 5.1 20.5 4v7.4h-8V5.1ZM3.5 12.6H11v6.1l-7.5-1.1v-5ZM12.5 12.6h8V20l-8-1.1v-6.3Z" />
    </svg>
  )
}

/** macOS. Filled, because an apple silhouette drawn as an outline stops reading as an apple. */
export function AppleIcon({ size = 20, className = '' }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.9-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.7.7 1.1 0 1.9-1.1 2.6-2.1.5-.8.8-1.5 1-2-2.2-.8-2.9-2.9-2.9-4zM14.6 5.9c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2z" />
    </svg>
  )
}

/** The corner mark on a chosen card. Solid, so it reads at 11px against the iris wash. */
export function TickIcon({ size = 11, className = '' }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M4.5 12.5l5 5L19.5 6.5" />
    </svg>
  )
}
