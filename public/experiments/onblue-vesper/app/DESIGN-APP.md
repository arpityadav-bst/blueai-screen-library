# onBlue for business: the signed-in app, design doc

This is the design doc for the app behind sign-in (`app/`). It describes what is built: every class name and value below is quoted from the CSS and JS in this folder. The plan it was built from is `research/onblue-revamp/REVAMP-PLAN.md`; where the two differ, this file says what the code does.

Live specimens of every component: `app/style-guide.html` (it links the real app CSS, so it can never drift from the pages).

> **Current scope (Appy, 2026-11-03), ahead of the sections below:**
> - **The create form asks the platform again (PM, 2026-11-05, ROB-21562).** Step 1 asks it right below Product name, as in section 6's wizard rule: growth takes one or both, engagement takes the one its video is on and its link field follows. The review shows the platform, and a filed campaign keeps it. **Instagram is coming soon (PM, 2026-11-06):** it is left out of the row, so the row is "Platform" with YouTube alone (always picked) and the hint "More platforms coming soon." on both types; a draft or copy that had Instagram falls back to YouTube. Opening it = delete `soon` on `PLATS.instagram` in new-model.js, and the row is the two-chip one again ("Pick one or both." / "The platform your video is on."). The list and the report still show none (no marks, no Platform filter), and the sample rows stay `platforms: ['youtube']`.
> - **A campaign opens what main opens for it**: `app/campaign.html` is the app's frame (sidebar, content area) with the PM's own screen in an iframe, untouched. In review: his dashboard's in-review screen (`campaign.html` #view-campaign) with this campaign's name and setup. A sample: his report for that sample. Other engagement: his engagement sample in the same state. Other growth: his detailed `campaign-report/index.html`. An iframe because his stylesheet and the app's share bare class names (`.btn`, `.card`, `.page`, `.chip`). `report-frame.js` hides his top bar and points his "All campaigns" link at the app. The app's own report (section 3.10, 4.5) was removed and comes back on a later branch; it is in git history at `9a4fb76`.
> - **Settings and How pricing works are off the sidebar.** `settings.html` and `pricing.js` stay in the folder, unlinked.
> - **No campaigns until the agency is approved** (as on main). In review: no New campaign in the sidebar or header, the start card says "Your agency is in review" and opens nothing, the form sends you back, drafts are hidden. The old "waiting" status is gone.
> - The dock's **Account** bar: **New account** (starts over: the start card and Get started, then only what is filed from there), **Campaigns running** (none finished, samples show), **Has finished campaigns** (samples step aside).

---

## 1. How the app is put together

**Stack.** Buildless HTML, CSS and vanilla JS. No framework, no build, no backend. Data is sample data (`data.js`); what the agency makes is kept in `localStorage`; the session is the homepage gate's, in `sessionStorage`.

**Scope.** Every app page sets `<html class="app" data-theme="light">` (flow pages add `app-flow`). All app tokens are declared on `.app`, so nothing in `app/css/` can reach the homepage or the creators site.

**Stylesheet order** (copy it exactly on a new page):

