## 04 Type

**Status:** Type ladder, Page titles, Numerals: all Changed from V2.

**Why:** The partner reads this app every day in a 419px window, often at small sizes on Windows. V2 uses 30 font sizes, seven page-title recipes, weight 800 71 times (650, 750 and 900 are requested but never loaded), and four typefaces in a new partner's first minute. Its stack puts SF before Plus Jakarta Sans, so Macs and Windows show different products (index.html:34). The site is Inter end to end; one face, thirteen styles and three weights make the app read as the site's working screen (P6).

**V3 restyle (2026-10-14).** Two values added: `--v2-text-18` for dialog and sheet titles (`.v2-text-title-dialog`, 18/600/-0.03em, the site's sheet title), and `--v2-tracking-figure` -0.045em for big figures (`.v2-text-display`: the credits balance, the out-of-credits 0, the free-credits grant). Eyebrows stay uppercase through CSS only: their source strings are sentence case ("What would you like to do?", "Plan"), so a screen reader and a copy edit read words, not shouting.

### Type ladder (Changed from V2)

**Purpose.** One recipe per text role, so size, weight, leading, tracking and ink travel together and no screen re-decides how loud a line is.

**Anatomy.** Thirteen classes in kit/base.css (size / weight / leading / tracking, ink), plus the row label the list-row parts set themselves:
- `.v2-text-display` 40 / 600 / 1 / -0.045em (`--v2-tracking-figure`), ink, tabular: credits balance.
- `.v2-text-title-dialog` 18 / 600 / 1.35 / -0.03em, ink: dialog and sheet titles (V3 restyle).
- `.v2-text-greeting` 24 / 500 / 1.2 / -0.04em (`--v2-tracking-hero`), ink: home greeting, welcome title, screen titles (the ScreenHeader, section 32). Titles 24 and up follow the site's weight and tracking (review round 1, 2026-10-14); the weight is the look hook `--v2-greeting-weight` (V2 today: 800, review round 2).
- `.v2-text-title-lg` 20 / 600 / 1.2 / -0.02em, ink: empty-state titles and big card heads (screen titles are `.v2-text-greeting`, dialog titles `.v2-text-title-dialog`).
- `.v2-text-numeral-sm` 20 / 600 / 1 / -0.02em, ink, tabular: "7" in "7 of 20 days".
- `.v2-text-title` 16 / 600 / 1.2 / -0.01em, ink: card titles, section heads.
- `.v2-text-mini-title` 13 / 600 / 1.35 / 0.02em, ink: the label over a figure in a card (StatCard), sentence case; the site's `.mini-title` (`onblue/onblue.css:1935-1942`).
- `.v2-text-body` 14 / 400 / 1.5 / -0.01em (`--v2-tracking-label`, the site's body tracking, review round 2), ink-2: bubbles, composer, paragraphs, fields.
- `.v2-text-body-sm` 13 / 400 / 1.5 / -0.01em, ink-3: descriptions, notes, consequences. A `<strong>` inside turns ink 600 (fact muted, figure ink).
- `.v2-text-label` 13 / 500 / 1.35 / -0.01em, ink-2: buttons, chips, nav, menu rows.
- Row label (no class): 14 / 500 / 1.35, ink. The list-row parts set it in their own CSS (ListRow, section 18), so a screen never sets it by hand.
- `.v2-text-meta` 12 / 400 / 1.35, ink-4 (4.77:1): timestamps, counts, hints, and only on surface, panel or canvas at rest. Never the only carrier of a consequence.
- `.v2-text-caption` 12 / 400 / 1.35, ink-3 (6.0:1): a small line that says something: disabled reasons, field helpers and messages, dialog footnotes, notes under a block (`kit/base.css:145-151`; Button, Checkbox, TextField, Dialog, Feedback, BYOK). It is also the small line on a tint, wash or sunken surface, where meta's ink-4 drops under 4.5:1 (4.42:1 on sunken).
- `.v2-text-eyebrow` 11 / 500 / 1 / 0.14em, uppercase, ink-4 (the site's `--dim-ink` step, review round 2): section labels only, at the site's band-head tracking (review round 1, 2026-10-14; was 0.08em; V2 today keeps its 0.08em).
- `.v2-text-mono` 13 / 400 / 1.35, mono, ink-2: keys, endpoints, model ids.

**Variants.** Faces: `--v2-font-ui` (Inter, then system-ui and Segoe UI), `--v2-font-mono`, `--v2-font-serif` (Instrument Serif italic, site-language sign-in pages only). Weights: 400 body, 500 labels and titles 24 and up, 600 titles and figures. Helpers: `.v2-tabular`, `.v2-truncate`, `.v2-prose`.

**Sizes.** 11, 12, 13, 14, 16, 20, 24, 40 (`--v2-text-*`). Nothing in between.

**States.** One per style. Sample copy in the guide is quoted from V2 (for example `'Every task and job BlueAI does uses credits.'`, index.html:536).

**Props.** Classes only. Inline font sizes are not allowed in kit or screens.

**Motion.** None.

**Accessibility.** Smallest running text 12 (meta and caption); 11 only for uppercase eyebrows. Body ink-2 or darker. Sentence case everywhere except the eyebrow, which is uppercase by CSS, not in the source string.

**Responsive.** Sizes do not change with the window height.

**Do / Don't.** Do pick a style by role. Do load Inter 400/500/600 only. Don't use 700 or 800. Don't set status words as uppercase eyebrows: they are Badges in sentence case. Decision D11 lets the PM keep Plus Jakarta Sans; the scale and weights hold either way.

### Page titles, V2 today (Changed from V2)

**Purpose.** One title recipe for every screen, one for every dialog.

**Anatomy.** Screens: `.v2-text-greeting`, 24 / 500 / 1.2 / -0.04em, ink, in the ScreenHeader (section 32; review round 2, 2026-10-14). Dialogs and sheets: `.v2-text-title-dialog`, 18 / 600 / -0.03em (section 25).

**Variants.** None.

**Sizes.** 24 and 18.

**States.** V2 today has seven: AI Credits 19/800 (index.html:448), Chat History 22/800 (history.jsx:91), Scheduled tasks 20/700 (schedule.jsx:118), Coming Soon 22/800 in #1e293b (jobs.jsx:140), Before you start 20/800 (terms_sheet.jsx:114), Logout 19/800 (profile.jsx:75), modal 18/600 (shared.jsx:75). Reach them from `?start=worker` through the header menus and tabs.

**Props.** The ScreenHeader and Dialog own the title; screens pass a string.

**Motion.** None.

**Accessibility.** The screen title is the screen's `h1` and takes focus on navigation (`tabIndex=-1`, no visible ring).

**Responsive.** One line; long titles truncate with an ellipsis rather than wrap.

**Do / Don't.** Do use the same title on every screen. Don't style a title inline. Copy changes (Logout becomes Sign out) live in section 70.

### Numerals (Changed from V2)

**Purpose.** Figures that matter (credits, days, money) read as facts: ink, tabular, never a gradient or a status colour.

**Anatomy.** `.v2-text-display` for the credits balance; `.v2-text-numeral-sm` beside a label for counts; inside notes, `<strong>` turns a figure ink 600.

**Variants.** Balance, count, money in a sentence.

**Sizes.** 40, 20, and body size inside notes.

**States.** Credits balance (V2: 54/800 gradient, 38/800 at zero, index.html:527, byok.jsx:51; reach with `?credits=0`). "7 of 20 days" (V2: the popup's status line "Day 7 of 20. Pending verification" 13.5 ink-2, worker_day_done.jsx:130, reach with `?end=job`; the home strip left V2 on 2026-10-14). "$6 earned" (V2 shows no money in the app since 2026-10-14).

**Props.** Classes only; format with `toLocaleString('en-US')`.

**Motion.** Numbers change in place without counting animations.

**Accessibility.** Tabular figures stop numbers jumping as they change. A figure is never the only thing that says whether a day counted: the tick and its words do.

**Responsive.** Not applicable.

**Do / Don't.** Do put money in ink (the site's rule: money is a figure, not a state). Don't colour a count green to mean counted. Don't gradient a number.
