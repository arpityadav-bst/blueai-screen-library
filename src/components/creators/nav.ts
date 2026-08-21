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
  // "The machines" went with the fleet section it pointed at (Appy, 2026-08-20). A nav item whose
  // anchor no longer exists is the one kind of dead link this list is built to make impossible.
  // "Always on", NOT the section's own heading (Appy, 2026-08-21: "While you chill is not
  // suitable"). The label had been mirroring the heading — "While you sleep", then "While you
  // chill" when the heading changed — and that was the mistake, not the wording. A nav item NAMES A
  // DESTINATION, so it has to be a noun phrase that can stand on its own; "While you chill" is a
  // subordinate clause, half a sentence waiting for the rest of it, which is why it reads as
  // unfinished next to "How it works".
  // "Passive earning" (Appy's pick) names the OUTCOME rather than the mechanism, which is the
  // half a reader scanning a nav is actually looking for, and it stands alone next to "How it
  // works" in the same register.
  { label: 'Passive earning', href: '#sleep' },
  { label: 'How it works', href: '#how' },
]
