# blueAI — Scratchpad
Inline correction-resolution log. One line per correction the moment it's
resolved. Promoted to decisions.md / taste.md at audit passes, then wiped.

Format: `YYYY-MM-DD HH:mm — <file> — <what changed> — Why: <one phrase>`

> **KEEP THIS FILE CHEAP.** The format above is the whole spec, and QUALITY-GATES puts its cost at
> 5–10 seconds. It had drifted into ~65-line narrative entries and reached 530 lines / 47KB across 17
> un-promoted rows spanning two sessions — at which point it had become a second `decisions.md`, the
> audit pass that drains it became expensive, and so the audit stopped running. That is the actual
> loop: an expensive capture file is a capture file whose promotion gets deferred, which is how the
> best design reasoning in the notebook ended up living only in the file scheduled for deletion.
> If a row wants to be an essay, that essay belongs in the `decisions.md` row at the audit — write the
> one line here and the prose there.

--- Pending audit entries ---

2026-08-04 (cont. 2) — boot.js + blueai-desktop.css + index.html — REGRESSION from the header/sidebar
shell-bg fix, caught by the designer: "what happened to logo and traffic, I don't see it" — the wide-mode
header's pixel-art logo had silently disappeared. Root cause was structural, not cosmetic: `.bai-header`
has NEVER had a CSS background — the boot canvas underneath (boot.js) IS what renders there, continuously
repainting the live twinkling logo + ambient sparkle packets + heartbeat pulses every frame, showing
through wherever the DOM above it is transparent. Giving `.bai-header` an opaque `background:
var(--bai-shell-bg)` in wide mode silently painted over all of that — nothing errored, the canvas simply
stopped being visible. My own verification only checked BACKGROUND COLOR VALUES (header==sidebar tone);
it never checked whether adding an opaque layer would occlude something else rendering behind it via a
completely different mechanism, so it passed clean while shipping the regression.
Fixed at the actual layer: reverted `.bai-header`'s CSS background entirely (back to none, matching
compact mode always did); added `HDR_BG`/`HDR_H` to boot.js so `frameBase()` paints the header-ROW
rectangle (0,0,W,76 — titlebar+header height) in `--bai-shell-bg` BEFORE drawing the logo/packets on top,
so the animation keeps showing through on the new tone instead of being covered. New `setWide(isWide)`
API reads the live `--bai-shell-bg` value via `getComputedStyle(host)` (never hardcodes a hex, so it
can't drift from the CSS), wired at both places `.wide` gets toggled (`detach()` + the ResizeObserver);
`setTheme()` also re-reads it so switching theme while wide stays correct. Verified: compact mode
screenshot-identical to before: this change; wide mode (both themes) shows the logo again on the correct
tone; drift PASS; zero errors; the whole regression suite from earlier today (login fix, Scheduled form's
14 states) re-confirmed intact. — Why: a DOM element with no CSS background is not always "just showing
the surface behind it" — it can be a deliberate window onto something ELSE entirely (an animated canvas,
here). Before painting over an element that "looks empty," check whether anything is relying on it staying
transparent, not just what color it currently isn't.

2026-08-03 15:10 — index.html (Account button, header + wide sidebar) — logged-out users had NO way to
sign in except by sending a chat message (openLoginGate() had exactly one caller); Account was hidden
entirely when logged out, on the one button whose other job IS signing in. Fixed: Account always visible;
logged-out click opens the sign-in gate directly (designer chose this over a menu or a logged-out Profile
screen); icon swaps kebab↔person to match what the button now does in each state (a menu-trigger icon
performing a direct action is broken affordance). Live-product screenshots used for content reference only,
per designer's own instruction — not copied as layout. Self-caught before shipping: my first pass added a
`data-bai-icon` attribute to the dynamically-built svgs for §9 anchoring, which is exactly what §10 exists
to fail on (an attribute implying boot-hydration on markup built after the boot script runs) — removed;
`aria-label` already anchors it for §9. — Why: an icon/label pair must describe the ACTION a control
performs, not the control's identity — the same button does two different things depending on session
state, so it needs two different affordances, not one icon doing double duty.

2026-08-03 (cont.) — no file, a design-discussion correction — designer asked whether blueai-desktop's
landscape-mode sidebar/header/chat surface tones were right; I cited "ChatGPT/Notion/Linear do exactly
this" from memory as precedent for the current #1a2140-sidebar/#0b0e19-header+chat split, unverified.
Designer posted two real reference screenshots (a Codex-style app + a Claude-Code-style session browser);
both show sidebar/header/content at NEAR-UNIFORM tone, separated by hairlines only, with contrast reserved
for the active/selected nav item — not the two-tier ~2.5x lightness jump blueai-desktop currently has. The
cited precedent was wrong, not just uncited. — Why: this is the same failure reasonings.md already names
("anything I can write from imagination is the part I must read from source") applied to an EXTERNAL
product claim, not just an internal spec — citing a competitor's pattern from memory is exactly as
unverifiable as inventing a copy string, and needs the same discipline: screenshot or don't claim it.

