## 06 Shape, stroke, elevation, layers

**Status:** Radius ladder, Elevation, Scrims and layers: all Changed from V2.

**Why:** The product should feel like the site's quiet working screen: one button shape, hairlines instead of shadows, one veil. V2 has twenty radii in live code (buttons alone 8, 9, 10, 20, 40 and 999, two of them on the same settings screen), 154 shadow declarations from 55 recipes with 15 coloured glows, seven scrim recipes, and two dialogs tied at z-index 120. Fewer, named steps make every surface say how far it sits from the page (P5, P6).

### Radius ladder (Changed from V2)

**Purpose.** Six radii, each with a job.

**Anatomy.** `--v2-radius-xs` 4 (checkbox box, day-bar segment, tooltip arrow), `-sm` 6 (buttons, fields, segmented items, menu rows, icon buttons: the site's button radius), `-md` 10 (rows, banners, composer, menus, tooltips, segmented track), `-lg` 16 (cards, bubbles, dialogs, sheet top corners: the site's card radius), `-pill` (badges, quick-reply chips, credits chip, progress rail), `-round` (avatars, discs, send). Strokes: `--v2-stroke` 1px for every edge; `--v2-stroke-selected` 1.5px for a selected choice, the focused composer, and the two outlined marks that must still read at 6 to 8px: the ring status dot (paused, offline: `kit/shell.css:80`) and the pending DayBar segment (`kit/worker.css:78`). A 2px step is not a stroke token; it appears only as mark geometry, sized with its mark: the spinner ring and the checkbox tick (glyph lines), the 2px surface halo that cuts a count dot out of what it sits on (`kit/credits.css:33`, `kit/display.css:89`), and the 2px left rule of the job preview's quoted comment (`kit/worker.css:151`). Icon glyphs draw at their own weight (StatusTick 2.5, `kit/program.jsx:29`).

**Variants.** As listed.

**Sizes.** 4, 6, 10, 16, 999, 50%.

**States.** Selected uses 1.5px `--v2-select-line` on `--v2-select`. V2 today: Settings (`?start=worker`, then Settings) shows Connect Telegram at radius 20 (settings.jsx:59) and Save settings at 8 (settings.jsx:138) on one screen.

**Props.** Tokens only.

**Motion.** None.

**Accessibility.** Shape never carries meaning alone (a pill is not a status without its word).

**Responsive.** Not applicable.

**Do / Don't.** Do make every button 6. Do nest radii inner-smaller (card 16, row 10, control 6). Don't use 8, 9, 12, 14, 18 or 20. Don't use pill buttons.

### Elevation (Changed from V2)

**Purpose.** How far a surface sits from the page: in flow, floating, or blocking.

**Anatomy.** `--v2-shadow-0` none plus a 1px line (cards, bubbles, banners, rows, top bar, bottom nav, composer). `--v2-shadow-1` navy cast for menus, popovers, tooltips, coach mark, toast. `--v2-shadow-2` deeper navy cast for dialogs, sheets and day done.

**Variants.** Three levels.

**Sizes.** Not applicable.

**States.** Level 0, 1, 2. V2 today: the user bubble's indigo glow (chat_bubbles.jsx:30, any chat), the bottom nav casting upward (shared.jsx:300), day done at 0.45 black (worker_day_done.jsx:142, `?end=job`).

**Props.** Tokens only.

**Motion.** Shadows do not animate; the surface arrives with its own motion (section 07).

**Accessibility.** Elevation is never the only sign of a modal: the veil and focus management are (section 09).

**Responsive.** Not applicable.

**Do / Don't.** Do separate in-flow things with a line. Don't add coloured glows. Don't lift a card on hover; firm up its line.

### Scrims and layers (Changed from V2)

**Purpose.** One veil for every decision, the site's frosted gate for sign-in, and a named order of layers inside the window.

**Anatomy.** `--v2-scrim` rgba(11,18,32,0.48) under every dialog, sheet and day done. `--v2-scrim-frost` rgba(248,249,251,0.88) with `--v2-scrim-blur` 14px, the site's gate, for sign-in only. Z-scale: `--v2-z-raised` 1, `-sticky` 10, `-header` 20, `-popover` 30, `-dialog` 100, `-gate` 110, `-toast` 120, `-splash` 200.

**Variants.** Dim, frost.

**Sizes.** Veils cover the content box (inset 0), never the browser.

**States.** Dim and frost. V2 today: logout veil rgba(15,23,42,0.45) z 120 (profile.jsx:73), terms veil rgba(8,10,31,0.44) z 120, the tie (terms_sheet.jsx:97, bare URL), out-of-credits rgba(15,23,42,0.5) z 130 (byok.jsx:79, `?credits=0` then send), modal rgba(0,0,0,0.5) z 60 (shared.jsx:72), sign-in white 55% with blur 10 z 100 (login.jsx:74, `?signin=browser`).

**Props.** Dialog and Sheet own their veil (sections 25, 26).

**Motion.** The veil runs the `v2-fade` keyframe in its own rule (there is no class for it): in at `--v2-dur-3` ease-standard, out reversed at `--v2-dur-3` ease-in when the overlay closes (`kit/overlays.css:22, 28`; section 07).

**Accessibility.** A veil means the content under it is inert: focus is trapped above it.

**Responsive.** Not applicable.

**Do / Don't.** Don't stack a dialog on a dialog (section 25); mount order on `--v2-z-dialog` only settles an overlap that cannot be avoided (one dialog still fading out while the next one opens), and the later one sits on top. Don't blur outside sign-in: a white dialog on a pale frosted veil separates only by its shadow, while the dim veil puts its edge at 3.3:1 (WCAG 1.4.11, the Overlay family in `tokens.css:161-162`). Don't invent a z-index: pick a layer.
