// Shared per-audience nav data — extracted out of Header.tsx so Footer.tsx can reuse the exact same
// list rather than hand-authoring a second one that can silently drift from it. Every entry is a
// REAL in-page anchor: grep the section `id`s under creators/ and brands/ before adding one, since
// there are no other routes under /creator-brand to link to.
//
// TWO CONSUMERS, TWO APPETITES — and as of 2026-08-25, only on the creators page.
//
// The 2026-08-11 direction was "remove Platforms, FAQ and Open jobs from BOTH pages navigation IN
// HEADER", which left one destination plus the cross-audience link and the CTA. On 2026-08-25 Appy
// reversed it for BRANDS only: "we have How it works on the header but in the footer we have three
// options... they should have the similar items on the header also". Recorded as a reversal rather
// than quietly re-flagged, because the next person to read this file should see that BOTH shapes
// were deliberate and which one is current.
//
// WHAT CHANGED UNDERNEATH IT, and why the reversal is not just a change of mind: on 2026-08-11 the
// brands header carried "For Creators" and the CTA alongside How it works, so it was not sparse.
// That cross-link was removed on 2026-08-25 (the two audiences no longer interlink — see
// Header.tsx), which left the brands header with exactly one nav item beside its CTA while its own
// footer listed three. The header was not over-full any more; it was under-full.
//
// The CREATORS list is untouched and still carries the 2026-08-11 shape — that page is finalised.
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

/** `inHeader` opts an item into the header's short DESKTOP nav. Everything here shows in the footer.
 *
 *  A note for the next person tempted to delete this: it was deleted on 2026-08-13, on a misreading of
 *  "the header just needs logo art and CTA, not navigation items" — which was an answer about the
 *  MOBILE header. The nav is `hidden lg:flex`, so mobile never showed it in the first place and there
 *  was nothing there to remove. Desktop lost its nav for nothing. Restored. */
export type NavItem = { label: string; href: string; inHeader?: boolean }

// "Open jobs" (#jobs) was removed 2026-08-13 with the section it pointed at — the PM cut the "Real
// brands. Real budgets." jobs board for the pilot (screenshot item 5). A footer link to a deleted
// anchor scrolls nowhere and looks like a broken page, which is why this list's own header note says
// to grep the section ids before adding an entry: the same rule applies when one goes away.
export const NAV: Record<NavAudience, NavItem[]> = {
  creators: [
    { label: 'How it works', href: '#how-it-works', inHeader: true },
    { label: 'Platforms', href: '#platforms' },
    { label: 'FAQ', href: '#faq' },
  ],
  brands: [
    // all three inHeader since 2026-08-25 — header and footer now offer the same three
    // destinations on this page, which is the whole point of the reversal noted above
    { label: 'How it works', href: '#how-it-works', inHeader: true },
    { label: 'Platforms', href: '#platforms', inHeader: true },
    { label: 'FAQ', href: '#faq', inHeader: true },
  ],
}

/** Derived, never hand-listed — see the note above about two lists drifting. */
export const HEADER_NAV: Record<NavAudience, NavItem[]> = {
  creators: NAV.creators.filter((i) => i.inHeader),
  brands: NAV.brands.filter((i) => i.inHeader),
}

export const OTHER: Record<NavAudience, NavAudience> = { creators: 'brands', brands: 'creators' }
