// One tab per real homepage section — the SINGLE list, read by both the header and the footer.
//
// It lived privately in HomeHeader.tsx until 2026-08-20, when the footer grew a section column and
// would otherwise have needed a second copy of it. This is the lesson creator-brand's own nav.ts
// records: a hand-written second list does not update when the first one does, and the drift shows
// up as a footer quietly pointing somewhere the header no longer goes.
//
// EVERY href MUST BE A REAL ANCHOR that exists on the page. Both consumers additionally guard
// against the states where a section is not rendered at all — the header shows these tabs only
// when signed out, and the footer filters the list against the live DOM (see HomeFooter.tsx),
// because the application, dashboard and full-capacity views each render a different subset.
export const NAV = [
  { label: 'The machines', href: '#machines' },
  { label: 'While you sleep', href: '#sleep' },
  { label: 'How it works', href: '#how' },
]
