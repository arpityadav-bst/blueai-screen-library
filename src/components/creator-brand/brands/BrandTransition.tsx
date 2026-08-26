'use client'

// The between-pages loader (Abhisht, 2026-08-26): a small centred pulse shown while the brand side
// is signing in or signing out. Both of those end in a full page navigation, and the gap between
// the click and the new document was previously nothing at all — the dialog just sat there, then
// the page changed. On a slow connection that reads as a dead button.
//
// A FULL-VIEWPORT COVER, not an inline spinner in the dialog. What it is covering is the moment the
// current screen stops being true: the header still says signed in, the dialog still shows a form
// that has already been submitted. Painting over the whole thing is more honest than animating one
// corner of a screen whose other corners are lying.
//
// IT NEVER RESOLVES ON ITS OWN, by design. There is no timeout and no success state — the only way
// out is the navigation that follows, so it cannot get stuck showing "done" over a page that failed
// to move. Callers mount it immediately before window.location.assign.
//
// prefers-reduced-motion: the dots stop pulsing and the label carries the whole message. Something
// still has to say the page is working, so the text stays either way.
export default function BrandTransition({ label }: { label: string }) {
  return (
    <div className="cb-transition" role="status" aria-live="polite">
      <span className="cb-transition-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <p className="cb-transition-label">{label}</p>
    </div>
  )
}
