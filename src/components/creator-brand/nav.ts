// Shared per-audience nav data — extracted out of Header.tsx so Footer.tsx can reuse the exact same
// list rather than hand-authoring a second one that can silently drift from it. Every entry is a
// REAL in-page anchor: grep the section `id`s under creators/ and brands/ before adding one, since
// there are no other routes under /creator-brand to link to.
//
// TWO CONSUMERS, TWO APPETITES (designer, 2026-08-11: remove Platforms, FAQ and Open jobs "from both
// pages navigation IN HEADER"). The header is now down to one destination plus the cross-audience
// link and the CTA; the footer still lists every section, because that is its whole job — it exists
// to catch someone who scrolled to the bottom and wants to go somewhere, and those sections are all
// still on the page.
//
// Modelled as a FLAG on one list rather than as two lists. A second array would be a second place to
// remember, and the first time a section got added to one and not the other the two would disagree
// about what this page even contains — which is the exact duplication that pulled this file out of
// Header.tsx to begin with.
//
// The brands list is also shorter than the creators one: "Pricing" and "Create a campaign" were
// removed outright earlier the same day. The campaign form is a dialog rather than a section, so its
// nav item was an action masquerading as a destination and it duplicated the header CTA a few pixels
// to its right; pricing is reachable from the hero's own "See how pricing works", which also opens a
// dialog now. Both SECTIONS still exist and still scroll.
//
// A `modal?: ModalKind` field lived here to support the campaign entry, with matching branches in
// Header and Footer. All three are gone with it rather than left behind for a case that no longer
// exists — if a nav item ever needs to open a dialog again, that shape is in git history.
export type NavAudience = 'creators' | 'brands'

/** `inHeader` opts an item into the header's short nav. Everything here shows in the footer. */
export type NavItem = { label: string; href: string; inHeader?: boolean }

export const NAV: Record<NavAudience, NavItem[]> = {
  creators: [
    { label: 'How it works', href: '#how-it-works', inHeader: true },
    { label: 'Open jobs', href: '#jobs' },
    { label: 'Platforms', href: '#platforms' },
    { label: 'FAQ', href: '#faq' },
  ],
  brands: [
    { label: 'How it works', href: '#how-it-works', inHeader: true },
    { label: 'Platforms', href: '#platforms' },
    { label: 'FAQ', href: '#faq' },
  ],
}

/** Derived, never hand-listed — see the note above about two lists drifting. */
export const HEADER_NAV: Record<NavAudience, NavItem[]> = {
  creators: NAV.creators.filter((i) => i.inHeader),
  brands: NAV.brands.filter((i) => i.inHeader),
}

export const OTHER: Record<NavAudience, NavAudience> = { creators: 'brands', brands: 'creators' }