1. Google Fonts: Inter (variable, opsz 14..32) and Instrument Serif italic
2. `../onblue.css` (brand tokens and the light theme)
3. `css/tokens.css` (the app's own scales)
4. `css/shell.css` (sidebar and panel frame)
5. `css/components.css` (shared components)
6. page CSS: `flow.css` + `new.css` / `agency.css` for flows, `campaigns.css`, `report*.css`, `new-dialog.css`

**Script order:** `data.js`, then `shell.js`, then the page's scripts. `shell.js` fills `<aside class="app-side" id="side">` on load and exposes `window.onblueApp`; `data.js` exposes `window.onblueData`.

**Theme.** Light only for now: every page pins `data-theme="light"`, and `tokens.css` defines no dark set. Plan section 5.6 lists the dark values for when dark mode is built.

**Rules that hold everywhere**

- `.app [hidden] { display: none !important; }` (shell.css). A component with its own `display` still hides with `hidden`.
- Focus: `.app :focus-visible { outline: none; box-shadow: var(--focus-ring); }`.
- Selection has one treatment: border `--blue-line`, fill `--blue-wash` (`.app-choice[aria-pressed="true"]`, `.chip-choice[aria-pressed="true"]`, `.pill.is-set`, `.rp-split-row.is-on`, `.rp-range.is-set`).
- Only things that float get a shadow (menus, popovers, toast, drawer, dialog). Cards and tiles inside the panel carry a hairline only.
- Hover is "instant on, soft off": the transition runs 160ms on leave and `transition-duration: 0ms` on enter.

---

## 2. Tokens

### 2.1 Surfaces and lines (tokens.css)

| Token | Value | Use |
|---|---|---|
| `--app-ground` | #f7f8fa | the page behind the sidebar and panel; quiet boxes (`.note-box`, `.set-foot`, read-only inputs, drawer stats) |
| `--app-panel` | #ffffff | the panel, cards, tiles, inputs, menus |
| `--app-panel-line` | rgba(0,0,0,.08) | border of the panel, cards, tiles, tables, buttons, menus |
| `--app-row-line` | rgba(0,0,0,.06) | dividers: table rows, header bottom, flow head and foot, menu separators |
| `--app-nav-hover` | rgba(0,0,0,.035) | hover fill on nav items, rows, menu items, quiet buttons |
| `--app-nav-active` | rgba(0,0,0,.055) | the current nav item |
| `--neutral-fill` | rgba(0,0,0,.05) | neutral status pill, count pill, avatars, segmented track, disabled primary |
| `--app-scrim` | rgba(11,11,13,.24) | behind the phone nav, the drawer and dialogs; no blur |

### 2.2 The four ink levels

| Token | Value | Use |
|---|---|---|
| `--app-ink-1` | #0b0b0d | titles, values, row names, active nav, field values |
| `--app-ink-2` | #3c4049 | body text, table cells, inactive nav labels (the default text colour of `html.app`) |
| `--app-ink-3` | #5f636b | meta, helpers, ledes, table heads, tile labels, inactive icons; the floor on any tinted fill |
| `--app-ink-4` | #6b707a | timestamps, group labels, chart axes, chevrons; 12px and up, only on white or the ground, never on a tinted fill |

Placeholder text uses `--ph-ink` (#9ca2ad) and only inside a field that also has a visible label or an `aria-label`.

### 2.3 Tones (tokens.css)

| Token | Value | Use |
|---|---|---|
| `--blue-wash` | rgba(21,110,254,.08) | selected fill, info banner, tag, icon tile, chart area |
| `--blue-line` | rgba(21,110,254,.36) | selected border, focused input border, thumb hover ring |
| `--focus-ring` | 0 0 0 3px rgba(21,110,254,.16) | every focus state |
| `--app-success-ink` | #166534 | text on green fills (Live pill, success banner icon, Completed figure) |
| `--warn-ink` | #92400e | In review pill, Over budget value, the Under target dot |
| `--warn-line` | rgba(180,83,9,.32) | the "Needs you" card border |
| `--warn-fill` | rgba(217,119,6,.1) | In review pill, `.note-box--warn`, drawer flag |
| `--err-fill` | rgba(208,69,74,.08) | Rejected pill, error banner |
| `--err-line-soft` | rgba(208,69,74,.32) | error banner border |
| `--on-accent` | #ffffff | text on solid blue or ink (step digits, avatars, danger button) |

### 2.4 Brand tokens the app borrows (onblue.css, light theme)

| Token | Light value | Use in the app |
|---|---|---|
| `--blue` | #156efe | progress fills, chart line, current lifecycle segment, switch on, brand "on" |
| `--blue-ink` | = `--blue` | serif `<em>` on big moments |
| `--notice-ink` | #0d5ad6 | links (`.app-link`), current step dot, tag text, info icons, ticks |
| `--ink` | #0b0b0d | solid button, toast, done step dot, agency avatar, selected tab underline |
| `--solid-ink` | #ffffff | text on the solid button and toast |
| `--solid-shadow` | onblue.css light recipe | the solid button's contact shadow |
| `--green` | #16a34a | Live dot, done bar, done lifecycle segment, toast check |
| `--green-fill` / `--green-line` | rgba(22,163,74,.1) / .32 | Live pill, success banner |
| `--err-ink` | #c03a40 | Rejected pill text, errors, danger button, rejected segment |
| `--err-line` | #d0454a | invalid input border, danger hover |
| `--border` / `--border-soft` | rgba(0,0,0,.15) / .1 | input border / choice card and chip border |
| `--card-line-hover` | rgba(0,0,0,.2) | hover border on buttons, cards, inputs |
| `--hair` / `--hair-2` | rgba(0,0,0,.08) / .13 | chart dashes / empty lifecycle segment, switch off |
| `--bar-bg` | #f6f6f8 | progress bar track |
| `--spark-ink` | = `--blue` | the spark mark in the brand row and flow head |
| `--card-radius` | 16px | panel, drawer, dialog |
| `--ui-font` / `--serif-font` | Inter / Instrument Serif | everything / the italic `<em>` only |

### 2.5 Type scale

Eight sizes only: 11, 12, 13, 14, 15, 17, 24, 32. Weights 400 / 500 / 600, and 600 only at 17px. No 700 anywhere. Every font is a `--t-*` shorthand; tracking comes from `--tr-*` and tightens as size grows.

| Token | Value | Tracking | Use |
|---|---|---|---|
| `--t-display` | 500 32px/36px | `--tr-display` -0.03em | flow titles (`.flow-title`) |
| `--t-metric` | 500 32px/36px | `--tr-display` | the lead tile's big number (`.rp-lead .rp-big b`) |
| `--t-title` | 500 24px/30px | `--tr-title` -0.025em | page titles, object names, empty-state titles, tile and figure values, live card number |
| `--t-heading` | 600 17px/24px | `--tr-heading` -0.015em | section heads, dialog and drawer titles, popover titles, type-card names |
| `--t-body-lg` | 400 15px/24px | `--tr-body` -0.01em | flow ledes, empty-state body, input values, choice-card titles (500) |
| `--t-body` | 400 14px/20px | `--tr-body` | default app text, nav, cells, labels and buttons (500) |
| `--t-small` | 400 13px/20px | none | meta, helpers, errors, tile labels (500), 28px buttons, filter pills |
| `--t-label` | 500 12px/16px | 0 | table heads, status and count pills, group labels, axes, tags |
| `.eyebrow-app` | 500 11px/16px | +0.14em, uppercase | the flow eyebrow, the only uppercase in the app |

Two literal fonts sit on the scale outside the tokens: the brand row and flow head, `500 15px/20px var(--ui-font)`.

**Serif italic `<em>`** (`var(--serif-font)`, `font-style: italic`, weight 400, `font-size: 1.06em`, `letter-spacing: 0`, colour `--blue-ink`) is for big moments only: flow titles (`.flow-title em`), empty and waiting states (`.app-display em`, `.app-empty h2 em`, `.rp-wait-h em`, `.rp-veil-msg em`). One `<em>` per heading.

Numbers that line up use `font-variant-numeric: tabular-nums`.

### 2.6 Spacing

`--sp-1` 4px, `--sp-2` 8px, `--sp-3` 12px, `--sp-4` 16px, `--sp-5` 20px, `--sp-6` 24px, `--sp-8` 32px, `--sp-10` 40px, `--sp-12` 48px, `--sp-16` 64px.

Card padding: `--pad-card` 20px 24px (cards, dialogs' cousins), `--pad-card-sm` 16px 20px 20px (tiles, live cards).

Allowed off-scale: 2px (between nav items, segmented track, tight stacks) and 6px (status dot to label, tab count, small inline gaps).

Fixed rhythms: label to control 8px; between fields 24px (`.flow-fields`); flow title to first field 32px; page header to content 24px; between sections 40px (`.app-sect`); between cards in a grid 16px; section head to content 12px.

### 2.7 Radii

| Token | Value | Use |
|---|---|---|
| `--r-xs` | 6px | buttons, inputs, search, tags, square avatars, row thumbnails |
| `--r-sm` | 8px | nav items, menu items, step rows, segmented track, tooltips, thumbnails |
| `--r-md` | 12px | cards, tiles, tables, menus, popovers, banners, toast, choice cards |
| `--card-radius` | 16px | the panel, drawer, dialog |
| `--r-pill` | 999px | status, count and filter pills, chips, progress bars, round avatars |

Nesting reads outer to inner: panel 16 > card 12 > control 6.

### 2.8 Elevation

| Token | Value | Use |
|---|---|---|
| `--elev-1` | 0 1px 2px rgba(18,32,64,.035) | the panel on the ground; the pressed segment; thumb mark |
| `--elev-2` | 0 18px 44px -20px rgba(18,32,64,.3), 0 2px 6px rgba(18,32,64,.06) | menus, popovers, chart tooltip, toast |
| `--elev-3` | 0 30px 70px -30px rgba(18,32,64,.35) | drawer, dialog, the open phone nav |

### 2.9 Sizes and motion

| Token | Value | Token | Value |
|---|---|---|---|
| `--app-sidebar-w` | 240px | `--ctl-sm` | 28px |
| `--app-rail-w` | 64px | `--ctl` | 36px |
| `--app-gutter` | 8px | `--ctl-lg` | 44px |
| `--app-header-h` | 64px | `--nav-row` | 32px |
| `--app-content-max` | 1120px | `--dur-hover` | 160ms |
| | | `--ease-hover` | cubic-bezier(0.25,0.46,0.45,0.94) |

Controls come in three heights: 28 (`--ctl-sm`, small buttons, pager), 36 (`--ctl`, page actions, search), 44 (`--ctl-lg`, flow buttons, inputs, chips).

---

## 3. Components

Each entry: class, file, anatomy, states.

### 3.1 Buttons (components.css)

- `.app-btn`: 36px, padding 0 12px, gap 8px, 1px `--app-panel-line` border, radius 6px, white, `--t-body` at 500, icon `--app-ink-3`. Hover: border `--card-line-hover`.
- `--solid`: the one primary per view. Fill `--ink`, text `--solid-ink`, `--solid-shadow`; hover #2a2b30.
- `--sm` 28px with `--t-small` 500; `--lg` 44px with 16px padding (flow footers); `--icon` square 36px; `--quiet` no border, no fill, hover `--app-nav-hover`.
- `--danger` (new-dialog.css): fill `--err-ink`, text `--on-accent`, hover `--err-line`. Only in the delete confirm.
- `.app-link`: a text button, `--notice-ink` 500, underline on hover (offset 3px).
- Not ready yet: `.app-btn--solid[aria-disabled="true"]` turns neutral (`--neutral-fill`, `--app-ink-3`, `cursor: not-allowed`) but stays in the tab order. Never use `disabled` on a primary.
- Busy: `aria-busy="true"` plus `.app-spin` (16px ring, 2px border, 0.7s spin; 2.4s under reduced motion, slowed and never stopped).

### 3.2 Banner (components.css, report.css)

`.app-banner`: one slot at the top of the page body, max one at a time. Flex, gap 12px, padding 12px 16px, radius 12px, 16px icon, text `--app-ink-1`, `<b>` at 500, margin-bottom 24px.

| Tone | Class | Fill / border / icon |
|---|---|---|
| info (default) | `.app-banner` | `--blue-wash` / `--blue-line` / `--notice-ink` |
| success | `.app-banner--success` | `--green-fill` / `--green-line` / `--app-success-ink` |
| error | `.app-banner.rp-banner--error` (report.css) | `--err-fill` / `--err-line-soft` / `--err-ink` |

Dismiss: `.app-btn.app-btn--sm.app-btn--icon.app-btn--quiet.app-banner-x`, pulled into the corner. There is no warn banner class yet.

### 3.3 Status pill (components.css)

`.app-status`: 24px, padding 0 8px, pill, `--t-label`, a 6px dot before the label (gap 6px). Never bordered, never hoverable.

| Class | Label (`onblueData.STATUS`) | Look |
|---|---|---|
| `--live` | Live | `--green-fill`, `--app-success-ink`, `--green` dot |
| `--review` | In review | `--warn-fill`, `--warn-ink`, `--warn-ink` dot |
| `--rejected` | Rejected | `--err-fill`, `--err-ink`, `--err-ink` dot |
| `--under` | Under target | neutral pill, `--warn-ink` dot |
| `--done` | Completed | neutral (no own rule) |
| `--waiting` | Waiting | neutral; carries `title` "Goes into review once {agency} is approved." |
| `--draft` | Draft | neutral |

In the post table (`.rp-post-by .app-status`) the pill drops to 20px with no dot. Proof-of-work rows reuse `--live` / `--review` / `--rejected` for Completed / Under review / Rejected.

### 3.4 Small pills and marks

- `.app-count` (shell.css): 20px tall, min 20px wide, padding 0 4px, `--neutral-fill`, `--app-ink-3`, `--t-label`, tabular. Sidebar count caps at "99+" (`setCount`).
- `.app-tag` (components.css): padding 0 6px, radius 6px, `--blue-wash`, `--notice-ink`, `--t-label` at line-height 20px. "Recommended" on choice cards.
- `.app-plats` / `.app-plat` (components.css): the platform marks, 16px each, 4px apart; 20px inside chips. Always rendered with `onblueData.marks(list)`, which gives the group `role="img"` and an `aria-label` ("YouTube and Instagram") and gives every Instagram gradient its own id.
- `.app-bar` (components.css): 4px track `--bar-bg`, fill `--blue`; `--done` fills `--green`; `--time` (report-tiles.css) fills `--app-ink-4`.

### 3.5 Section head, empty state, choice card (components.css)

- `.app-sect` (40px above, none on the first) with `.app-sect-head` (baseline row, 12px below): `.app-sect-title` `--t-heading` + optional `.app-count` or `.app-sect-note` (`--t-small`, `--app-ink-3`).
- `.app-empty`: centred, max 560px, 48px top. `h2.app-display` at `--t-title` with one serif `<em>`; `p` at `--t-body-lg` `--app-ink-3`; then `.app-choices` (2 columns, 12px gap, 1 column under 600px).
- `.app-choice`: a card-sized button or link. Min 72px, padding 16px, 1px `--border-soft`, radius 12px, title `--t-body-lg` 500, sub `span` `--t-small` `--app-ink-3`, optional `.app-tag` top right. Hover border `--card-line-hover`; selected `aria-pressed="true"` gets the one selection treatment.

### 3.6 Toast (components.css, shell.js)

`.app-toast`: fixed bottom right 24px, min 280px, 44px, padding 0 16px, radius 12px, fill `--ink`, text `--solid-ink` `--t-body` 500, 16px check in `--green`, `--elev-2`. `onblueApp.toast(msg)` shows it for 4s with `role="status"`. Copy is noun plus past tense: "Agency submitted", "Draft saved", "Copied #a667ef59". The error variant in the plan is not built.

### 3.7 Menus and dialog

- `.app-menu` (shell.css): the account menu, opens above its button. Padding 4px, radius 12px, `--elev-2`. `.app-menu-note` (13px, ink-3), `.app-menu-sep` (1px `--app-row-line`), `.app-menu-item` (32px, radius 8px, `--t-body`, icon ink-3, hover `--app-nav-hover`). The same item class is reused in `.needs-menu`, where it turns `--err-ink` for "Delete draft".
- `.pmenu` (campaigns.css): the filter pill's listbox, 260px, optional `.pmenu-search`, rows 32px with `.pmenu-ck` tick, `.pmenu-t` label and `.pmenu-n` count; `.is-active` row is the keyboard cursor.
- `.app-dialog` (new-dialog.css): a native `<dialog>`, width min(400px, 100vw - 32px), radius 16px, `--elev-3`, `::backdrop` `--app-scrim`. Padding sits on the inner `<form>` so a click on the dialog itself is the backdrop. `.app-dialog-title` (17/600), `.app-dialog-body` (14, ink-3), `.app-dialog-foot` (right-aligned, 8px gap, 24px above).

### 3.8 Flow parts (flow.css)

- Frame: `.flow-head` (56px; spark 20px + flow name 15px/500; a quiet icon close button on the right), `.flow-main` (scrolls), `.flow-wrap` (grid `240px minmax(0,640px)`, 48px gap, centred; `--solo` 640px column; `--narrow` 440px column; one column under 1024px), `.flow-foot` (72px, `.note` 13px ink-3 that takes the free space, the solid primary pushed right).
- Step head: `.eyebrow-app`, then `.flow-title` (12px below) with one `<em>`, then `.flow-lede` (8px below, `--t-body-lg` ink-3), then `.flow-fields` (32px below, 24px between fields).
- Step rail `.steps > li > .step`: 36px rows, radius 8px, `.step-dot` 20px circle with a 1px `--border`. States: `.is-current` (fill `--blue-wash`, ink-1 500, dot `--notice-ink` with white digit, `aria-current="step"`); `.is-done` (ink-2, dot `--ink` with a 12px tick, hover fill); `[aria-disabled="true"]` (ink-4, neutral dot with a lock, `title` "Finish steps 1 to 3 first."). Sticky at the top of its column.
- `.dashes`: the rail under 1024px. 24 x 4px segments; `.on` `--blue`, `.done` `--ink`, else `--hair-2`.
- Field: `.field` (8px gap) > `.label` (14/500 ink-1; `.opt` "(optional)" and `.counter` at 400 ink-3) > control > `.help` (13 ink-3, 2px pulled up). Errors replace the hint in the same slot: `.help.is-err` (`--err-ink`) and `.input.is-bad` (`--err-line` border) with `aria-invalid="true"`. `.field-row` puts two fields side by side (one column under 600px).
- `.input`, `.textarea`, `.select`: 44px, padding 0 12px, 1px `--border`, radius 6px, value `--t-body-lg`. Hover `--card-line-hover`; focus `--blue-line` + `--focus-ring`. `.textarea` min 104px. `.money` wraps an input with a "$" prefix and tabular figures. `.input[readonly]` (agency.css) sits on `--app-ground` in ink-2 with no hover or focus change.
- `.chips > .chip-choice`: 44px pill buttons, padding 0 16px, 1px `--border-soft`, `--t-body` 500, a 20px platform mark when it is a platform. Pressed: the selection treatment plus `.nw-chip-tick` (new.css), so a multi-pick group never looks like a single swap.
- `.choice-grid`: 2-column grid for `.app-choice` cards.
- `.note-box`: 12px 16px, radius 12px, `--app-ground`, ink-2, 16px icon ink-3. Estimates and "what happens next". `--warn` puts it on `--warn-fill` with a `--warn-ink` icon.

Wizard additions (new.css): `.nw-type` (type card with `.nw-type-name` 17/600, `.nw-type-body`, `.nw-type-facts`, and `.nw-tick` that scales in when pressed), `.nw-budgets` / `.nw-budget` (4 preset cards, 2 under 600px), `.nw-drop` (dashed upload row), `.nw-card` + `.nw-dl` (review summary cards with an Edit button), `.nw-missing` (err-ink 500), `.nw-phone` (the "Create campaigns on a computer." state under 640px).

Agency additions (agency.css): `.agency-input` puts `.agency-av` (24px square, initial on `--ink`; `.is-empty` neutral; `.has-icon` white with the site icon) inside the name input; `.set-card` > `.set-body` (24px padding, 24px gap) + `.set-foot` (on `--app-ground`, `.set-note` that turns `.is-err`).

### 3.9 Campaigns parts (campaigns.css)

- `.live-card` (button): `--pad-card-sm`, radius 12px, 12px gap. `.live-top` (marks left, Live pill right), `.live-name` (14/500 ink-1, ellipsis), `.live-meta` ("Product · Video growth · US", 13 ink-3), `.live-num` (`<b>` at `--t-title` + "views of 41.7K"), `.app-bar`, `.live-foot` (spent of budget, time left). Hover border `--card-line-hover`. Grid: `repeat(auto-fill, minmax(300px, 1fr))`, 16px gap.
- `.tabs > .tab`: 36px, 2px bottom border; selected `aria-selected="true"` turns the border `--ink` and the label ink-1; `.n` count in ink-4. A tab only shows when it has rows.
- `.toolbar`: `.search` (240 x 36, icon + borderless input, focus ring on the wrapper), the filter pills, and `.count` pushed right.
- `.pill`: 32px, padding 0 12px, 1px `--app-panel-line`, `--t-small` 500 ink-2, chevron ink-3. With a value `.is-set`: selection treatment and "Platform: YouTube" (`.v` in ink-1). A pill hides itself when it would offer "All" plus one value.
- `.tbl > .row`: a grid table in a 12px-radius bordered box with `container-type: inline-size`. Columns: Campaign `minmax(200px,1fr)`, Platform 72, Type 128, Market 64, Ends 104, Progress 112 (right), Status 112, chevron 16. Rows min 56px, padding 8px 16px, 12px gap. `.row--head` 36px `--t-label` ink-3 with `.th` sort buttons (arrow only on the sorted column). `.row.is-link` is the whole-row link (hover `--app-nav-hover`, Enter or Space opens). Cells: `.c-title` (14/500 ink-1) over `.c-sub` (product · `.c-hash` copy button); `.c-num` ("97K views" over "of 83.3K"); `.c-state` (pill + `.c-info` reason icon on rejected rows); `.c-chev`. Rejected rows are not links and show "Did not run". Columns step down by the table's own width: under 860px Type and Market go; under 620px Platform, Ends and chevron go. Never a sideways scroll.
- `.needs`: the "Needs you" card for drafts. 1px `--warn-line` border, `.needs-head`, `.needs-row` (52px: name, "Draft · step 2 of 4", Continue, More menu), `.needs-all`.

### 3.10 Report parts (report.css, report-tiles.css, report-detail.css, report-overlay.css)

- Header: `.rp-crumb` ("Campaigns" link ink-3 > chevron ink-4 > name ink-1, all 14/500) and actions: `.rp-seg` platform switch, `.rp-range` date range (`.is-set` when not "Campaign to date"), Share, `.rp-csv` (icon only under 1100px).
- `.rp-seg`: segmented switch. Track 2px padding on `--neutral-fill`, radius 8px; buttons 32px `--t-small` 500 ink-3; pressed `aria-pressed="true"` is a white segment with a hairline and `--elev-1`. Used for All / YouTube / Instagram and for the chart's metric.
- Object block `.rp-obj`: `h1.app-title` + status pill; `.rp-meta` (13 ink-3: "Video growth · YouTube and Instagram · US · dates · #id" with `.rp-hash` copy); `.rp-obj-side` ("Updated 3 min ago" ink-4 + 28px refresh).
- Lifecycle `.rp-life`: four 4px segments (Submitted, In review, Live, Completed) with 12px labels; `.is-done` `--green`, `.is-now` `--blue`, `.is-bad` `--err-ink`, future `--hair-2`; `.rp-life-note` on the right.
- Bento `.rp-bento`: 6 columns, 16px gap. `.rp-tile`: `--pad-card-sm`, 1px `--app-panel-line`, radius 12px, no shadow. Spans: `.rp-lead` 4 x 3 (4 x 2 on an ended growth campaign, which has no Time left tile), `.rp-proof` / `.rp-checks` 4, `.rp-proof--wide` and the engagement `.rp-board` 6, `.rp-stat` / `.rp-money` / `.rp-split` / `.rp-creators` / `.rp-resp` / `.rp-time` / `.rp-video` 2 (growth Creators and Response 3). Two columns under 1024px (lead, proof, completion checks and board keep the full row), one under 640px.
- Tile text: `.rp-label` (13/500 ink-3, an `h2`), `.rp-big` (`<b>` at `--t-title`, then a 13px "of 83.3K target"), `.rp-hint`, `.rp-sub`, `.rp-foot` (pinned to the tile bottom), `.rp-none` (empty).
- Lead (Fill): `.rp-label` "Fill", `.rp-big` with the percentage at `--t-metric` and PM's sub ("82,534 of 83,333 target"), `.app-bar.rp-fillbar`, then `.rp-spark`, the small running total from start to today on an axis that runs to the end date. No pace line, no verdict, no serif.
- Small tiles `.rp-stat`: label, figure, PM's sub (Views "Views on published posts", Total posts "live on members' own accounts", Likes and Comments "on those posts", Completions "completions so far").
- Chart strokes: `.rp-grid line` (`--app-row-line`), `.rp-grid--dash` (`--hair`, 2 on 4 off), `.rp-line` (2px `--blue`), `.rp-area` (`--blue-wash`), `.rp-dot`, `.rp-ref` (the budget line on the Spend chart, 1.5px ink-4 dashed 4 4) with `.rp-ref-label`, `.rp-spark-now` (today), `.rp-axis text` (12px ink-4). The detail chart adds `.rp-hov-line`, `.rp-hov-dot` and the `.rp-tip` tooltip (radius 8px, `--elev-2`).
- Money: `.rp-big` spend ("of $100.00"), `.app-bar.rp-moneybar`, `.rp-dl` rows (`.rp-dl-row`: dt label with a 13px working line in ink-4, dd 500 tabular; `.is-warn` puts Over budget in `--warn-ink`).
- Proof: `.rp-strip` of `.rp-pcard` (thumb, "12K views", creator). `.rp-thumb` keeps the post's true shape: `--tall` 9:16 (Shorts, Reels), `--wide` 16:9 (a YouTube video); sizes `--row` 40px, `--strip` 168px, `--lg` 280px. The stand-in colour is a gradient from the post's `--h` hue; `.rp-thumb-mark` puts the platform mark top left; `.rp-thumb-flag` says "Removed".
- Split `.rp-split-row` (a button per platform: name, share %, bar, "views, spent, posts"; `.is-on` when it is the active filter), creators `.rp-crow` (avatar `.rp-av`, name, mark, share), response `.rp-resp-row` (Likes, Comments per 1,000 views, one column per platform; Saves only under Instagram), time `.rp-time` (`.app-bar--time`).
- Engagement: `.rp-checks` (Completion checks: Completed / Under review / Rejected) and `.rp-board` use `.rp-figs` > `.rp-fig` (value at `--t-title`; `.is-ok` success ink, `.is-bad` error ink), the "Your video" `.rp-video` tile.
- Detail (`#detail`, 40px below the bento): `.rp-card` (`--pad-card`) with `.rp-card-head`; posts table `.rp-posts > .rp-post` (grid row 56px; `.has-saves` adds a column; `.c-content` thumb + `.rp-post-t`; `.rp-xl` platform link that shows its arrow on hover; `.rp-grp` creator groups); `.rp-pager` / `.rp-pg` (28px page buttons, `aria-current="page"` white with hairline); proof table `.rp-ptable > .rp-prow` with `.rp-act` action tags; `.rp-privacy`.
- Floating: `.rp-drawer` (right, inset 8px, min(520px, 100vw - 16px), radius 16px, `--elev-3`, slides 0.24s; `.rp-dr-top` 64px, `.rp-dr-body` 24px, `.rp-dr-stats` on `--app-ground`), `.rp-scrim`, `.rp-menu` (row menu), `.rp-pop` (360px share popover; `--range` 280px with `.rp-rng` presets), `.rp-switch-row` + `.rp-switch` (36 x 20, on = `--blue`), `.rp-input` (36px).
- States: `.rp-wait` (waiting / in review: `.rp-icon-tile` 48px on `--blue-wash` + "Your report starts when it goes *live.*" + the setup card), `.rp-veil` (no posts yet: the real layout at 40% under a white fade, one message on top), `.rp-linkview` + `.rp-bare` (the shared link: no sidebar, a 56px bare header with a "View only" pill).

---

## 4. Page patterns

### 4.1 App shell (shell.css, shell.js)

`body` is a grid: `var(--app-sidebar-w) minmax(0, 1fr)` on `--app-ground`. The page never scrolls; `.app-panel` does (inset 8px top, right and bottom, radius 16px, hairline, `--elev-1`).

Sidebar `.app-side`, top to bottom: `.app-brand` (48px, spark + "onBlue", "on" in `--blue`), `.app-agency` (40px: 24px initial avatar, name, In review pill while pending), `.app-new` (32px ghost "New campaign", 12px above, 16px below), nav items (Campaigns with its live count, Sample reports), `.app-group-label` "Agency" (ink-4, 24px above), Settings, `.app-side-spacer`, "How pricing works" (external arrow), and the account row `.app-acct` (email, menu: "Signed in as", "Back to the onBlue site", "Sign out").

`.app-nav-item`: 32px, radius 8px, 8px icon gap, 14/500. Default ink-2 label, ink-3 icon; hover `--app-nav-hover` with ink-1; current `aria-current="page"` `--app-nav-active` with ink-1 label and icon. No weight change, no left bar, no blue.

Responsive: 1200px and up, the full 240px sidebar. 768 to 1199px, a 64px rail (labels, counts, group labels and the agency pill hide; items become 40px squares). Under 768px the sidebar is a 280px overlay over `--app-scrim`, opened by `.app-menu-btn` (`data-nav-open`); the panel loses its inset, border and radius; the header drops to 56px and the subline hides.

### 4.2 Page header

`.app-head`: sticky, 64px, padding 0 32px (24px in rail, 16px on phones), bottom hairline always on, 16px gap.

- List pages: `h1.app-title` (24px) + `.app-sub` subline on the same row ("**3** live · **1** in review", numbers in ink-1 500) + `.app-head-actions` on the right, primary rightmost.
- Object pages (the report): `.rp-crumb` breadcrumb instead of a title; the 24px name opens the body in `.rp-obj`.

`.app-body`: max 1120px, centred, padding 24px 32px 64px. The banner slot `#banner` comes first.

### 4.3 Flow frame

Flows (register agency, new campaign) leave the shell: `html.app.app-flow`, white page, no sidebar. Head 56px with the flow name and a Close button (closing the wizard saves a draft and returns to Campaigns with "Draft saved"). Body column 640px (440px for registration), a 240px step rail beside it at 1024px and up. Sticky 72px footer: Back (hidden on the first step), the note slot, one solid primary at 44px.

Behaviour: auto-advance only on single-choice screens (the type chooser). No keycap hints, no number-key shortcuts. An incomplete step keeps its primary focusable with `aria-disabled="true"`; pressing it shows the first missing field. Submitting shows "Submitting" with `.app-spin` and `aria-busy="true"`.

### 4.4 Campaigns page order, and why

1. Banner (agency in review, or just approved).
2. "Needs you": drafts lead, because they are the only thing waiting on the agency.
3. "Live now" cards: the campaigns spending money right now, because "is my money working?" is what an agency opens the app to ask.
4. "All campaigns": tabs, search, filter pills (Platform, Product, Type, Market, Ends), the table.
5. "Sample reports" (PM's rule: shown until the agency has a completed campaign of its own, or when asked for by name).

Empty: "Start your first *campaign.*" with two choice cards.

### 4.5 Report bento hierarchy, and why

The report answers questions in the order an agency asks them, and rank decides size and place:

| Rank | Question | Tile | Size |
|---|---|---|---|
| 1 | Is it working? | `.rp-lead`: Fill, the share of the target, a bar and the running total | 4 x 3 |
| 2 | How many, what does it cost? | `.rp-views`, then `.rp-money` (spend of budget, remaining or over budget, the rate), then `.rp-time` while live, stacked beside the lead | 2 each |
| 3 | Show me | `.rp-proof`: the top posts in their real shape | 4 (6 on one platform) |
| 4 | Where? | `.rp-split`: the platform split, only on a two-platform campaign | 2 |
| 5 | Posts and response | `.rp-count`: Total posts, Likes, Comments | 2 each |
| 6 | Who, how people respond | `.rp-creators`, `.rp-resp` | 3 each |

Numbers that explain each other share a tile (fill, target and the running total; spend, budget and rate), so nothing has to be read across the page. Tile labels and subs are PM's wording (campaign-report/report.js). There is no pace line and no verdict. The engagement bento keeps the same frame: Fill, Completions, Spend (with Under review), Time left, Completion checks, Your video, and Right now while live. The detail sits below, last: the chart with its metric switch, every post, proof of work, accounting.

---

## 5. Copy rules and vocabulary

Plain, short, sentence case. No exclamation marks. Never "successfully" or "please". Helpers are one sentence, 12 words or fewer. Never the em dash: use a comma, a colon, a full stop or brackets.

| Concept | Use | Not |
|---|---|---|
| Campaign kinds | "Video growth", "Video engagement" (also in table cells) | "Growth", "YouTube Short" |
| Growth unit | "views" | "real YouTube views" |
| Engagement unit | "completions" (in billing too) | "runs", "jobs", "engagement" |
| Who does the work | "creators" post growth videos; "members" do engagement completions | "people", "agents" |
| Country | "Market" | "Geography", "Country:" |
| Growth price | "Rate per 1,000 views"; "Cost per 1,000 views" in the money tile | "CPM", "Price" |
| Create action | "New campaign" in the app; "Submit for review" at the end | "+ New campaign", "Create campaign" |
| Campaign in review | "In review" | |
| Completion being checked | "Under review" | "In review" |
| Filed before the agency is approved | "Waiting" | |
| Review time | "usually within one working day" | "business day" |
| Remaining time | "Time left", "10 days left" | "Days remaining" |
| Leaving the app | "Sign out" | "Log out" |
| Back from a report | breadcrumb "Campaigns" | "Back to campaigns" |

Toasts are noun plus past tense: "Agency submitted", "Draft saved", "Draft deleted", "Link copied". Empty and big moments get one serif `<em>` word: "Start your first *campaign.*", "No posts *yet*.".

Open for PM: "You never pay more than your budget" versus billing past budget (the report shows Over budget). The wizard makes no budget-cap promise until PM picks.

---

## 6. Multi-platform rules (YouTube and Instagram)

- Every campaign carries `platforms: ['youtube'] | ['instagram'] | ['youtube', 'instagram']`. Marks come only from `onblueData.marks()` (or `onblueNewUI.mark()` in the wizard, where the chip already names the platform).
- Campaigns list: marks on live cards and in the Platform column; a Platform filter pill.
- Wizard: Video growth picks one or both platforms ("Pick one or both."); Video engagement picks the one its video is on, and the link field speaks that platform.
- Report: an All / YouTube / Instagram `.rp-seg` filters every number, chart and post. Under All, a two-platform campaign gets the Platforms split tile. Shared metric names: "Views" means YouTube views and Instagram plays. Instagram-only metrics (Saves) appear only under Instagram.
- Posts: one mixed feed with a platform mark on every thumb, each in its real shape (9:16 Shorts and Reels, 16:9 videos).
- Sample data includes Instagram and two-platform campaigns, so every filter has work to do.

---

## 7. The app's pages

| Page | Shell | What it does |
|---|---|---|
| (homepage gate) | dialog over `brands.html` | Registering stays in the homepage's sign-in dialog, not an app page: one short form belongs in the doorway it starts from. Work email arrives filled from the sign-in door and the website is read off its domain (not for free mail). "Submit for review" then lands on Campaigns, in review. |
| `campaigns.html` | app shell | The home: banner, Needs you, Live now, All campaigns, Sample reports, or the empty state. |
| `new.html` | flow + rail | New campaign: type, What to promote, Budget and schedule, Where it runs, Review. Autosaves a draft; Close saves it. Blocked under 640px with a "Copy link" way out. |
| `campaign.html?id=` | app shell | The campaign page: waiting / in review / rejected states, the growth or engagement report, the post drawer, share and range popovers, the shared-link view. |
| `settings.html` | app shell | Agency settings: name, website, read-only work email; Save stays `aria-disabled` until something changes. |
| `style-guide.html` | app shell | Live specimens of every component, rendered by the real CSS. |

Each page body has `data-page` (`campaigns`, `new`, `settings`), which `shell.js` uses for the current nav item. The `.app-dock` at the bottom of some pages is a prototype review control, not product.

**Session** (`sessionStorage`, the homepage gate's keys): `onblue:signedin`, `onblue:agency`, `onblue:email`, `onblue:site`, `onblue:new` (one-shot "just registered"), `onblue:agency-status` (`review` or `approved`). Opened without signing in, the app shows a demo agency ("Acme Games") so a reviewer is never bounced.

**Stored work** (`localStorage`): `onblue-app-campaigns` (submitted campaigns), `onblue-app-drafts` (wizard drafts), `onblue-app-state` (the dock's list state). Every read and write is wrapped in try/catch; the pages work with storage off.

---

## 8. Checks before handing over (non-visual only)

- Syntax: `node -e "new Function(require('fs').readFileSync('file.js','utf8'))"` on every JS file.
- No em dash: search both the raw character (U+2014) and its HTML entity and JS escape forms. Every search must come back empty.
- File size: every `.js` and `.css` at or under 300 lines; split into siblings when near.
- Tokens: grep new CSS for raw hex, rgba, px font sizes and weights outside the lists above.
- Nobody on the build side opens the pages to look. The designer checks visuals.