2026-08-03 (cont. 2) — blueai-desktop.css (wide-mode sidebar) — acted on the corrected read above: split
the sidebar's background off `--bai-panel` into its own `--bai-sidebar-bg` token, set barely darker than
`--bai-bg` (10,12,23 vs 11,14,25 — was 26,33,64, a ~2.5x jump) so it reads as part of the same canvas
family as header+chat, matching the reference apps. Did NOT touch `--bai-panel` itself — its other 4
consumers (`.bai-menu`, `.bai-menu-desc`, `.bai-tour-card` x2) are floating/elevated surfaces that want to
pop against the canvas (they carry `--bai-menu-shadow` for exactly that reason); giving the sidebar their
tone was matching visual family, not role. Light theme untouched — its existing gap (white vs #f6f8fc,
3-9pt) wasn't the one screenshotted and was already close to the precedent. The selected-nav-item contrast
(`.bai-side-item.active`'s accent-wash + left bar) already existed and needed no change — only the base
panel tone was the gap. — Why: elevation/pop should be reserved for surfaces that are actually floating
above the canvas, not spent on a docked panel that happens to share a token with them.

2026-08-04 — blueai-desktop.css (light theme sidebar) — designer: "light theme doesn't feel right like dark
theme." Right — cont. 2 above split the sidebar off `--bai-panel` for DARK only, reasoning "light's gap
wasn't the one screenshotted." That reasoning was too narrow: the reference showed a PHILOSOPHY (dock =
canvas tone, contrast lives on the selected item), not a value scoped to whichever theme happened to be in
the screenshot, and light's pure-white sidebar (#ffffff vs canvas #f6f8fc) was exactly the
distinctly-brighter-panel treatment the fix exists to retire. Fixed: light `--bai-sidebar-bg` → `#f2f4f9`,
same ~1-4pt delta magnitude from canvas as dark's (242,244,249 vs 246,248,252, vs dark's 10,12,23 vs
11,14,25). `--bai-panel` (`#ffffff`) untouched — still owns the floating family, which legitimately wants
to read brighter than the docked sidebar now does. — Why: a design philosophy adopted in one theme and left
out of the other isn't adopted, it's a one-off wearing the shape of a principle; "verified in one theme" is
not "verified".

2026-08-04 (cont.) — blueai-desktop.css (wide-mode header + sidebar) — designer: "sidebar should be a LIL
LIGHTER not darker, and header+sidebar should be the SAME color" — then asked me to guess why before
implementing. Guessed correctly: header and sidebar are both NAV CHROME (logo/wordmark/settings/help/
account; mode-switcher/recents) — the same functional role — while chat is the WORKSPACE, the thing that
actually changes per-conversation. My prior-turn fix had paired header+chat because they sit physically
stacked (ADJACENCY), not because they share a job — the exact "match the fix to the surface's role, not
its visual family" failure reasonings.md already names, caught in a decision this same notebook made one
day earlier. Designer's own follow-up: darker reads as MORE DEPTH (recessed), which is why the shell
(header+sidebar) wants to sit slightly ABOVE the content well, not level with it — the physical logic
that picks the direction, not just the pairing.
Renamed `--bai-sidebar-bg` → `--bai-shell-bg` (it now serves two consumers, not one) and reversed both
values: dark `#0d111e` (barely LIGHTER than canvas `#0b0e19`, was barely darker); light reuses the
EXISTING `--bai-card-2` (`#fbfcff`, already barely lighter than canvas `#f6f8fc`) rather than inventing a
near-duplicate literal. New rule `.bai-ui.wide .bai-header { background: var(--bai-shell-bg); }` — scoped
to wide mode ONLY, so the compact 290px header (which has no sidebar to pair with) stays canvas-toned
exactly as before; verified untouched. `--bai-panel` (floating menus/tour card) untouched in both themes —
still a different role from the docked shell even though both now read brighter than canvas. — Why: a
grouping decided by which surfaces happen to be adjacent will be wrong whenever adjacency and role
diverge; group by role, and let depth (lighter=advances, darker=recedes) carry the hierarchy between the
two groups.

--- Prior audit history ---

*(The Session-15 audit pass, 2026-08-03, promoted 17 entries — 8 rows into `decisions.md`, taste rule 46 +
rule 38's corrected fail-to-fire clause, 2 `reasonings.md` principles, 5 `knowledge-base.md` traps, the
`project-insights.md` layout-system section, and `evolution.md` brought current through S13–S15. Gate 6.5
was run on every rule promoted, not only on new work.*

*One item was deliberately moved OUT of that pass rather than promoted, because it was an open question and
a wipe would have lost it: the `.bai-list-body` 14px vs `.bai-subpane-body` 12px gutter split — raised with
the designer 2026-08-03, not decided. It now lives in `project-insights.md`'s layout-system section with the
designer's-call flag attached. Anything still undecided at an audit goes to a permanent file, not into the
next scratchpad.)*
