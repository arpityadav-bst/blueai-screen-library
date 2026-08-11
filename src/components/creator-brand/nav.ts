import type { ModalKind } from './ModalHost'

// Shared per-audience nav data — extracted out of Header.tsx so Footer.tsx can reuse the exact
// same list rather than hand-authoring a second one that can silently drift from it.
//
// Two kinds of item now:
//   href  — a REAL in-page anchor (grep the section `id`s under creators/ and brands/ before
//           adding one; there are no other routes under /creator-brand to link to)
//   modal — opens a dialog instead of scrolling
//
// The second kind exists because "Create a campaign" USED to be an anchor to a page section, and
// that section is a dialog now (designer, 2026-08-11). Modelling it as data rather than
// special-casing the string in both consumers is what keeps Header and Footer honest: a Footer
// that builds `/creator-brand/brands#create-a-campaign` for a section that no longer exists is a
// dead link, and nothing about the old shape would have told it so.
export type NavAudience = 'creators' | 'brands'
export type NavItem = { label: string; href?: string; modal?: ModalKind }

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
    { label: 'Pricing', href: '#pricing' },
    { label: 'Create a campaign', modal: 'campaign' },
    { label: 'FAQ', href: '#faq' },
  ],
}

export const OTHER: Record<NavAudience, NavAudience> = { creators: 'brands', brands: 'creators' }
