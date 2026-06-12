// Right-arrow for primary CTAs — matches the canonical Download CTA's arrow. Slides on hover
// via the .site-arrow CSS (site.css). Inherits color via currentColor.
export function Arrow({ size = 18 }: { size?: number }) {
  return (
    <svg className="site-arrow" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
