// Option glyphs for the application's card-style choices — SVGs ported verbatim from
// creator-brand/controls/choiceIcons.tsx (colour was already currentColor, so the dark skin costs
// nothing here). A 24 box, round caps and joins, aria-hidden throughout: they are decorative — every
// one sits beside a real text label, and a card that needs its icon explained is the wrong icon.
//
// WHY ICONS AT ALL, since the labels already say it: they give the option cards a fixed left mass,
// so selected and unselected states differ by COLOUR rather than by whether a glyph is present. See
// controls.tsx (ChoiceGroup).
//
// TickIcon lives in controls.tsx (both controls need it); WindowsIcon/AppleIcon were NOT ported —
// they belonged to the PC-specs step that was cut from the form entirely (spec.ts, PM 2026-08-13).

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
