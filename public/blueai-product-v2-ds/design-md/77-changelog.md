## 77 Changelog

**Status:** Meta (no parts).

**Why:** Dated, newest first, so anyone building from the system can see what changed since they last looked. Add an entry for every change to tokens, a kit part’s API or a screen, here and in guide/sections/meta-changelog.jsx.

### 2026-10-14: Target look aligned with the onBlue Agentic site after the V3 restyle

- Target look aligned with the onBlue Agentic site after the V3 restyle: the committing action is the site's solid ink button (new --v2-solid, --v2-solid-hover, --v2-shadow-btn, --v2-shadow-btn-hover; decision D1 settled), the ghost presses to new --v2-surface-press, chips rest on new --v2-wash-tint, and blue is held to focus, selection, progress, links and the spark.
- New tokens: --v2-text-18 (dialog and sheet titles, .v2-text-title-dialog), --v2-tracking-figure (big figures), --v2-radius-dialog 20 (every dialog and the sheet's top edge), --v2-shadow-2-up (sheets), --v2-scrim-light (a sheet's veil), --v2-ring-select (highlight on arrival), and look hooks --v2-waiting-fill and --v2-brand-word-fill; each also in tokens-v2-today.css with V2's value.
- Re-valued: the user bubble is the grey surface with a hairline (--v2-bubble-user-fill, -line); --v2-attention-line is the attention ink at 32% like the other tone lines; a needs-input notice and the AskCard sit on the surface with the tone on the edge, and a failed notice takes the danger edge.
- Kit: Button primary is the solid ink, secondary the ghost, danger a ghost red on hover (no red solid; destructive confirms commit with the solid primary, ConfirmDialog drops its tone prop); one Switch (40x24, sunken off, blue on, lined knob); Select placeholder in placeholder ink; Badge busy is blue; a ListRow with a value draws the site's ledger; EmptyState is a 56 sunken mark, 20/600 title, one muted line; dialogs and sheets take radius 20 and 18/600 titles; the credits glyph is V2's own asset as an image (no mask) and the BrandMark word is ink.
- Decided: rows keep radius 10; one field (40 tall, 13/500 label); icon stroke 1.75 for every product set; zero credits is a wait (neutral plus the chip's dot); no serif em in working-tab empty states; pill and caret geometry stay in their parts. The spark ships as assets/spark.svg. Sections 03, 04, 06, 08, 11 to 16, 18, 22, 23, 25, 26, 30, 33, 35, 37, 38, 47 to 49, 52, 70, 73 and 76 updated.

### 2026-10-14: Minimal progress card and plain consent frame in V2

- Consent dialog, wording and spacing: body 'BlueAI will take paid {app} jobs on its own and like, comment, follow and post from your account.', note 'Switch back anytime in Settings.' set 12px apart, title 10px above the body, buttons 20px below, and the plain frame's corners 20 to match the run-complete popup and the mode sheet.
- V2's home progress card is minimal (day + Earnings, 20 thin day segments, one verified line) and the consent dialog uses a plain frame (no header, divider or X); refs and sections updated.

### 2026-10-14: Mode sheet, one-line ribbon and Settings > Worker in V2

- V2's per-app mode is now one switch per app (on = Automatic; on asks for consent, off applies at once) in a bottom sheet opened by the composer chip or the ribbon's Change; the ribbon is one line (Automatic on YouTube, or a count); Settings has a Worker card with the same apps list; the Preview panel's Version row is Change mode from, plus a Mode row. Refs and sections 14, 21, 26, 27, 38, 42, 46, 53, 57, 61, 62 and 72 updated.

### 2026-10-14: Minimal consent in V2

- V2's consent dialog is now minimal (title, one paragraph, Cancel / I agree, turn on); refs and sections updated.

### 2026-10-14: Minimal day-done in V2

- V2's run-complete popup is now minimal (one tick, title, one status line, Got it); refs and section 44 updated.

### 2026-10-14: Two looks

- tokens-v2-today.css adds the "V2 today" look (every token re-valued to what V2 ships now, under [data-v2-look="today"]; tokens.css stays Target), eight look-hook tokens let the kit restore V2's gradient user bubble, indigo nav pill and soft in-flow shadows, the guide header switches the look, and ds-check fails if the two files define different token names.

### 2026-10-13: First version

- The system and its live guide, built next to V2 without changing V2: 78 sections (start, foundations, components, shell, chat, worker, credits and settings, patterns, screens, copy and voice, scene and review, meta).
- tokens.css: every --v2-* token, each with its role, its onBlue Agentic family link and the V2 values it absorbs.
- The kit on window.V2Kit and 14 screens on window.V2Screens, one catalog row per component, each marked In V2, Changed from V2 or New (section 75 lists them; the guide counts them live).
- Every V2 value and string the guide prints carries a ref to its V2 line; tools/ds-check.js proves them and enforces tokens only, no em dash, 300 lines a file and a catalog in sync.
- DESIGN.md generated from one partial per section (tools/build-design-md.js).
- 51 recommendations for V2 (20 P1, 21 P2, 10 P3) and 19 decisions pending for the PM.
- Compose fixes: --v2-success-tint is 8% (not the site’s 10%) so green text on it passes 4.5:1; new --v2-link-underline (the site’s 32%) under ink links; live V2 parts render inside a v2-preflight wrapper and with V2’s own keyframes (guide/v2-live.css); the catalog lists the shared screen helpers; Help is a menu and a sheet, not a pushed screen.
