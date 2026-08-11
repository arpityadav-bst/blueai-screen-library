// Shared per-audience nav data — extracted out of Header.tsx so Footer.tsx can reuse the exact same
// list rather than hand-authoring a second one that can silently drift from it. Every entry is a
// REAL in-page anchor: grep the section `id`s under creators/ and brands/ before adding one, since
// there are no other routes under /creator-brand to link to.
//
// The brands list is DELIBERATELY SHORTER than the creators list (designer, 2026-08-11): "Pricing"
// and "Create a campaign" were removed. Both had become odd nav entries — the campaign form is a
// dialog rather than a section, so its nav item was an action masquerading as a destination, and it
// duplicated the header CTA sitting a few pixels to its right; pricing is reachable from the hero's
// own "See how pricing works", which now also opens a dialog. The `#pricing` SECTION still exists
// and still scrolls, it just isn't advertised in the nav.
//
// A `modal?: ModalKind` field lived here to support the campaign entry, with matching branches in
// Header and Footer. All three are gone with it rather than left behind for a case that no longer
// exists — if a nav item ever needs to open a dialog again, that shape is in git history.
export type NavAudience = 'creators' | 'brands'
export type NavItem = { label: string; href: string }

export const NAV: Record<NavAudience, NavItem[]> = {
  creators: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Open jobs', href: '#jobs' },
    { label: 'Platforms', href: '#platforms' },
    { label: 'FAQ', href: '#faq' },
  ],
  brands: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Platforms', href: '#platforms' },
    { label: 'FAQ', href: '#faq' },
  ],
}

export const OTHER: Record<NavAudience, NavAudience> = { creators: 'brands', brands: 'creators' }
