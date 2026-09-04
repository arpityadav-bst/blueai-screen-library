// THE THEME, extracted so more than one route can read it (2026-09-02).
//
// It started inside CrxState, which was right while /creators was the only surface that had it.
// The legal page is a separate route with its own minimal chrome and no CrxProvider - deliberately,
// since a legal page has no journeys, variants or account states to provide - so it could not see
// the theme at all and rendered dark whatever the switch said. Rather than wrap it in a provider it
// does not otherwise need, the three things a reader needs are here: the key, how to read it, and
// how to apply it.
//
// TEMPORARY, like everything else in this pass: when light is signed off, the dark path goes and so
// does this module.

export type Theme = 'dark' | 'light'

export const THEME_KEY = 'crx-theme'

/**
 * Dark unless told otherwise. ?theme= WINS over the stored value: a link naming a theme is a more
 * specific instruction than whatever this tab happened to be set to earlier, and the review links
 * get pasted around.
 * Both reads are guarded — private-mode Safari throws on sessionStorage, and the default is the
 * honest fallback.
 */
export function readTheme(): Theme {
  try {
    const q = new URLSearchParams(window.location.search).get('theme')?.toLowerCase()
    if (q === 'light' || q === 'dark') return q
  } catch {
    /* fall through to storage */
  }
  try {
    const t = sessionStorage.getItem(THEME_KEY)
    if (t === 'light' || t === 'dark') return t
  } catch {
    /* fall through to the default */
  }
  return 'dark'
}

/**
 * THE CLASS GOES ON <body>, never on the page root: dialogs portal out of it and carry
 * className="crx" of their own, so a class on the root would turn the page and leave the sign-in
 * dialog and the cash-out modal dark. body.crx-lock is this page's existing precedent for a
 * body-level flag.
 */
export function applyTheme(t: Theme) {
  document.body.classList.toggle('crx-light', t === 'light')
}

/** Callers use this in an effect cleanup so a route change cannot leave the class on another page. */
export function clearTheme() {
  document.body.classList.remove('crx-light')
}
