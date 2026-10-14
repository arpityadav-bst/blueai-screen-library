## 08 Icons

**Status:** Icon set: Changed from V2.

**Why:** Icons label the controls the partner uses to keep the worker in check (Always ask, Automatic, pause, disconnect), so each meaning needs one glyph everywhere. V2 redraws its clock, chat, help and sign-out glyphs two or three times per file at 14 to 22px, with 16 different stroke widths and hard-coded hexes such as #64748b (index.html:303-328, shared.jsx:7-40). One registry ends that and matches the site's stroke style (onblue/index.html:307-330).

**V3 restyle (2026-10-14).** Decision: `--v2-icon-stroke` 1.75 applies to every product icon set (the kit Icon and any inline set a screen draws), at every size. The exceptions are marks, not icons: the filled spark, and 2px mark geometry (a tick inside a disc, the spinner ring). The spark also ships as an image (`assets/spark.svg`, Target blue) for places that take only an image: taskbar, toast, installer, favicon.

### Icon set (Changed from V2)

**Purpose.** One named module, `window.V2Kit.Icon`, for every glyph the product draws.

**Anatomy.** A 24-unit glyph, round caps and joins, `stroke: currentColor`, `fill: none`. Names: home, activity, settings, chat, help, more, close, back, chevron-right, chevron-down, external, check, check-double, x-circle, alert, info, clock, calendar, play, pause, stop, send, refresh, spark (filled), credits (gradient), youtube, instagram, shield-check (Always ask), zap (Automatic), user, sign-out, bell, link, trash, copy, lock, wifi-off, download, thumb-up, thumb-down, eye; added for the kit: check-circle, chevron-left, chevron-up, arrow-up, arrow-right, plus, minus, search, edit, key, earnings, monitor (BlueStacks, App Player), telegram, briefcase (the Jobs tab, review round 2). Aliases resolve common guesses (x, arrow-left, warning, error, verified, always-ask, automatic, logout, external-link, dollar, bluestacks, offline).

**Variants.** Stroke (all but two); filled: spark (the site's mark); painted: credits (V2's own drawing, assets/Credits.svg, shown as an image; never a mask fill).

**Sizes.** 16 `--v2-icon-sm` (inline, chips, menu rows), 20 `--v2-icon-md` (top bar, nav, list rows), 24 `--v2-icon-lg` (empty states, dialog marks). The stroke renders 1.75px at every size (`--v2-icon-stroke`, compensated per size in kit/base.css).

**States.** No states of its own: it takes the colour of its parent. Idle `--v2-ink-3`, active `--v2-ink` (or `--v2-blue` for the lit nav item), on a tint the tone ink, on a fill `--v2-on-color`. V2 today: nav glyphs 22px stroke 1.9 (shared.jsx:7-8), menu glyphs 18px stroke 2 in #64748b (index.html:303), close 2.5 (shared.jsx:28), mode glyphs stroke 2 (agent_permissions.jsx:42-45); reach with `?start=worker`.

**Props.** `Icon { name, size = 16 | 20 | 24, label, inline, className }`. Without `label` it is decorative (`aria-hidden`); with `label` it is `role="img"` named by it. `inline` aligns it to the text baseline. `V2Kit.ICON_NAMES` lists every name. An unknown name renders an empty box of the right size and warns once in the console.

**Motion.** None. A spinner is not an icon (section 20).

**Accessibility.** An icon next to a word adds nothing for screen readers, so it stays hidden; an icon alone is named (IconButton requires a label). Colour never carries the meaning alone.

**Responsive.** Not applicable.

**Do / Don't.** Do add a glyph to the registry, then use it by name. Do keep shield-check for Always ask and zap for Automatic. Don't draw an inline svg in a part. Don't set a colour on the icon itself. Don't use brand-coloured app logos: YouTube and Instagram are drawn in the product's stroke style.
